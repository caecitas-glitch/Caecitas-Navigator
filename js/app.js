/**
 * Caecitas Navigator - Fleet Logistics & Starmap Route Optimizer
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.SC_DATA;
  const canvas = document.getElementById("starmap-canvas");

  // ==========================================
  // AUTO-SHUTDOWN HEARTBEAT LIFECYCLE (Local python server only)
  // ==========================================
  const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (isLocalHost) {
    setInterval(() => {
      fetch("/heartbeat", { method: "GET", cache: "no-store" }).catch(() => {});
    }, 2500);

    window.addEventListener("beforeunload", () => {
      try {
        navigator.sendBeacon("/shutdown");
      } catch (e) {}
    });

    window.addEventListener("pagehide", () => {
      try {
        navigator.sendBeacon("/shutdown");
      } catch (e) {}
    });
  }

  // ==========================================
  // STATE MANAGEMENT (100% CLEAN STARTUP - ZERO PREMADE ROUTES)
  // ==========================================
  let haulingMode = "bulk"; // "bulk" or "contracts"
  let startingLocationId = null; // Clean: no default starting point
  let fromList = [];            // Clean: 0 default pickups
  let toList = [];              // Clean: 0 default dropoffs
  let contractsList = [];       // Clean: 0 default contracts

  // Active Fleet Roster (Clean Slate: 0 default ships)
  const fleetColors = ["#00f0ff", "#f59e0b", "#c084fc", "#10b981", "#f43f5e", "#38bdf8", "#fbbf24", "#a855f7"];
  let fleetShips = []; // Clean slate: ZERO default ships

  let selectedCommodityId = "";
  let completedStepUids = new Set();
  let currentFleetResult = null;
  let activeViewTab = "fleet"; // "fleet" or ship ID
  let activeHudShipId = "all"; // "all" or ship ID in Cockpit HUD

  // Contract selection temp state
  let selectedContractFrom = null;
  let selectedContractTo = null;

  // Initialize Route Optimizer
  const optimizer = new RouteOptimizer(data);

  // Initialize Map
  const map = new StarMap(canvas, data, (selectedNode) => {
    showNodeInspector(selectedNode);
  });

  // UI Elements
  const systemButtons = document.querySelectorAll(".sys-btn");
  const fleetRosterContainer = document.getElementById("fleet-roster-container");
  const fleetShipSelector = document.getElementById("fleet-ship-selector");
  const btnAddFleetShip = document.getElementById("btn-add-fleet-ship");
  const fleetTotalCapBadge = document.getElementById("fleet-total-capacity");

  // Referral Code & Sharing Elements
  const btnCopyReferral = document.getElementById("btn-copy-referral");
  const btnShareRoute = document.getElementById("btn-share-route");
  const avoidThreatsToggle = document.getElementById("avoid-threats-toggle");

  // Cockpit HUD Elements
  const btnCockpitHud = document.getElementById("btn-cockpit-hud");
  const btnCloseHud = document.getElementById("btn-close-hud");
  const cockpitHudOverlay = document.getElementById("cockpit-hud-overlay");
  const hudShipTabs = document.getElementById("hud-ship-tabs");
  const hudEtaTimer = document.getElementById("hud-eta-timer");
  const hudLegsStream = document.getElementById("hud-legs-stream");

  // Mode Switcher Elements
  const modeBulkBtn = document.getElementById("mode-bulk-btn");
  const modeContractsBtn = document.getElementById("mode-contracts-btn");
  const bulkModeContainer = document.getElementById("bulk-mode-container");
  const contractsModeContainer = document.getElementById("contracts-mode-container");
  const contractFromInput = document.getElementById("contract-from-input");
  const contractFromDropdown = document.getElementById("contract-from-dropdown");
  const contractToInput = document.getElementById("contract-to-input");
  const contractToDropdown = document.getElementById("contract-to-dropdown");
  const contractScuInput = document.getElementById("contract-scu-input");
  const contractLabelInput = document.getElementById("contract-label-input");
  const btnAddContract = document.getElementById("btn-add-contract");
  const contractsListContainer = document.getElementById("contracts-list-container");
  const contractsTotalScuBadge = document.getElementById("contracts-total-scu-badge");

  const startChipContainer = document.getElementById("start-chip-container");
  const startInput = document.getElementById("start-input");
  const startDropdown = document.getElementById("start-dropdown");
  const fromChipsContainer = document.getElementById("from-chips");
  const toChipsContainer = document.getElementById("to-chips");
  const fromInput = document.getElementById("from-input");
  const fromScuInput = document.getElementById("from-scu-input");
  const toInput = document.getElementById("to-input");
  const fromDropdown = document.getElementById("from-dropdown");
  const toDropdown = document.getElementById("to-dropdown");
  const qtDriveSelect = document.getElementById("qt-drive-select");
  const commoditySelect = document.getElementById("commodity-select");
  const commodityInputs = document.getElementById("commodity-inputs");
  const commBuyPriceInput = document.getElementById("comm-buy-price");
  const commSellPriceInput = document.getElementById("comm-sell-price");
  const commResultsContainer = document.getElementById("commodity-results-container");
  const commNetProfitEl = document.getElementById("comm-net-profit");
  const commTotalScuEl = document.getElementById("comm-total-scu");
  const commRevenueEl = document.getElementById("comm-revenue");
  const commFuelCostEl = document.getElementById("comm-fuel-cost");
  const commNetPocketEl = document.getElementById("comm-net-pocket");
  const padWarningContainer = document.getElementById("pad-warning-container");
  const fuelAlertContainer = document.getElementById("fuel-alert-container");
  const optimizeBtn = document.getElementById("optimize-btn");
  const clearBtn = document.getElementById("clear-btn");
  const routeResultsPanel = document.getElementById("route-results");
  const fleetTabsBar = document.getElementById("fleet-tabs-bar");
  const activeTabTitle = document.getElementById("active-tab-title");
  const breadcrumbDisplay = document.getElementById("breadcrumb-display");
  const legsContainer = document.getElementById("legs-container");
  const totalDistEl = document.getElementById("total-dist");
  const totalTimeEl = document.getElementById("total-time");
  const totalCargoCapEl = document.getElementById("total-cargo-cap");
  const totalFuelStatusEl = document.getElementById("total-fuel-status");
  const btnSaveTempRoute = document.getElementById("btn-save-temp-route");
  const savedRoutesContainer = document.getElementById("saved-routes-container");
  const inspectorPanel = document.getElementById("node-inspector");

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  function showToast(msg) {
    const toast = document.getElementById("app-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3200);
  }

  // ==========================================
  // REFERRAL CODE COPY
  // ==========================================
  if (btnCopyReferral) {
    btnCopyReferral.addEventListener("click", () => {
      navigator.clipboard.writeText("STAR-6VLH-WPMS").then(() => {
        btnCopyReferral.textContent = "Copied!";
        showToast("Referral Code STAR-6VLH-WPMS copied (+5,000 aUEC)!");
        setTimeout(() => {
          btnCopyReferral.textContent = "Copy";
        }, 2200);
      });
    });
  }

  // ==========================================
  // POPULATE DROPDOWNS
  // ==========================================
  if (data.ships) {
    data.ships.forEach(ship => {
      const opt = document.createElement("option");
      opt.value = ship.id;
      opt.textContent = `${ship.name} (${ship.scu > 0 ? ship.scu.toLocaleString() + ' SCU' : 'Custom SCU'})`;
      fleetShipSelector.appendChild(opt);
    });
  }

  data.quantumDrives.forEach(drive => {
    const opt = document.createElement("option");
    opt.value = drive.id;
    opt.textContent = `${drive.name} (${(drive.speedMkmPerSec * 1000).toLocaleString()} km/s)`;
    if (drive.id === "size3_industrial") {
      opt.selected = true;
    }
    qtDriveSelect.appendChild(opt);
  });

  if (data.commodities) {
    data.commodities.forEach(comm => {
      const opt = document.createElement("option");
      opt.value = comm.id;
      opt.textContent = `${comm.name} (${comm.buyPrice.toLocaleString()} -> ${comm.sellPrice.toLocaleString()} aUEC)`;
      commoditySelect.appendChild(opt);
    });
  }

  // Commodity selector listener
  commoditySelect.addEventListener("change", () => {
    selectedCommodityId = commoditySelect.value;
    const comm = data.commodities.find(c => c.id === selectedCommodityId);
    if (comm) {
      commodityInputs.classList.remove("hidden");
      commBuyPriceInput.value = comm.buyPrice;
      commSellPriceInput.value = comm.sellPrice;
    } else {
      commodityInputs.classList.add("hidden");
      commBuyPriceInput.value = "";
      commSellPriceInput.value = "";
    }
    if (currentFleetResult) {
      executeFleetOptimization();
    }
  });

  commBuyPriceInput.addEventListener("input", () => {
    if (currentFleetResult) executeFleetOptimization();
  });
  commSellPriceInput.addEventListener("input", () => {
    if (currentFleetResult) executeFleetOptimization();
  });

  // Threat toggle listener
  if (avoidThreatsToggle) {
    avoidThreatsToggle.addEventListener("change", () => {
      if ((haulingMode === "bulk" && fromList.length > 0 && toList.length > 0) ||
          (haulingMode === "contracts" && contractsList.length > 0)) {
        executeFleetOptimization();
      }
    });
  }

  // ==========================================
  // HAULING MODE SWITCHER (BULK vs CONTRACT MISSIONS)
  // ==========================================
  function updateModeUI() {
    if (haulingMode === "bulk") {
      modeBulkBtn.classList.add("active");
      modeContractsBtn.classList.remove("active");
      bulkModeContainer.classList.remove("hidden");
      contractsModeContainer.classList.add("hidden");
    } else {
      modeContractsBtn.classList.add("active");
      modeBulkBtn.classList.remove("active");
      contractsModeContainer.classList.remove("hidden");
      bulkModeContainer.classList.add("hidden");
    }
  }

  modeBulkBtn.addEventListener("click", () => {
    haulingMode = "bulk";
    updateModeUI();
    if (fromList.length > 0 && toList.length > 0) {
      executeFleetOptimization();
    }
  });

  modeContractsBtn.addEventListener("click", () => {
    haulingMode = "contracts";
    updateModeUI();
    if (contractsList.length > 0) {
      executeFleetOptimization();
    }
  });

  // ==========================================
  // PAIRED CONTRACT MISSIONS CREATOR
  // ==========================================
  setupAutocomplete(contractFromInput, contractFromDropdown, (loc) => {
    selectedContractFrom = loc;
    contractFromInput.value = loc.name;
    contractFromDropdown.classList.add("hidden");
  });

  setupAutocomplete(contractToInput, contractToDropdown, (loc) => {
    selectedContractTo = loc;
    contractToInput.value = loc.name;
    contractToDropdown.classList.add("hidden");
  });

  btnAddContract.addEventListener("click", () => {
    if (!selectedContractFrom || !selectedContractTo) {
      alert("Please select both an Origin Pickup and a Designated Destination.");
      return;
    }

    const scuVal = parseInt(contractScuInput.value) || 100;
    const labelVal = contractLabelInput.value.trim() || "Waste / General";
    const contractNum = contractsList.length + 1;

    const newContract = {
      id: `c_${Date.now()}_${contractNum}`,
      name: `Contract #${contractNum}`,
      cargoName: labelVal,
      fromId: selectedContractFrom.id,
      toId: selectedContractTo.id,
      fromName: selectedContractFrom.name,
      toName: selectedContractTo.name,
      scu: scuVal
    };

    contractsList.push(newContract);

    // Clear contract inputs
    contractFromInput.value = "";
    contractToInput.value = "";
    contractScuInput.value = "";
    contractLabelInput.value = "";
    selectedContractFrom = null;
    selectedContractTo = null;

    renderContractsList();
    executeFleetOptimization();
  });

  function renderContractsList() {
    contractsListContainer.innerHTML = "";
    let totalScu = 0;

    contractsList.forEach((c, idx) => {
      totalScu += c.scu;
      const card = document.createElement("div");
      card.className = "contract-item-card";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="font-bold text-xs text-amber-300">#${idx + 1} ${c.cargoName}</div>
          <button class="chip-remove text-slate-400 hover:text-red-400 text-sm" data-id="${c.id}">&times;</button>
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-slate-200">
          <span class="text-cyan-400 font-medium">${c.fromName}</span>
          <span class="text-slate-500">➔</span>
          <span class="text-emerald-400 font-medium">${c.toName}</span>
        </div>
        <div class="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-0.5 border-t border-slate-800/80">
          <span>Payload:</span>
          <span class="text-amber-400 font-bold">${c.scu.toLocaleString()} SCU</span>
        </div>
      `;

      card.querySelector(".chip-remove")?.addEventListener("click", () => {
        contractsList = contractsList.filter(item => item.id !== c.id);
        renderContractsList();
        if (contractsList.length > 0) {
          executeFleetOptimization();
        } else {
          clearFleetResults();
        }
      });

      contractsListContainer.appendChild(card);
    });

    contractsTotalScuBadge.textContent = `${totalScu.toLocaleString()} SCU Total`;
  }

  // ==========================================
  // FLEET MANAGEMENT (MULTI-SHIP ROSTER & PER-SHIP DEPARTURE PORTS)
  // ==========================================
  function renderFleetRoster() {
    fleetRosterContainer.innerHTML = "";
    let totalCap = 0;

    if (fleetShips.length === 0) {
      fleetRosterContainer.innerHTML = `
        <div class="p-3 text-xs text-slate-500 italic border border-dashed border-slate-800 rounded text-center">
          No vessels in fleet. Select a ship below and click "+ Add Ship".
        </div>
      `;
      fleetTotalCapBadge.textContent = "Fleet Total: 0 SCU";
      return;
    }

    const departureLocations = data.locations
      .filter(l => l.type === "station" || l.type === "city" || l.type === "jump_point" || l.type === "rest_stop")
      .sort((a, b) => a.name.localeCompare(b.name));

    const globalStartName = startingLocationId ? (data.locationMap[startingLocationId]?.name || startingLocationId) : "None";

    fleetShips.forEach((ship, idx) => {
      totalCap += ship.scu;
      const card = document.createElement("div");
      card.className = "fleet-ship-card flex-col items-stretch gap-1.5";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" style="background: ${ship.color}; box-shadow: 0 0 6px ${ship.color};"></span>
            <span class="font-bold text-white text-xs">#${idx + 1} ${ship.name}</span>
            <span class="text-[10px] font-mono font-bold" style="color: ${ship.color};">${ship.scu.toLocaleString()} SCU</span>
          </div>
          <button class="chip-remove text-slate-400 hover:text-red-400 text-sm" data-id="${ship.id}">&times;</button>
        </div>
        <div class="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
          <span class="text-slate-400">Departure:</span>
          <select class="ship-start-select form-select text-[10px] py-0.5 px-1 bg-slate-900 border border-slate-700 text-slate-200 rounded" style="max-width: 195px;" data-id="${ship.id}">
            <option value="">-- Fleet Base (${globalStartName}) --</option>
            ${departureLocations.map(l => `<option value="${l.id}" ${ship.startLocationId === l.id ? 'selected' : ''}>${l.name} (${l.system.toUpperCase()})</option>`).join('')}
          </select>
        </div>
      `;

      card.querySelector(".ship-start-select").addEventListener("change", (e) => {
        ship.startLocationId = e.target.value || null;
        if ((haulingMode === "bulk" && fromList.length > 0 && toList.length > 0) ||
            (haulingMode === "contracts" && contractsList.length > 0)) {
          executeFleetOptimization();
        }
      });

      card.querySelector(".chip-remove")?.addEventListener("click", () => {
        fleetShips = fleetShips.filter(s => s.id !== ship.id);
        renderFleetRoster();
        if (fleetShips.length > 0 &&
            ((haulingMode === "bulk" && fromList.length > 0 && toList.length > 0) ||
             (haulingMode === "contracts" && contractsList.length > 0))) {
          executeFleetOptimization();
        } else if (fleetShips.length === 0) {
          clearFleetResults();
        }
      });

      fleetRosterContainer.appendChild(card);
    });

    fleetTotalCapBadge.textContent = `Fleet Total: ${totalCap.toLocaleString()} SCU`;
  }

  btnAddFleetShip.addEventListener("click", () => {
    const selectedTypeId = fleetShipSelector.value;
    const shipTemplate = data.ships.find(s => s.id === selectedTypeId);
    if (!shipTemplate) return;

    const newIdx = fleetShips.length;
    const color = fleetColors[newIdx % fleetColors.length];
    const newShip = {
      id: `ship_${Date.now()}`,
      typeId: shipTemplate.id,
      name: `${shipTemplate.name}`,
      scu: shipTemplate.scu,
      fuelTankL: shipTemplate.fuelTankL || 11000,
      qtDriveId: shipTemplate.qtDriveId || "size3_industrial",
      color: color,
      startLocationId: startingLocationId || null
    };

    fleetShips.push(newShip);
    renderFleetRoster();
    if ((haulingMode === "bulk" && fromList.length > 0 && toList.length > 0) ||
        (haulingMode === "contracts" && contractsList.length > 0)) {
      executeFleetOptimization();
    }
  });

  renderFleetRoster();

  // ==========================================
  // SYSTEM SWITCHERS & MAP CONTROLS
  // ==========================================
  systemButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      systemButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const sys = btn.getAttribute("data-system");
      map.setSystem(sys);
    });
  });

  document.getElementById("btn-zoom-in")?.addEventListener("click", () => {
    map.zoom = Math.min(120, map.zoom * 1.25);
  });
  document.getElementById("btn-zoom-out")?.addEventListener("click", () => {
    map.zoom = Math.max(1.5, map.zoom * 0.8);
  });
  document.getElementById("btn-reset-view")?.addEventListener("click", () => {
    map.centerView();
  });

  // Global search input
  const globalSearch = document.getElementById("global-search");
  const globalSearchDropdown = document.getElementById("global-search-dropdown");

  setupAutocomplete(globalSearch, globalSearchDropdown, (selectedLoc) => {
    map.focusOnNode(selectedLoc.id);
    showNodeInspector(selectedLoc);
    globalSearch.value = "";
  });

  // Autocomplete for STARTING LOCATION
  setupAutocomplete(startInput, startDropdown, (loc) => {
    startingLocationId = loc.id;
    startInput.value = "";
    startDropdown.classList.add("hidden");
    renderStartChip();
    if ((haulingMode === "bulk" && fromList.length > 0 && toList.length > 0) ||
        (haulingMode === "contracts" && contractsList.length > 0)) {
      executeFleetOptimization();
    }
  });

  // Autocomplete for FROM and TO inputs
  setupAutocomplete(fromInput, fromDropdown, (loc) => {
    const scuVal = parseInt(fromScuInput.value) || 0;
    addFrom(loc.id, scuVal);
    fromInput.value = "";
    fromScuInput.value = "";
    fromDropdown.classList.add("hidden");
  });

  setupAutocomplete(toInput, toDropdown, (loc) => {
    addTo(loc.id);
    toInput.value = "";
    toDropdown.classList.add("hidden");
  });

  function setupAutocomplete(inputEl, dropdownEl, onSelect) {
    if (!inputEl || !dropdownEl) return;

    inputEl.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q.length === 0) {
        dropdownEl.classList.add("hidden");
        dropdownEl.innerHTML = "";
        return;
      }

      const matches = data.locations.filter(loc => {
        return loc.name.toLowerCase().includes(q) ||
               loc.id.toLowerCase().includes(q) ||
               (loc.faction && loc.faction.toLowerCase().includes(q)) ||
               (loc.parent && loc.parent.toLowerCase().includes(q));
      }).slice(0, 15);

      if (matches.length === 0) {
        dropdownEl.innerHTML = `<div class="p-2 text-xs text-slate-400">No matching landmarks found</div>`;
        dropdownEl.classList.remove("hidden");
        return;
      }

      dropdownEl.innerHTML = "";
      matches.forEach(loc => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.innerHTML = `
          <div class="font-medium text-slate-200">${loc.name}</div>
          <div class="text-[10px] text-cyan-400 uppercase tracking-wider">${loc.system.toUpperCase()} &bull; ${loc.type} &bull; ${loc.security}</div>
        `;
        item.addEventListener("mousedown", (ev) => {
          ev.preventDefault();
          onSelect(loc);
          dropdownEl.classList.add("hidden");
        });
        dropdownEl.appendChild(item);
      });
      dropdownEl.classList.remove("hidden");
    });

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = inputEl.value.trim().toLowerCase();
        if (!q) return;
        const firstMatch = data.locations.find(loc =>
          loc.name.toLowerCase().includes(q) || loc.id.toLowerCase().includes(q)
        );
        if (firstMatch) {
          onSelect(firstMatch);
          inputEl.value = "";
          dropdownEl.classList.add("hidden");
        }
      }
    });

    inputEl.addEventListener("blur", () => {
      setTimeout(() => dropdownEl.classList.add("hidden"), 200);
    });
  }

  // ==========================================
  // STARTING LOCATION CHIP & WAYPOINTS
  // ==========================================
  function renderStartChip() {
    startChipContainer.innerHTML = "";
    if (!startingLocationId) {
      renderFleetRoster();
      return;
    }

    const loc = data.locationMap[startingLocationId];
    const chip = document.createElement("div");
    chip.className = "location-chip";
    chip.style.borderColor = "rgba(96, 165, 250, 0.4)";
    chip.style.background = "rgba(59, 130, 246, 0.15)";
    chip.innerHTML = `
      <span class="chip-badge" style="background: #3b82f6;">FLEET BASE</span>
      <span class="chip-name" style="color: #93c5fd;" title="${loc ? loc.name : startingLocationId}">${loc ? loc.name : startingLocationId}</span>
      <button class="chip-remove" title="Clear Starting Position">&times;</button>
    `;
    chip.querySelector(".chip-remove").addEventListener("click", () => {
      startingLocationId = null;
      renderStartChip();
      if ((haulingMode === "bulk" && fromList.length > 0 && toList.length > 0) ||
          (haulingMode === "contracts" && contractsList.length > 0)) {
        executeFleetOptimization();
      }
    });
    startChipContainer.appendChild(chip);
    renderFleetRoster();
  }

  function renderChips() {
    // FROM Chips
    fromChipsContainer.innerHTML = "";
    fromList.forEach((item, idx) => {
      const loc = data.locationMap[item.id];

      const chip = document.createElement("div");
      chip.className = "location-chip from-chip";
      chip.innerHTML = `
        <span class="chip-badge">#${idx + 1}</span>
        <span class="chip-name" title="${loc ? loc.name : item.id}">${loc ? loc.name : item.id}</span>
        ${item.scu > 0 ? `<span class="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">${item.scu} SCU</span>` : ""}
        <button class="chip-remove" data-uid="${item.uid}">&times;</button>
      `;
      chip.querySelector(".chip-remove").addEventListener("click", () => {
        fromList = fromList.filter(it => it.uid !== item.uid);
        renderChips();
      });
      fromChipsContainer.appendChild(chip);
    });

    // TO Chips
    toChipsContainer.innerHTML = "";
    toList.forEach((item, idx) => {
      const loc = data.locationMap[item.id];
      const chip = document.createElement("div");
      chip.className = "location-chip to-chip";
      chip.innerHTML = `
        <span class="chip-badge">#${idx + 1}</span>
        <span class="chip-name" title="${loc ? loc.name : item.id}">${loc ? loc.name : item.id}</span>
        <button class="chip-remove" data-uid="${item.uid}">&times;</button>
      `;
      chip.querySelector(".chip-remove").addEventListener("click", () => {
        toList = toList.filter(it => it.uid !== item.uid);
        renderChips();
      });
      toChipsContainer.appendChild(chip);
    });
  }

  function addFrom(id, scu = 0) {
    const uniqueUid = `p_${id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    fromList.push({ uid: uniqueUid, id: id, scu: scu || 0 });
    renderChips();
  }

  function addTo(id) {
    const uniqueUid = `d_${id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    toList.push({ uid: uniqueUid, id: id });
    renderChips();
  }

  // ==========================================
  // NODE INSPECTOR POPUP
  // ==========================================
  function showNodeInspector(node) {
    if (!node) {
      inspectorPanel.classList.add("hidden");
      return;
    }

    const secClass = node.security.includes("Lawless") || node.security.includes("Contested")
      ? "text-red-400 border-red-500/30 bg-red-500/10"
      : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";

    const moonId = node.id;
    const parentId = node.parent ? node.parent.toLowerCase().replace(/[^a-z0-9]+/g, '_') : null;
    const ores = (data.miningOres && data.miningOres[moonId]) || (parentId && data.miningOres && data.miningOres[parentId]) || null;

    inspectorPanel.innerHTML = `
      <div class="flex items-start justify-between pb-3 border-b border-cyan-500/20">
        <div>
          <div class="text-xs font-mono text-cyan-400 uppercase tracking-widest">${node.system.toUpperCase()} &bull; ${node.type.toUpperCase()}</div>
          <h3 class="text-lg font-bold text-white tracking-wide mt-0.5">${node.name}</h3>
        </div>
        <button id="close-inspector-btn" class="text-slate-400 hover:text-white text-lg px-1">&times;</button>
      </div>

      ${node.isIllegal || node.isPyroHostile ? `
        <div class="mt-2.5 p-2 rounded bg-red-950/50 border border-red-500/60 text-[11px] text-red-300 flex items-center gap-2">
          <span class="text-base shrink-0">⚠️</span>
          <div>
            <div class="font-bold text-red-200 uppercase font-mono tracking-wider">${node.isIllegal ? 'UNMONITORED SCRAP YARD / PIRACY ZONE' : 'PYRO HOSTILE / CONTESTED OUTPOST'}</div>
            <div class="text-[10px] text-red-400 font-mono">${node.threatLevel || 'High Threat'} &bull; Faction: ${node.gang || node.faction || 'Outlaws'}</div>
          </div>
        </div>
      ` : ""}

      <div class="mt-3 space-y-2 text-xs">
        <div class="flex justify-between items-center py-1 border-b border-slate-800">
          <span class="text-slate-400">Security:</span>
          <span class="px-2 py-0.5 rounded text-[11px] border ${secClass}">${node.security}</span>
        </div>
        <div class="flex justify-between items-center py-1 border-b border-slate-800">
          <span class="text-slate-400">Affiliation:</span>
          <span class="text-slate-200 font-medium">${node.gang ? `${node.gang} (${node.faction || 'Outlaws'})` : (node.faction || "Independent")}</span>
        </div>
        <div class="flex justify-between items-center py-1 border-b border-slate-800">
          <span class="text-slate-400">Coordinates:</span>
          <span class="font-mono text-cyan-300">[${node.x.toFixed(2)}, ${node.y.toFixed(2)}] Mkm</span>
        </div>
        ${node.services ? `
          <div class="pt-1">
            <span class="text-slate-400 block mb-1">Services & Amenities:</span>
            <div class="flex flex-wrap gap-1">
              ${node.services.map(s => `<span class="service-pill">${s}</span>`).join("")}
            </div>
          </div>
        ` : ""}
        <p class="text-slate-300 text-[11px] pt-1 leading-relaxed border-t border-slate-800">${node.description || ""}</p>
      </div>

      ${ores && ores.length > 0 ? `
        <div class="mt-3 p-2.5 rounded bg-slate-900/90 border border-amber-500/30">
          <div class="flex justify-between items-center text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
            <span>Surface Mining & Ore Survey</span>
            <span class="text-slate-400 font-normal">Purity Range (Min - Max)</span>
          </div>
          <div class="space-y-2">
            ${ores.map(ore => `
              <div>
                <div class="flex justify-between items-center text-xs mb-0.5">
                  <span class="font-bold text-slate-100 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full" style="background: ${ore.color || '#38bdf8'};"></span>
                    ${ore.name}
                    <span class="text-[9px] font-normal text-slate-400">(${ore.rarity})</span>
                  </span>
                  <span class="font-mono font-bold text-amber-300 text-[11px]">${ore.minQuality}% &ndash; ${ore.maxQuality}%</span>
                </div>
                <div class="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                  <div class="h-full rounded" style="background: ${ore.color || '#38bdf8'}; width: ${ore.maxQuality}%;"></div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <div class="mt-3 pt-2 border-t border-cyan-500/20 space-y-2">
        <button id="set-start-btn" class="action-btn w-full bg-blue-600/30 border border-blue-500/50 hover:bg-blue-600/50 text-blue-200">
          🎯 Set as Fleet Base (All Ships)
        </button>
        ${fleetShips.length > 0 ? `
          <div class="p-1.5 rounded bg-slate-900/80 border border-slate-800">
            <span class="text-slate-400 text-[10px] block mb-1 font-mono uppercase">Or Set Start for Specific Ship:</span>
            <div class="flex flex-wrap gap-1">
              ${fleetShips.map((s, idx) => `
                <button class="set-ship-start-btn text-[10px] px-2 py-0.5 rounded border border-slate-700 bg-slate-800 hover:border-cyan-400 text-slate-200" data-ship-id="${s.id}">
                  <span class="inline-block w-1.5 h-1.5 rounded-full mr-1" style="background: ${s.color};"></span>#${idx + 1} ${s.name.split(' ')[0]}
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}
        <div class="flex items-center gap-2">
          <input type="number" id="inspect-scu-input" placeholder="SCU" min="1" max="100000" class="scu-input" style="width: 75px;">
          <button id="add-inspect-from-btn" class="action-btn from-action flex-1">
            + Add Pickup
          </button>
          <button id="add-inspect-to-btn" class="action-btn to-action flex-1">
            + Add Dropoff
          </button>
        </div>
      </div>
    `;

    inspectorPanel.classList.remove("hidden");

    document.getElementById("close-inspector-btn").addEventListener("click", () => {
      inspectorPanel.classList.add("hidden");
      map.selectedNode = null;
    });

    document.getElementById("set-start-btn").addEventListener("click", () => {
      startingLocationId = node.id;
      renderStartChip();
      if ((haulingMode === "bulk" && fromList.length > 0 && toList.length > 0) ||
          (haulingMode === "contracts" && contractsList.length > 0)) {
        executeFleetOptimization();
      }
    });

    inspectorPanel.querySelectorAll(".set-ship-start-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const sId = btn.getAttribute("data-ship-id");
        const ship = fleetShips.find(s => s.id === sId);
        if (ship) {
          ship.startLocationId = node.id;
          renderFleetRoster();
          if ((haulingMode === "bulk" && fromList.length > 0 && toList.length > 0) ||
              (haulingMode === "contracts" && contractsList.length > 0)) {
            executeFleetOptimization();
          }
        }
      });
    });

    document.getElementById("add-inspect-from-btn").addEventListener("click", () => {
      const scuVal = parseInt(document.getElementById("inspect-scu-input").value) || 0;
      addFrom(node.id, scuVal);
    });

    document.getElementById("add-inspect-to-btn").addEventListener("click", () => {
      addTo(node.id);
    });
  }

  // ==========================================
  // FLEET OPTIMIZATION EXECUTION (BULK VRP & PAIRED CONTRACT MISSIONS)
  // ==========================================
  function executeFleetOptimization() {
    if (fleetShips.length === 0) {
      alert("Please add at least one vessel to your hauling fleet before optimizing.");
      return;
    }

    const driveId = qtDriveSelect.value;
    const buyPrice = commBuyPriceInput.value ? parseFloat(commBuyPriceInput.value) : undefined;
    const sellPrice = commSellPriceInput.value ? parseFloat(commSellPriceInput.value) : undefined;
    const avoidThreats = avoidThreatsToggle ? avoidThreatsToggle.checked : false;

    let fleetResult = null;

    if (haulingMode === "bulk") {
      if (fromList.length === 0 || toList.length === 0) {
        alert("Please specify at least one Pickup (FROM) and one Delivery Destination (TO).");
        return;
      }
      fleetResult = optimizer.computeFleetRoutes(fleetShips, fromList, toList, {
        startLocationId: startingLocationId,
        quantumDriveId: driveId,
        commodityId: selectedCommodityId,
        customBuyPrice: buyPrice,
        customSellPrice: sellPrice,
        avoidThreats: avoidThreats
      });
    } else {
      // Contract missions mode
      if (contractsList.length === 0) {
        alert("Please add at least one Paired Mission Contract.");
        return;
      }
      fleetResult = optimizer.computeContractRoutes(fleetShips, contractsList, {
        startLocationId: startingLocationId,
        quantumDriveId: driveId,
        avoidThreats: avoidThreats
      });
    }

    if (!fleetResult || !fleetResult.fleetRoutes || fleetResult.fleetRoutes.length === 0) {
      alert("Could not compute valid fleet routes for the selected destinations.");
      return;
    }

    currentFleetResult = fleetResult;

    // Tell map to render all ships' flight paths simultaneously!
    map.setFleetRoutes(fleetResult.fleetRoutes);

    // Render Fleet Tabs (Fleet Overview + Per-Ship tabs)
    renderFleetTabs(fleetResult);

    // Update Fleet Summary Metrics
    totalDistEl.textContent = `${fleetResult.totalFleetDistanceMkm} Mkm`;
    totalTimeEl.textContent = fleetResult.maxFleetTimeFormatted;
    totalCargoCapEl.textContent = `${fleetResult.totalFleetScu.toLocaleString()} SCU`;
    totalFuelStatusEl.textContent = `-${fleetResult.totalFleetFuelCost.toLocaleString()} aUEC`;

    // Render Commodity Financials (only in bulk trading mode)
    if (fleetResult.fleetCommodityStats && haulingMode === "bulk") {
      const cs = fleetResult.fleetCommodityStats;
      commResultsContainer.classList.remove("hidden");
      commNetProfitEl.textContent = `${cs.grossProfit >= 0 ? '+' : ''}${cs.grossProfit.toLocaleString()} aUEC`;
      commTotalScuEl.textContent = `${cs.totalScu.toLocaleString()} SCU`;
      commRevenueEl.textContent = `${cs.revenue.toLocaleString()} aUEC`;
      commFuelCostEl.textContent = `-${cs.fuelExpense.toLocaleString()} aUEC`;
      commNetPocketEl.textContent = `${cs.netInPocket >= 0 ? '+' : ''}${cs.netInPocket.toLocaleString()} aUEC`;
      commNetPocketEl.className = `font-mono text-xs font-bold ${cs.netInPocket >= 0 ? 'text-emerald-300' : 'text-red-400'}`;
    } else {
      commResultsContainer.classList.add("hidden");
    }

    // Default view is Fleet Overview
    showTabView(activeViewTab);

    // Show Results Panel
    routeResultsPanel.classList.remove("hidden");

    // If Cockpit HUD is open, refresh HUD
    if (!cockpitHudOverlay.classList.contains("hidden")) {
      renderCockpitHUD();
    }
  }

  function clearFleetResults() {
    currentFleetResult = null;
    map.setFleetRoutes([]);
    completedStepUids.clear();
    routeResultsPanel.classList.add("hidden");
  }

  // ==========================================
  // FLEET TABS & LOG VIEW SWITCHER
  // ==========================================
  function renderFleetTabs(fleetResult) {
    fleetTabsBar.innerHTML = "";

    // Tab 1: Fleet Overview
    const allTab = document.createElement("button");
    allTab.className = `fleet-tab-btn ${activeViewTab === "fleet" ? "active" : ""}`;
    allTab.textContent = `Fleet Combined (${fleetResult.fleetRoutes.length} Ships)`;
    allTab.addEventListener("click", () => {
      activeViewTab = "fleet";
      renderFleetTabs(fleetResult);
      showTabView("fleet");
    });
    fleetTabsBar.appendChild(allTab);

    // Per-Ship Tabs
    fleetResult.fleetRoutes.forEach((route, idx) => {
      const tab = document.createElement("button");
      tab.className = `fleet-tab-btn ${activeViewTab === route.shipInfo.id ? "active" : ""}`;
      tab.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full mr-1" style="background: ${route.color};"></span>
        S${idx + 1}: ${route.shipInfo.name} (${route.totalScu} SCU)
      `;
      tab.addEventListener("click", () => {
        activeViewTab = route.shipInfo.id;
        renderFleetTabs(fleetResult);
        showTabView(route.shipInfo.id);
      });
      fleetTabsBar.appendChild(tab);
    });
  }

  function showTabView(tabId) {
    if (!currentFleetResult) return;

    if (tabId === "fleet") {
      activeTabTitle.textContent = haulingMode === "contracts"
        ? "Combined Fleet Mission Plan (Paired Contracts Isolated)"
        : "Combined Fleet Flight Plan (All Vessels)";
      renderCombinedFleetBreadcrumbs(currentFleetResult);
      renderCombinedFleetLegs(currentFleetResult);
      renderCargoManifest(currentFleetResult.containerManifest, currentFleetResult.totalFleetScu);
    } else {
      const shipRoute = currentFleetResult.fleetRoutes.find(r => r.shipInfo.id === tabId) || currentFleetResult.fleetRoutes[0];
      activeTabTitle.textContent = `${shipRoute.shipInfo.name} - Individual Flight Plan (${shipRoute.totalScu} SCU)`;
      renderShipBreadcrumbs(shipRoute);
      renderShipLegs(shipRoute);
      renderCargoManifest(shipRoute.containerManifest, shipRoute.capacity);
    }
  }

  // ==========================================
  // FREIGHT ELEVATOR MANIFEST & VISUAL CARGO DECK
  // ==========================================
  function renderCargoManifest(manifest, capacity = 0) {
    const pillsContainer = document.getElementById("manifest-kiosk-pills");
    const visualizer = document.getElementById("cargo-deck-visualizer");
    const totalBoxesEl = document.getElementById("manifest-total-boxes");
    const utilEl = document.getElementById("cargo-deck-utilization");

    if (!manifest || manifest.totalScu === 0) {
      pillsContainer.innerHTML = `<span class="text-slate-500 text-xs italic">No active cargo to spawn.</span>`;
      visualizer.innerHTML = `<div class="text-slate-600 text-[11px] p-2 text-center w-full font-mono">Empty cargo hold</div>`;
      totalBoxesEl.textContent = "0 Containers";
      utilEl.textContent = "0% Deck Used";
      return;
    }

    totalBoxesEl.textContent = `${manifest.totalBoxes} Container${manifest.totalBoxes === 1 ? '' : 's'} (${manifest.totalScu.toLocaleString()} SCU)`;
    const utilPercent = capacity > 0 ? Math.min(100, Math.round((manifest.totalScu / capacity) * 100)) : 100;
    utilEl.textContent = `${utilPercent}% Deck Used`;

    // Render Kiosk Spawn Pills
    pillsContainer.innerHTML = "";
    const boxSizes = [32, 24, 16, 8, 2, 1];
    boxSizes.forEach(size => {
      const count = manifest.boxes[size] || 0;
      if (count > 0) {
        const pill = document.createElement("div");
        pill.className = `kiosk-pill kiosk-pill-${size}`;
        pill.innerHTML = `<span>${count}&times;</span> <span>${size} SCU Box</span> <span class="text-[9px] opacity-75">(${count * size} SCU)</span>`;
        pillsContainer.appendChild(pill);
      }
    });

    // Render Visual Deck Grid
    visualizer.innerHTML = "";
    boxSizes.forEach(size => {
      const count = manifest.boxes[size] || 0;
      for (let i = 0; i < count; i++) {
        const box = document.createElement("div");
        box.className = `cargo-box cargo-box-${size}`;
        box.textContent = `${size}`;
        box.title = `${size} SCU Standard Container`;
        visualizer.appendChild(box);
      }
    });
  }

  // ==========================================
  // BREADCRUMBS & LEGS RENDERING
  // ==========================================
  function renderCombinedFleetBreadcrumbs(fleetResult) {
    breadcrumbDisplay.innerHTML = "";

    fleetResult.fleetRoutes.forEach((route, sIdx) => {
      const section = document.createElement("div");
      section.className = "w-full mb-3 p-2 rounded bg-slate-900/50 border border-slate-800";
      section.innerHTML = `
        <div class="flex items-center justify-between text-xs font-bold mb-1.5" style="color: ${route.color};">
          <span>Ship #${sIdx + 1}: ${route.shipInfo.name} (${route.totalScu} / ${route.capacity} SCU)</span>
          <span class="font-mono text-[10px] text-slate-400">${route.totalTimeFormatted} &bull; ${route.totalDistanceMkm} Mkm</span>
        </div>
        <div class="breadcrumb-track flex items-center flex-wrap gap-1"></div>
      `;

      const trackEl = section.querySelector(".breadcrumb-track");
      route.breadcrumbItems.forEach((item, idx) => {
        const nodeEl = document.createElement("div");
        nodeEl.className = `breadcrumb-node ${item.isOrigin ? "origin" : item.isPickup ? "pickup" : "dropoff"}`;
        nodeEl.style.borderColor = route.color + "99";
        nodeEl.innerHTML = `
          <div class="breadcrumb-tag">${item.tag}</div>
          <div class="breadcrumb-title">${item.label}</div>
          <div class="breadcrumb-sub">${item.node.system.toUpperCase()} &bull; Hold: ${item.cargoOnboard} SCU</div>
        `;
        nodeEl.addEventListener("click", () => {
          map.focusOnNode(item.node.id);
          showNodeInspector(item.node);
        });
        trackEl.appendChild(nodeEl);

        if (idx < route.breadcrumbItems.length - 1) {
          const arrow = document.createElement("div");
          arrow.className = "breadcrumb-arrow";
          arrow.innerHTML = `<span>➔</span>`;
          trackEl.appendChild(arrow);
        }
      });

      breadcrumbDisplay.appendChild(section);
    });
  }

  function renderCombinedFleetLegs(fleetResult) {
    legsContainer.innerHTML = "";

    fleetResult.fleetRoutes.forEach((route, sIdx) => {
      const header = document.createElement("div");
      header.className = "text-xs font-bold font-mono py-1 border-b border-slate-800 mt-2 mb-1 flex items-center gap-2";
      header.style.color = route.color;
      header.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full" style="background: ${route.color};"></span>
        <span>Ship #${sIdx + 1}: ${route.shipInfo.name} Navigation Log</span>
      `;
      legsContainer.appendChild(header);

      route.legs.forEach(leg => {
        const card = createLegCard(leg, route);
        legsContainer.appendChild(card);
      });
    });
  }

  function renderShipBreadcrumbs(route) {
    breadcrumbDisplay.innerHTML = "";

    route.breadcrumbItems.forEach((item, idx) => {
      const isCompleted = completedStepUids.has(item.uid);
      const itemEl = document.createElement("div");
      itemEl.className = `breadcrumb-node ${isCompleted ? 'completed-node' : item.isOrigin ? "origin" : item.isPickup ? "pickup" : "dropoff"}`;
      itemEl.style.borderColor = route.color;

      itemEl.innerHTML = `
        <div class="flex items-center justify-between gap-1.5">
          <div class="breadcrumb-tag">${item.tag}</div>
          <button class="check-btn ${isCompleted ? 'completed' : ''}" data-uid="${item.uid}">&#10003;</button>
        </div>
        <div class="breadcrumb-title">${item.label}</div>
        <div class="breadcrumb-sub">${item.node.system.toUpperCase()} &bull; Hold: ${item.cargoOnboard} SCU</div>
      `;

      itemEl.querySelector(".check-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleStepCompletion(item.uid);
      });

      itemEl.addEventListener("click", () => {
        map.focusOnNode(item.node.id);
        showNodeInspector(item.node);
      });

      breadcrumbDisplay.appendChild(itemEl);

      if (idx < route.breadcrumbItems.length - 1) {
        const arrowEl = document.createElement("div");
        arrowEl.className = "breadcrumb-arrow";
        arrowEl.innerHTML = `<span>➔</span>`;
        breadcrumbDisplay.appendChild(arrowEl);
      }
    });
  }

  function renderShipLegs(route) {
    legsContainer.innerHTML = "";

    route.legs.forEach(leg => {
      const card = createLegCard(leg, route);
      legsContainer.appendChild(card);
    });
  }

  function createLegCard(leg, route) {
    const isCompleted = completedStepUids.has(leg.toUid);
    const card = document.createElement("div");
    card.className = `leg-card ${isCompleted ? 'completed-stop' : ''} ${leg.isOffloadStop ? "border-amber-500/40 bg-amber-500/5" : ""}`;

    const hasJump = leg.segments.some(s => s.isJumpPoint);

    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <button class="check-btn ${isCompleted ? 'completed' : ''}" data-uid="${leg.toUid}">&#10003;</button>
          <span class="leg-badge ${leg.isOffloadStop ? 'offload' : leg.stepType}" style="${!leg.isOffloadStop ? `background: ${route.color}25; color: ${route.color}; border: 1px solid ${route.color}66;` : ''}">${leg.legIndex}</span>
          <span class="font-bold text-sm text-slate-100">${leg.from.name} ➔ ${leg.to.name}</span>
        </div>
        <span class="text-xs font-mono text-cyan-400">${leg.distanceMkm.toFixed(2)} Mkm</span>
      </div>

      ${leg.threatBadge ? `
        <div class="mb-2">
          <span class="${leg.threatBadge.type === 'illegal' ? 'threat-badge-danger' : 'threat-badge-warning'}">
            ⚠️ ${leg.threatBadge.label}: ${leg.threatBadge.details}
          </span>
        </div>
      ` : ""}

      <div class="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800/80">
        <div>
          <span class="text-slate-500">Action:</span>
          <span class="text-slate-200 capitalize font-medium">
            ${leg.splitNote ? `<strong class="text-amber-300 font-bold">${leg.splitNote}</strong>` : leg.stepType === "pickup" ? `Collect +${leg.scuLoaded} SCU` : leg.stepType === "start" ? "Depart Port" : `Deliver -${leg.scuUnloaded} SCU`}
          </span>
        </div>
        <div>
          <span class="text-slate-500">QT Time / Fuel:</span>
          <span class="text-emerald-400 font-mono font-bold">${leg.timeFormatted}</span>
          <span class="text-cyan-400 font-mono text-[10px] ml-1">(-${leg.fuelBurnL} L)</span>
        </div>
      </div>

      <div class="mt-2 text-[10px] text-slate-400">
        <div class="flex justify-between font-mono mb-0.5">
          <span>Hold Load:</span>
          <span class="text-cyan-300 font-bold">${leg.cargoOnboard} / ${leg.cargoCapacity} SCU (${leg.cargoPercent}%)</span>
        </div>
        <div class="cargo-hold-bar">
          <div class="cargo-hold-fill ${leg.cargoPercent >= 90 ? 'danger' : ''}" style="width: ${leg.cargoPercent}%; background: ${route.color};"></div>
        </div>
      </div>

      ${hasJump ? `
        <div class="mt-2 p-1.5 rounded bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-300 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span>Jump Gate Tunnel: <strong>Stanton Gateway ↔ Pyro Gateway</strong></span>
        </div>
      ` : ""}
    `;

    card.querySelector(".check-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleStepCompletion(leg.toUid);
    });

    card.addEventListener("click", () => {
      map.focusOnNode(leg.to.id);
      showNodeInspector(leg.to);
    });

    return card;
  }

  function toggleStepCompletion(uid) {
    if (completedStepUids.has(uid)) {
      completedStepUids.delete(uid);
    } else {
      completedStepUids.add(uid);
    }
    showTabView(activeViewTab);
    if (!cockpitHudOverlay.classList.contains("hidden")) {
      renderCockpitHUD();
    }
  }

  // ==========================================
  // FULLSCREEN COCKPIT HUD MODE
  // ==========================================
  function openCockpitHUD() {
    if (!currentFleetResult) {
      showToast("Calculate a fleet route first to open Cockpit HUD.");
      return;
    }
    cockpitHudOverlay.classList.remove("hidden");
    renderCockpitHUD();
  }

  function closeCockpitHUD() {
    cockpitHudOverlay.classList.add("hidden");
    showTabView(activeViewTab);
  }

  if (btnCockpitHud) btnCockpitHud.addEventListener("click", openCockpitHUD);
  if (btnCloseHud) btnCloseHud.addEventListener("click", closeCockpitHUD);

  function renderCockpitHUD() {
    if (!currentFleetResult) return;

    hudEtaTimer.textContent = `ETA: ${currentFleetResult.maxFleetTimeFormatted}`;

    // Render HUD Ship Tabs
    hudShipTabs.innerHTML = "";
    const allBtn = document.createElement("button");
    allBtn.className = `fleet-tab-btn py-1 px-2.5 text-xs ${activeHudShipId === "all" ? "active" : ""}`;
    allBtn.textContent = `All Ships (${currentFleetResult.fleetRoutes.length})`;
    allBtn.addEventListener("click", () => {
      activeHudShipId = "all";
      renderCockpitHUD();
    });
    hudShipTabs.appendChild(allBtn);

    currentFleetResult.fleetRoutes.forEach((route, idx) => {
      const shipBtn = document.createElement("button");
      shipBtn.className = `fleet-tab-btn py-1 px-2.5 text-xs ${activeHudShipId === route.shipInfo.id ? "active" : ""}`;
      shipBtn.style.color = route.color;
      shipBtn.innerHTML = `S${idx + 1}: ${route.shipInfo.name}`;
      shipBtn.addEventListener("click", () => {
        activeHudShipId = route.shipInfo.id;
        renderCockpitHUD();
      });
      hudShipTabs.appendChild(shipBtn);
    });

    // Render Stream of Legs
    hudLegsStream.innerHTML = "";

    const routesToDisplay = activeHudShipId === "all"
      ? currentFleetResult.fleetRoutes
      : currentFleetResult.fleetRoutes.filter(r => r.shipInfo.id === activeHudShipId);

    let foundFirstActive = false;

    routesToDisplay.forEach(route => {
      route.legs.forEach(leg => {
        const isDone = completedStepUids.has(leg.toUid);
        const isActive = !isDone && !foundFirstActive;
        if (isActive) foundFirstActive = true;

        const card = document.createElement("div");
        card.className = `hud-leg-card ${isDone ? 'completed' : ''} ${isActive ? 'active-leg' : ''}`;
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button class="hud-check-btn ${isDone ? 'completed' : ''}" data-uid="${leg.toUid}">
                ${isDone ? '&#10003;' : '&#9675;'}
              </button>
              <div>
                <div class="text-[10px] font-mono tracking-wider font-bold" style="color: ${route.color};">
                  ${route.shipInfo.name.toUpperCase()} &bull; STOP #${leg.legIndex}
                </div>
                <div class="text-base font-bold text-white tracking-wide">
                  ${leg.from.name} ➔ <span class="text-cyan-400">${leg.to.name}</span>
                </div>
              </div>
            </div>
            <div class="text-right font-mono">
              <div class="text-sm font-bold text-emerald-400">${leg.timeFormatted}</div>
              <div class="text-xs text-slate-400">${leg.distanceMkm.toFixed(2)} Mkm</div>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs bg-slate-950/80 p-2 rounded border border-slate-800">
            <div class="text-slate-300">
              ${leg.splitNote ? `<span class="text-amber-300 font-bold">${leg.splitNote}</span>` : leg.stepType === 'pickup' ? `<span class="text-cyan-300 font-bold">Collect +${leg.scuLoaded} SCU</span>` : `<span class="text-emerald-300 font-bold">Deliver -${leg.scuUnloaded} SCU</span>`}
            </div>
            <div class="text-slate-400 font-mono text-[11px]">
              Hold: <strong class="text-white">${leg.cargoOnboard} / ${leg.cargoCapacity} SCU</strong>
            </div>
          </div>

          ${leg.threatBadge ? `
            <div class="text-[10px] font-mono font-bold text-red-400 bg-red-950/30 p-1.5 rounded border border-red-500/30 flex items-center gap-1.5">
              <span>⚠️</span>
              <span>${leg.threatBadge.label.toUpperCase()}: ${leg.threatBadge.details}</span>
            </div>
          ` : ""}
        `;

        card.querySelector(".hud-check-btn").addEventListener("click", () => {
          toggleStepCompletion(leg.toUid);
        });

        hudLegsStream.appendChild(card);
      });
    });
  }

  // ==========================================
  // SHAREABLE FLEET PLAN LINKS (URL DEEP-LINKING)
  // ==========================================
  function shareCurrentPlan() {
    if (fleetShips.length === 0) {
      showToast("Please add at least one vessel to share.");
      return;
    }
    if (haulingMode === "bulk" && (fromList.length === 0 || toList.length === 0)) {
      showToast("Please specify pickups and dropoffs to share.");
      return;
    }
    if (haulingMode === "contracts" && contractsList.length === 0) {
      showToast("Please add at least one contract to share.");
      return;
    }

    const payload = {
      m: haulingMode,
      b: startingLocationId,
      s: fleetShips.map(s => ({ t: s.typeId, name: s.name, scu: s.scu, c: s.color, st: s.startLocationId })),
      f: fromList.map(f => ({ id: f.id, scu: f.scu })),
      t: toList.map(t => ({ id: t.id })),
      c: contractsList.map(c => ({ id: c.id, name: c.name, fromId: c.fromId, toId: c.toId, scu: c.scu, cargoName: c.cargoName })),
      comm: selectedCommodityId,
      th: avoidThreatsToggle ? avoidThreatsToggle.checked : false
    };

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const shareUrl = `${window.location.origin}${window.location.pathname}?plan=${encodeURIComponent(encoded)}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("🔗 Shareable Fleet Plan link copied to clipboard!");
      }).catch(() => {
        prompt("Copy your shareable fleet link:", shareUrl);
      });
    } else {
      prompt("Copy your shareable fleet link:", shareUrl);
    }
  }

  if (btnShareRoute) btnShareRoute.addEventListener("click", shareCurrentPlan);

  function loadPlanFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get("plan");
    if (!planParam) return false;

    try {
      const decoded = decodeURIComponent(planParam);
      const jsonStr = decodeURIComponent(escape(atob(decoded)));
      const plan = JSON.parse(jsonStr);

      if (plan.m) haulingMode = plan.m;
      updateModeUI();

      startingLocationId = plan.b || null;
      renderStartChip();

      if (plan.s && Array.isArray(plan.s)) {
        fleetShips = plan.s.map((s, idx) => ({
          id: `ship_${Date.now()}_${idx}`,
          typeId: s.t,
          name: s.name,
          scu: s.scu,
          fuelTankL: 11000,
          qtDriveId: "size3_industrial",
          color: s.c || fleetColors[idx % fleetColors.length],
          startLocationId: s.st || null
        }));
        renderFleetRoster();
      }

      if (plan.f && Array.isArray(plan.f)) {
        fromList = plan.f.map(f => ({
          uid: `p_${f.id}_${Date.now()}_${Math.random()}`,
          id: f.id,
          scu: f.scu || 0
        }));
      }

      if (plan.t && Array.isArray(plan.t)) {
        toList = plan.t.map(t => ({
          uid: `d_${t.id}_${Date.now()}_${Math.random()}`,
          id: t.id
        }));
      }

      if (plan.c && Array.isArray(plan.c)) {
        contractsList = plan.c.map(c => ({
          id: c.id,
          name: c.name,
          cargoName: c.cargoName,
          fromId: c.fromId,
          toId: c.toId,
          fromName: data.locationMap[c.fromId]?.name || c.fromId,
          toName: data.locationMap[c.toId]?.name || c.toId,
          scu: c.scu
        }));
      }

      if (plan.comm) {
        selectedCommodityId = plan.comm;
        commoditySelect.value = plan.comm;
      }

      if (plan.th !== undefined && avoidThreatsToggle) {
        avoidThreatsToggle.checked = !!plan.th;
      }

      renderChips();
      renderContractsList();

      setTimeout(() => {
        executeFleetOptimization();
        showToast("Fleet plan loaded from shared URL!");
      }, 100);

      return true;
    } catch (e) {
      console.warn("Could not load plan from URL:", e);
      return false;
    }
  }

  // ==========================================
  // SAVED TEMPORARY ROUTES (LOCALSTORAGE)
  // ==========================================
  const SAVED_ROUTES_KEY = "caecitas_saved_navigator_routes";

  function getSavedRoutes() {
    try {
      const stored = localStorage.getItem(SAVED_ROUTES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRoutesToStorage(routes) {
    try {
      localStorage.setItem(SAVED_ROUTES_KEY, JSON.stringify(routes));
    } catch (e) {}
  }

  function renderSavedRoutes() {
    const saved = getSavedRoutes();
    savedRoutesContainer.innerHTML = "";

    if (saved.length === 0) {
      savedRoutesContainer.innerHTML = `
        <div class="text-xs text-slate-500 italic p-2 border border-dashed border-slate-800 rounded text-center">
          No saved routes yet. Click "Save Route" to store active flight plans.
        </div>
      `;
      return;
    }

    saved.forEach(r => {
      const card = document.createElement("div");
      card.className = "saved-route-card";
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="font-bold text-xs text-white">${r.name}</div>
          <span class="text-[10px] font-mono text-cyan-400">${r.fleetSize || 1} Ships</span>
        </div>
        <div class="text-[10px] text-slate-400">${r.mode === 'contracts' ? 'Paired Contracts' : 'Bulk Trading'} &bull; ${r.date}</div>
        <div class="saved-route-actions">
          <button class="btn-load-route" data-id="${r.id}">Load Fleet Route</button>
          <button class="btn-delete-route" data-id="${r.id}">&times;</button>
        </div>
      `;

      card.querySelector(".btn-load-route").addEventListener("click", () => {
        loadSavedRoute(r);
      });

      card.querySelector(".btn-delete-route").addEventListener("click", () => {
        deleteSavedRoute(r.id);
      });

      savedRoutesContainer.appendChild(card);
    });
  }

  function saveCurrentRoute() {
    if (fleetShips.length === 0) {
      alert("No vessels in fleet to save.");
      return;
    }
    if (haulingMode === "bulk" && (fromList.length === 0 || toList.length === 0)) {
      alert("No bulk waypoints to save.");
      return;
    }
    if (haulingMode === "contracts" && contractsList.length === 0) {
      alert("No mission contracts to save.");
      return;
    }

    const defaultName = haulingMode === "contracts"
      ? `${fleetShips.length} Ships: ${contractsList.length} Contracts (${contractsTotalScuBadge.textContent})`
      : `${fleetShips.length} Ships Bulk: ${fromList.length + toList.length} Stops`;

    const routeName = prompt("Enter a name for this temporary fleet route:", defaultName);
    if (!routeName) return;

    const newSaved = {
      id: `fleet_route_${Date.now()}`,
      name: routeName,
      mode: haulingMode,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startingLocationId: startingLocationId,
      fleetShips: JSON.parse(JSON.stringify(fleetShips)),
      fromList: JSON.parse(JSON.stringify(fromList)),
      toList: JSON.parse(JSON.stringify(toList)),
      contractsList: JSON.parse(JSON.stringify(contractsList)),
      commodityId: selectedCommodityId,
      fleetSize: fleetShips.length
    };

    const routes = getSavedRoutes();
    routes.unshift(newSaved);
    saveRoutesToStorage(routes);
    renderSavedRoutes();
  }

  function loadSavedRoute(r) {
    haulingMode = r.mode || "bulk";
    updateModeUI();

    startingLocationId = r.startingLocationId || null;
    renderStartChip();

    if (r.fleetShips && r.fleetShips.length > 0) {
      fleetShips = JSON.parse(JSON.stringify(r.fleetShips));
      renderFleetRoster();
    }

    fromList = JSON.parse(JSON.stringify(r.fromList || []));
    toList = JSON.parse(JSON.stringify(r.toList || []));
    contractsList = JSON.parse(JSON.stringify(r.contractsList || []));

    completedStepUids.clear();
    if (r.commodityId) {
      commoditySelect.value = r.commodityId;
      selectedCommodityId = r.commodityId;
    }

    renderChips();
    renderContractsList();
    executeFleetOptimization();
  }

  function deleteSavedRoute(id) {
    const routes = getSavedRoutes().filter(r => r.id !== id);
    saveRoutesToStorage(routes);
    renderSavedRoutes();
  }

  btnSaveTempRoute.addEventListener("click", saveCurrentRoute);

  // Initial render (Clean slate - 0 waypoints!)
  updateModeUI();
  renderStartChip();
  renderSavedRoutes();
  renderChips();
  renderContractsList();

  // Check URL share link
  const wasLoadedFromUrl = loadPlanFromUrl();

  // Action Buttons
  optimizeBtn.addEventListener("click", () => {
    completedStepUids.clear();
    executeFleetOptimization();
  });

  clearBtn.addEventListener("click", () => {
    if (haulingMode === "bulk") {
      fromList = [];
      toList = [];
      renderChips();
    } else {
      contractsList = [];
      renderContractsList();
    }
    clearFleetResults();
  });
});
