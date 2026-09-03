/**
 * Star Citizen Cargo Route Optimizer, Fuel Range Estimator & Capacitated Router
 */

class RouteOptimizer {
  constructor(data) {
    this.data = data;
  }

  getLocation(id) {
    return this.data.locationMap[id] || null;
  }

  /**
   * Euclidean distance in Megameters between two locations within the same system
   */
  getDirectDistance(locA, locB) {
    if (!locA || !locB) return 0;
    const dx = locA.x - locB.x;
    const dy = locA.y - locB.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.08) {
      dist = 0.08;
    }
    return dist;
  }

  /**
   * Calculate true route distance between two points, automatically inserting
   * Jump Point gateways if transitioning between Stanton and Pyro.
   */
  getTravelSegments(fromLoc, toLoc) {
    if (!fromLoc || !toLoc) return [];

    if (fromLoc.id === toLoc.id) {
      return [
        {
          from: fromLoc,
          to: toLoc,
          distanceMkm: 0.05,
          isJumpPoint: false,
          system: fromLoc.system,
          note: "Same Location / Station Relocation"
        }
      ];
    }

    // Intra-system travel
    if (fromLoc.system === toLoc.system) {
      const dist = this.getDirectDistance(fromLoc, toLoc);
      return [
        {
          from: fromLoc,
          to: toLoc,
          distanceMkm: dist,
          isJumpPoint: false,
          system: fromLoc.system,
          note: fromLoc.parent === toLoc.parent && fromLoc.parent !== null ? "Local Orbital Transit" : "System Quantum Travel"
        }
      ];
    }

    // Inter-system travel (Stanton <-> Pyro)
    const tunnel = this.data.jumpTunnel;
    let stantonGate = this.getLocation(tunnel.stantonNodeId);
    let pyroGate = this.getLocation(tunnel.pyroNodeId);

    if (fromLoc.system === "stanton" && toLoc.system === "pyro") {
      const leg1Dist = this.getDirectDistance(fromLoc, stantonGate);
      const leg2Dist = tunnel.distanceMkmEquivalent;
      const leg3Dist = this.getDirectDistance(pyroGate, toLoc);

      return [
        {
          from: fromLoc,
          to: stantonGate,
          distanceMkm: leg1Dist,
          isJumpPoint: false,
          system: "stanton",
          note: "QT to Stanton Jump Gate"
        },
        {
          from: stantonGate,
          to: pyroGate,
          distanceMkm: leg2Dist,
          isJumpPoint: true,
          system: "jump_tunnel",
          transitDurationSec: tunnel.transitDurationSec,
          note: "Navigate Jump Point Wormhole (Stanton ➔ Pyro)"
        },
        {
          from: pyroGate,
          to: toLoc,
          distanceMkm: leg3Dist,
          isJumpPoint: false,
          system: "pyro",
          note: "QT from Pyro Gateway to Destination"
        }
      ];
    } else {
      // Pyro to Stanton
      const leg1Dist = this.getDirectDistance(fromLoc, pyroGate);
      const leg2Dist = tunnel.distanceMkmEquivalent;
      const leg3Dist = this.getDirectDistance(stantonGate, toLoc);

      return [
        {
          from: fromLoc,
          to: pyroGate,
          distanceMkm: leg1Dist,
          isJumpPoint: false,
          system: "pyro",
          note: "QT to Pyro Jump Gate"
        },
        {
          from: pyroGate,
          to: stantonGate,
          distanceMkm: leg2Dist,
          isJumpPoint: true,
          system: "jump_tunnel",
          transitDurationSec: tunnel.transitDurationSec,
          note: "Navigate Jump Point Wormhole (Pyro ➔ Stanton)"
        },
        {
          from: stantonGate,
          to: toLoc,
          distanceMkm: leg3Dist,
          isJumpPoint: false,
          system: "stanton",
          note: "QT from Stanton Gateway to Destination"
        }
      ];
    }
  }

  getPairwiseDistance(locA, locB) {
    if (!locA || !locB) return 0;
    if (locA.id === locB.id) return 0.05;
    const segments = this.getTravelSegments(locA, locB);
    return segments.reduce((sum, seg) => sum + seg.distanceMkm, 0);
  }

  permutations(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const perms = this.permutations(remaining);
      for (const p of perms) {
        result.push([current, ...p]);
      }
    }
    return result;
  }

  /**
   * Find nearest refueling station to a given location
   */
  findNearestRefuelStation(location) {
    if (!location) return null;
    const candidates = this.data.locations.filter(loc => {
      if (loc.id === location.id) return false;
      if (loc.system !== location.system) return false;
      const hasRefuel = loc.services && loc.services.some(s => s.toLowerCase().includes("refuel"));
      return hasRefuel || loc.type === "station" || loc.type === "city" || loc.type === "lagrange";
    });

    let nearest = null;
    let minDist = Infinity;
    for (const cand of candidates) {
      const d = this.getPairwiseDistance(location, cand);
      if (d < minDist) {
        minDist = d;
        nearest = cand;
      }
    }
    return nearest ? { station: nearest, distanceMkm: Number(minDist.toFixed(2)) } : null;
  }

  /**
   * Capacitated Vehicle Routing supporting:
   * - Starting Location (where ship currently sits)
   * - Multi-instance duplicate waypoints (distinct UIDs)
   * - SCU cargo hold constraints & intermediate offloading stops
   */
  findCapacitatedSequence(pickupItems, dropoffItems, shipCapacity, startNode = null) {
    const pickups = pickupItems.map((p, idx) => {
      const id = typeof p === "string" ? p : p.id;
      const scu = (typeof p === "object" && p.scu) ? Math.max(0, parseInt(p.scu) || 0) : 0;
      const uid = (typeof p === "object" && p.uid) ? p.uid : `p_${id}_${idx}`;
      return {
        uid: uid,
        id: id,
        scu: scu,
        node: this.getLocation(id)
      };
    }).filter(p => p.node !== null);

    const dropoffs = dropoffItems.map((d, idx) => {
      const id = typeof d === "string" ? d : d.id;
      const uid = (typeof d === "object" && d.uid) ? d.uid : `d_${id}_${idx}`;
      return {
        uid: uid,
        id: id,
        node: this.getLocation(id)
      };
    }).filter(d => d.node !== null);

    if (pickups.length === 0 || dropoffs.length === 0) return [];

    const totalPickupSCU = pickups.reduce((sum, p) => sum + p.scu, 0);

    const isCapacityConstrained = shipCapacity > 0 && totalPickupSCU > 0 && (
      totalPickupSCU > shipCapacity || pickups.some(p => p.scu > shipCapacity * 0.8)
    );

    // Standard sequence if hold is not exceeded
    if (!isCapacityConstrained) {
      const standardOrder = this.findStandardSequence(pickups, dropoffs, startNode);
      return standardOrder;
    }

    // Branch and Bound DFS with capacity constraints & duplicate support
    let bestCost = Infinity;
    let bestRoute = null;

    const initialSteps = [];
    let initialItem = pickups[0];
    let initialCargo = Math.min(initialItem.scu, shipCapacity);

    if (startNode && startNode.id !== pickups[0].node.id) {
      initialItem = { uid: "start_pos", id: startNode.id, node: startNode };
      initialCargo = 0;
      initialSteps.push({
        uid: "start_pos",
        node: startNode,
        action: "start",
        scuLoaded: 0,
        scuUnloaded: 0,
        cargoOnboard: 0
      });
    }

    const stack = [{
      currItem: initialItem,
      currentCargo: initialCargo,
      pMask: initialCargo > 0 ? 1 : 0,
      dMask: 0,
      path: initialSteps.length > 0 ? initialSteps : [{
        uid: initialItem.uid,
        node: initialItem.node,
        action: "start",
        scuLoaded: initialCargo,
        scuUnloaded: 0,
        cargoOnboard: initialCargo
      }],
      cost: 0
    }];

    const targetPMask = (1 << pickups.length) - 1;
    const targetDMask = (1 << dropoffs.length) - 1;
    let iterations = 0;

    while (stack.length > 0 && iterations < 9000) {
      iterations++;
      const { currItem, currentCargo, pMask, dMask, path, cost } = stack.pop();

      if (cost >= bestCost) continue;

      if (pMask === targetPMask && (dMask === targetDMask || currentCargo === 0)) {
        if (cost < bestCost) {
          bestCost = cost;
          bestRoute = path;
        }
        continue;
      }

      // Branch 1: Try visiting remaining pickups IF they fit in hold
      for (let i = 0; i < pickups.length; i++) {
        if (!(pMask & (1 << i))) {
          const nextP = pickups[i];
          if (currentCargo + nextP.scu <= shipCapacity) {
            const dist = this.getPairwiseDistance(currItem.node, nextP.node);
            const nextCargo = currentCargo + nextP.scu;
            stack.push({
              currItem: nextP,
              currentCargo: nextCargo,
              pMask: pMask | (1 << i),
              dMask: dMask,
              path: [...path, {
                uid: nextP.uid,
                node: nextP.node,
                action: "pickup",
                scuLoaded: nextP.scu,
                scuUnloaded: 0,
                cargoOnboard: nextCargo
              }],
              cost: cost + dist
            });
          }
        }
      }

      // Branch 2: Visit a dropoff location to empty cargo
      if (currentCargo > 0 || pMask === targetPMask) {
        for (let j = 0; j < dropoffs.length; j++) {
          const drop = dropoffs[j];
          const alreadyVisited = (dMask & (1 << j)) !== 0;
          if (!alreadyVisited || pMask !== targetPMask) {
            const dist = this.getPairwiseDistance(currItem.node, drop.node);
            stack.push({
              currItem: drop,
              currentCargo: 0,
              pMask: pMask,
              dMask: dMask | (1 << j),
              path: [...path, {
                uid: drop.uid,
                node: drop.node,
                action: "dropoff",
                scuLoaded: 0,
                scuUnloaded: currentCargo,
                cargoOnboard: 0,
                isOffloadStop: pMask !== targetPMask
              }],
              cost: cost + dist
            });
          }
        }
      }
    }

    if (bestRoute) {
      return bestRoute;
    }

    return this.findStandardSequence(pickups, dropoffs, startNode);
  }

  findStandardSequence(pickupItems, dropoffItems, startNode = null) {
    const result = [];

    if (startNode && (!pickupItems[0] || startNode.id !== pickupItems[0].node.id)) {
      result.push({
        uid: "start_pos",
        node: startNode,
        action: "start",
        scuLoaded: 0,
        scuUnloaded: 0,
        cargoOnboard: 0
      });
    }

    if (pickupItems.length === 1 && result.length === 0) {
      const startP = pickupItems[0];
      if (dropoffItems.length === 1) {
        return [
          { uid: startP.uid, node: startP.node, action: "start", scuLoaded: startP.scu || 0, cargoOnboard: startP.scu || 0 },
          { uid: dropoffItems[0].uid, node: dropoffItems[0].node, action: "dropoff", scuUnloaded: startP.scu || 0, cargoOnboard: 0 }
        ];
      }

      // Permutations of dropoffs
      if (dropoffItems.length <= 7) {
        let bestDist = Infinity;
        let bestDropOrder = null;
        const perms = this.permutations(dropoffItems);
        for (const p of perms) {
          let d = 0;
          let prev = startP.node;
          for (const item of p) {
            d += this.getPairwiseDistance(prev, item.node);
            prev = item.node;
          }
          if (d < bestDist) {
            bestDist = d;
            bestDropOrder = p;
          }
        }
        const drops = bestDropOrder || dropoffItems;
        return [
          { uid: startP.uid, node: startP.node, action: "start", scuLoaded: startP.scu || 0, cargoOnboard: startP.scu || 0 },
          ...drops.map(d => ({ uid: d.uid, node: d.node, action: "dropoff", scuUnloaded: 0, cargoOnboard: 0 }))
        ];
      }
    }

    // Multi-pickup & multi-dropoff standard sequential TSP
    pickupItems.forEach((p, idx) => {
      result.push({
        uid: p.uid,
        node: p.node,
        action: result.length === 0 && idx === 0 ? "start" : "pickup",
        scuLoaded: p.scu || 0,
        scuUnloaded: 0,
        cargoOnboard: 0
      });
    });
    dropoffItems.forEach(d => {
      result.push({
        uid: d.uid,
        node: d.node,
        action: "dropoff",
        scuLoaded: 0,
        scuUnloaded: 0,
        cargoOnboard: 0
      });
    });
    return result;
  }

  calculateQuantumTime(distanceMkm, drive) {
    if (distanceMkm <= 0) return 0;
    const cruisingSec = distanceMkm / drive.speedMkmPerSec;
    const totalSec = drive.spoolSec + drive.accelSec + cruisingSec;
    return Math.round(totalSec);
  }

  formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins}m`;
  }

  /**
   * Calculate optimal combination of standard Star Citizen container sizes
   * (32, 24, 16, 8, 2, 1 SCU) for cargo hold loading & freight elevator spawn order.
   */
  calculateContainerBreakdown(totalScu) {
    const scu = Math.max(0, parseInt(totalScu) || 0);
    if (scu === 0) return { totalScu: 0, totalBoxes: 0, boxes: {} };

    let remaining = scu;
    const boxSizes = [32, 24, 16, 8, 2, 1];
    const breakdown = {};
    let totalBoxes = 0;

    for (const size of boxSizes) {
      const count = Math.floor(remaining / size);
      if (count > 0) {
        breakdown[size] = count;
        totalBoxes += count;
        remaining -= count * size;
      } else {
        breakdown[size] = 0;
      }
    }

    return {
      totalScu: scu,
      totalBoxes: totalBoxes,
      boxes: breakdown
    };
  }

  /**
   * Main Compute Route entry point:
   * Handles start locations, duplicate waypoints, fuel consumption, pad checks & profit calculations
   */
  computeRoute(fromEntries, toEntries, options = {}) {
    const driveId = options.quantumDriveId || "size2_military";
    const drive = this.data.quantumDrives.find(d => d.id === driveId) || this.data.quantumDrives[1];

    let shipCapacity = 0;
    let fuelTankL = 3000;
    let selectedShip = null;

    if (options.shipId && this.data.ships) {
      selectedShip = this.data.ships.find(s => s.id === options.shipId);
      if (selectedShip) {
        shipCapacity = selectedShip.id === "custom" ? (parseInt(options.customCapacity) || 0) : selectedShip.scu;
        fuelTankL = selectedShip.fuelTankL || 3000;
      }
    }

    const startNode = options.startLocationId ? this.getLocation(options.startLocationId) : null;
    const solvedSteps = this.findCapacitatedSequence(fromEntries, toEntries, shipCapacity, startNode);

    if (solvedSteps.length < 2) {
      return null;
    }

    const waypoints = solvedSteps.map(s => s.node);
    const legs = [];
    let totalDistanceMkm = 0;
    let totalTimeSec = 0;
    let totalFuelUsedL = 0;

    let currentHold = 0;
    let remainingFuel = fuelTankL;
    const refuelAlerts = [];
    const padWarnings = [];

    const fuelBurnRate = drive.fuelBurnPerMkm || 75.0;

    // Validate pad and landing feasibility for the ship
    if (selectedShip) {
      waypoints.forEach((wp, idx) => {
        if (!selectedShip.canLandOnPlanets && (wp.type === "outpost" || wp.type === "city" || wp.type === "moon" || wp.type === "planet")) {
          padWarnings.push({
            node: wp,
            type: "danger",
            title: "Landing Prohibited",
            message: `${selectedShip.name} cannot land on planetary bodies or outposts. Station docking collar only!`
          });
        } else if (selectedShip.padClass === "extra_large" && wp.type === "outpost") {
          padWarnings.push({
            node: wp,
            type: "warning",
            title: "Pad Clearance Caution",
            message: `${wp.name} has small outpost pads. ${selectedShip.name} must touch down on terrain and use freight elevators.`
          });
        }
      });
    }

    for (let i = 0; i < solvedSteps.length - 1; i++) {
      const curStep = solvedSteps[i];
      const nxtStep = solvedSteps[i + 1];

      const cur = curStep.node;
      const nxt = nxtStep.node;

      const segments = this.getTravelSegments(cur, nxt);
      let legDist = 0;
      let legTime = 0;

      for (const seg of segments) {
        legDist += seg.distanceMkm;
        if (seg.isJumpPoint) {
          legTime += seg.transitDurationSec || 65;
        } else {
          legTime += this.calculateQuantumTime(seg.distanceMkm, drive);
        }
      }

      totalDistanceMkm += legDist;
      totalTimeSec += legTime;

      // Fuel calculations
      const legFuelBurn = Math.round(legDist * fuelBurnRate);
      totalFuelUsedL += legFuelBurn;
      remainingFuel = Math.max(0, remainingFuel - legFuelBurn);
      const fuelPercentRemaining = Math.max(0, Math.round((remainingFuel / fuelTankL) * 100));

      let needsRefuel = false;
      let nearestFuelStation = null;
      if (remainingFuel < fuelTankL * 0.15 || legFuelBurn > remainingFuel) {
        needsRefuel = true;
        nearestFuelStation = this.findNearestRefuelStation(cur);
        refuelAlerts.push({
          legIndex: i + 1,
          location: cur,
          suggestedStation: nearestFuelStation ? nearestFuelStation.station : null,
          remainingL: remainingFuel,
          fuelPercent: fuelPercentRemaining
        });
      }

      // Cargo load state
      const cargoInTransit = nxtStep.cargoOnboard !== undefined ? nxtStep.cargoOnboard : currentHold;
      const cargoPercent = shipCapacity > 0 ? Math.min(100, Math.round((cargoInTransit / shipCapacity) * 100)) : 0;

      legs.push({
        legIndex: i + 1,
        from: cur,
        to: nxt,
        fromUid: curStep.uid,
        toUid: nxtStep.uid,
        stepType: nxtStep.action || "dropoff",
        distanceMkm: legDist,
        timeSec: legTime,
        timeFormatted: this.formatTime(legTime),
        segments: segments,
        isInterSystem: cur.system !== nxt.system,
        isOffloadStop: nxtStep.isOffloadStop || false,
        scuLoaded: nxtStep.scuLoaded || 0,
        scuUnloaded: nxtStep.scuUnloaded || 0,
        cargoOnboard: cargoInTransit,
        cargoCapacity: shipCapacity,
        cargoPercent: cargoPercent,
        fuelBurnL: legFuelBurn,
        fuelRemainingL: remainingFuel,
        fuelPercentRemaining: fuelPercentRemaining,
        needsRefuel: needsRefuel,
        suggestedRefuelStation: nearestFuelStation ? nearestFuelStation.station : null
      });

      currentHold = cargoInTransit;
    }

    // Breadcrumb items
    const breadcrumbItems = [];
    solvedSteps.forEach((step, index) => {
      let tag = "";
      if (index === 0 && step.action === "start" && startNode && step.node.id === startNode.id) {
        tag = "[Starting Port]";
      } else if (index === 0) {
        tag = "[Origin]";
      } else if (step.isOffloadStop) {
        tag = "[Empty Hold: Offload]";
      } else if (step.action === "pickup") {
        tag = `[Pickup ${step.scuLoaded ? '(' + step.scuLoaded + ' SCU)' : ''}]`;
      } else {
        tag = `[Dropoff]`;
      }

      breadcrumbItems.push({
        uid: step.uid,
        node: step.node,
        label: step.node.name,
        tag: tag,
        isOrigin: index === 0,
        isOffload: !!step.isOffloadStop,
        isPickup: step.action === "pickup",
        isDropoff: step.action === "dropoff",
        scu: step.scuLoaded || step.scuUnloaded || 0,
        cargoOnboard: step.cargoOnboard || 0
      });
    });

    // Fuel cost calculations (QT Fuel ~1.35 aUEC/L, Hydrogen flight allowance ~120 aUEC per leg)
    const estimatedFuelCost = Math.round((totalFuelUsedL * 1.35) + (legs.length * 150));

    // Commodity Financial Projections (if commodity selected)
    let commodityStats = null;
    if (options.commodityId && this.data.commodities) {
      const comm = this.data.commodities.find(c => c.id === options.commodityId);
      if (comm) {
        const totalScuTransported = solvedSteps.reduce((sum, s) => sum + (s.scuLoaded || 0), 0) || shipCapacity || 100;
        const buyPrice = options.customBuyPrice !== undefined && options.customBuyPrice !== null && options.customBuyPrice !== "" ? parseFloat(options.customBuyPrice) : comm.buyPrice;
        const sellPrice = options.customSellPrice !== undefined && options.customSellPrice !== null && options.customSellPrice !== "" ? parseFloat(options.customSellPrice) : comm.sellPrice;

        const investment = Math.round(totalScuTransported * buyPrice);
        const revenue = Math.round(totalScuTransported * sellPrice);
        const grossProfit = revenue - investment;
        const netInPocket = grossProfit - estimatedFuelCost;
        const profitPerScu = sellPrice - buyPrice;

        commodityStats = {
          commodity: comm,
          totalScu: totalScuTransported,
          buyPrice: buyPrice,
          sellPrice: sellPrice,
          investment: investment,
          revenue: revenue,
          grossProfit: grossProfit,
          fuelExpense: estimatedFuelCost,
          netInPocket: netInPocket,
          profitPerScu: profitPerScu
        };
      }
    }

    return {
      waypoints: waypoints,
      solvedSteps: solvedSteps,
      legs: legs,
      totalDistanceMkm: Number(totalDistanceMkm.toFixed(2)),
      totalTimeSec: totalTimeSec,
      totalTimeFormatted: this.formatTime(totalTimeSec),
      breadcrumbItems: breadcrumbItems,
      breadcrumbString: waypoints.map(n => n.name).join(" ➔ "),
      drive: drive,
      ship: selectedShip,
      shipCapacity: shipCapacity,
      fuelTankL: fuelTankL,
      totalFuelUsedL: totalFuelUsedL,
      estimatedFuelCost: estimatedFuelCost,
      fuelRemainingL: remainingFuel,
      fuelPercentRemaining: Math.max(0, Math.round((remainingFuel / fuelTankL) * 100)),
      refuelAlerts: refuelAlerts,
      padWarnings: padWarnings,
      commodityStats: commodityStats
    };
  }

  /**
   * Multi-Ship Fleet Logistics Engine (Split-Demand VRP)
   * Dispatches 1, 2, 3, or up to 10+ ships across a single shared pool of starting positions,
   * pickups (with split cargo support), and deliveries.
   */
  computeFleetRoutes(fleetShips, fromEntries, toEntries, options = {}) {
    if (!fleetShips || fleetShips.length === 0) return null;
    if (!fromEntries || fromEntries.length === 0 || !toEntries || toEntries.length === 0) return null;

    // Single ship case
    if (fleetShips.length === 1) {
      const singleShip = fleetShips[0];
      const singleRoute = this.computeRoute(fromEntries, toEntries, {
        ...options,
        shipId: singleShip.typeId || singleShip.id,
        customCapacity: singleShip.scu
      });
      if (!singleRoute) return null;
      singleRoute.shipInfo = singleShip;
      singleRoute.color = singleShip.color || "#00f0ff";
      return {
        isFleet: false,
        fleetRoutes: [singleRoute],
        totalFleetScu: singleRoute.commodityStats ? singleRoute.commodityStats.totalScu : singleRoute.legs.reduce((s, l) => s + (l.scuLoaded || 0), 0),
        maxFleetTimeSec: singleRoute.totalTimeSec,
        maxFleetTimeFormatted: singleRoute.totalTimeFormatted,
        totalFleetDistanceMkm: singleRoute.totalDistanceMkm,
        totalFleetFuelCost: singleRoute.estimatedFuelCost,
        fleetCommodityStats: singleRoute.commodityStats
      };
    }

    // Multi-ship Fleet Split-Demand Dispatch
    const startNode = options.startLocationId ? this.getLocation(options.startLocationId) : null;

    // Create mutable demand pool for all pickups
    const demandPool = fromEntries.map((p, idx) => {
      const locId = typeof p === "string" ? p : p.id;
      const initialScu = typeof p === "object" && p.scu ? Math.max(1, parseInt(p.scu)) : 200;
      return {
        uid: p.uid || `p_${locId}_${idx}`,
        locId: locId,
        node: this.getLocation(locId),
        remainingScu: initialScu,
        totalScu: initialScu
      };
    }).filter(d => d.node !== null);

    // Dropoffs
    const dropoffList = toEntries.map(d => {
      const locId = typeof d === "string" ? d : d.id;
      return {
        uid: d.uid || `d_${locId}`,
        locId: locId,
        node: this.getLocation(locId)
      };
    }).filter(d => d.node !== null);

    if (demandPool.length === 0 || dropoffList.length === 0) return null;

    const fleetColors = ["#00f0ff", "#f59e0b", "#c084fc", "#10b981", "#f43f5e", "#38bdf8", "#fbbf24", "#a855f7"];

    // Initialize per-ship schedules with workload balancing quotas
    const totalFleetCap = fleetShips.reduce((sum, sh) => sum + (sh.scu > 0 ? sh.scu : 500), 0);
    const totalFleetDemand = demandPool.reduce((sum, d) => sum + d.totalScu, 0);
    const numPickups = demandPool.length;

    const shipSchedules = fleetShips.map((ship, idx) => {
      const shipCap = ship.scu > 0 ? ship.scu : 500;
      const assignedColor = ship.color || fleetColors[idx % fleetColors.length];
      const targetScu = Math.round(totalFleetDemand * (shipCap / totalFleetCap));
      const targetStops = Math.max(1, Math.round(numPickups * (shipCap / totalFleetCap)));
      const effectiveStartNode = ship.startLocationId ? this.getLocation(ship.startLocationId) : startNode;
      return {
        shipInfo: { ...ship, color: assignedColor },
        shipIndex: idx + 1,
        capacity: shipCap,
        currentHold: 0,
        availableCap: shipCap,
        totalScuLoaded: 0,
        pickupCount: 0,
        targetScu: targetScu,
        targetStops: targetStops,
        currentPos: effectiveStartNode || demandPool[0].node,
        steps: effectiveStartNode ? [{
          uid: `start_${ship.id}`,
          node: effectiveStartNode,
          action: "start",
          scuLoaded: 0,
          scuUnloaded: 0,
          cargoOnboard: 0,
          splitNote: `Depart Staging Base (${effectiveStartNode.name})`
        }] : []
      };
    });

    // Allocate pickups with balanced workload scoring & cargo splitting
    let remainingDemand = demandPool.reduce((sum, d) => sum + d.remainingScu, 0);
    let guard = 0;

    while (remainingDemand > 0 && guard < 150) {
      guard++;

      // Find unfulfilled pickup
      const targetDemand = demandPool.find(d => d.remainingScu > 0);
      if (!targetDemand) break;

      // Find candidate ships with available hold space
      let candidateShips = shipSchedules.filter(s => s.availableCap > 0);
      if (candidateShips.length === 0) {
        // All ships full: have full ships deliver to dropoff to empty hold
        shipSchedules.forEach(s => {
          if (s.currentHold > 0) {
            const drop = dropoffList[0];
            s.steps.push({
              uid: `drop_offload_${s.shipInfo.id}_${s.steps.length}`,
              node: drop.node,
              action: "dropoff",
              scuLoaded: 0,
              scuUnloaded: s.currentHold,
              cargoOnboard: 0,
              isOffloadStop: true,
              splitNote: `Intermediate Delivery to Empty Hold (-${s.currentHold} SCU)`
            });
            s.currentPos = drop.node;
            s.currentHold = 0;
            s.availableCap = s.capacity;
          }
        });
        candidateShips = shipSchedules.filter(s => s.availableCap > 0);
        if (candidateShips.length === 0) break;
      }

      // Rank candidate ships by BALANCED COST (Distance + Workload saturation penalty)
      candidateShips.sort((a, b) => {
        const distA = this.getPairwiseDistance(a.currentPos, targetDemand.node);
        const distB = this.getPairwiseDistance(b.currentPos, targetDemand.node);

        const amountA = Math.min(targetDemand.remainingScu, a.availableCap);
        const amountB = Math.min(targetDemand.remainingScu, b.availableCap);

        const loadRatioA = (a.totalScuLoaded + amountA) / (a.targetScu || 1);
        const loadRatioB = (b.totalScuLoaded + amountB) / (b.targetScu || 1);

        const stopRatioA = (a.pickupCount + 1) / (a.targetStops || 1);
        const stopRatioB = (b.pickupCount + 1) / (b.targetStops || 1);

        // Heavily penalize ships that are already at or exceeding their fair share
        const penaltyA = Math.pow(Math.max(0, loadRatioA - 0.7), 2) * 180 + Math.pow(Math.max(0, stopRatioA - 0.7), 2) * 120;
        const penaltyB = Math.pow(Math.max(0, loadRatioB - 0.7), 2) * 180 + Math.pow(Math.max(0, stopRatioB - 0.7), 2) * 120;

        return (distA + penaltyA) - (distB + penaltyB);
      });

      const chosenShip = candidateShips[0];
      const amountToLoad = Math.min(targetDemand.remainingScu, chosenShip.availableCap);

      targetDemand.remainingScu -= amountToLoad;
      remainingDemand -= amountToLoad;
      chosenShip.currentHold += amountToLoad;
      chosenShip.availableCap -= amountToLoad;
      chosenShip.totalScuLoaded += amountToLoad;
      chosenShip.pickupCount += 1;

      const isSplit = amountToLoad < targetDemand.totalScu;
      const splitDetail = isSplit
        ? `Split Cargo: Loaded ${amountToLoad} / ${targetDemand.totalScu} SCU (Remaining ${targetDemand.remainingScu} SCU to fleet)`
        : `Full Pickup: Loaded ${amountToLoad} SCU`;

      chosenShip.steps.push({
        uid: `p_${targetDemand.locId}_${chosenShip.shipInfo.id}_${chosenShip.steps.length}`,
        node: targetDemand.node,
        action: "pickup",
        scuLoaded: amountToLoad,
        scuUnloaded: 0,
        cargoOnboard: chosenShip.currentHold,
        isSplit: isSplit,
        splitNote: splitDetail
      });

      chosenShip.currentPos = targetDemand.node;

      // If ship is full and there's more work, drop off immediately
      if (chosenShip.availableCap === 0 && remainingDemand > 0) {
        const drop = dropoffList[0];
        chosenShip.steps.push({
          uid: `drop_offload_${chosenShip.shipInfo.id}_${chosenShip.steps.length}`,
          node: drop.node,
          action: "dropoff",
          scuLoaded: 0,
          scuUnloaded: chosenShip.currentHold,
          cargoOnboard: 0,
          isOffloadStop: true,
          splitNote: `Hold Full: Offload ${chosenShip.currentHold} SCU at ${drop.node.name} & Return to Hauling`
        });
        chosenShip.currentPos = drop.node;
        chosenShip.currentHold = 0;
        chosenShip.availableCap = chosenShip.capacity;
      }
    }

    // Makespan Reduction & Local Search Swap:
    // If one ship has a significantly longer path than another ship, test if transferring
    // any pickup to a faster ship reduces the maximum flight distance/time across the fleet.
    if (shipSchedules.length >= 2) {
      const calcPathDist = (sched) => {
        const pSteps = sched.steps.filter(st => st.action === "pickup");
        const origin = sched.steps[0]?.action === "start" ? sched.steps[0].node : (pSteps[0]?.node || null);
        const drop = dropoffList[0]?.node || null;
        if (!origin || !drop || pSteps.length === 0) return 0;
        let d = 0;
        let cur = origin;
        for (const st of pSteps) {
          d += this.getPairwiseDistance(cur, st.node);
          cur = st.node;
        }
        d += this.getPairwiseDistance(cur, drop);
        return d;
      };

      for (let iter = 0; iter < 10; iter++) {
        shipSchedules.sort((a, b) => calcPathDist(b) - calcPathDist(a));
        const slowest = shipSchedules[0];
        const fastest = shipSchedules[shipSchedules.length - 1];

        const distSlow = calcPathDist(slowest);
        const distFast = calcPathDist(fastest);

        if (distSlow - distFast < 40) break;

        const slowPickups = slowest.steps.filter(st => st.action === "pickup");
        if (slowPickups.length <= 1) break;

        let bestSwapIdx = -1;
        let bestNewMax = distSlow;

        for (let i = 0; i < slowPickups.length; i++) {
          const candidateStop = slowPickups[i];
          if (fastest.availableCap < candidateStop.scuLoaded) continue;

          const testSlowPickups = slowPickups.filter((_, idx) => idx !== i);
          const testFastPickups = [...fastest.steps.filter(st => st.action === "pickup"), candidateStop];

          const testDistSlow = (() => {
            const origin = slowest.steps[0]?.action === "start" ? slowest.steps[0].node : testSlowPickups[0]?.node;
            const drop = dropoffList[0]?.node;
            if (!origin || !drop || testSlowPickups.length === 0) return 0;
            let d = 0, cur = origin;
            for (const st of testSlowPickups) { d += this.getPairwiseDistance(cur, st.node); cur = st.node; }
            return d + this.getPairwiseDistance(cur, drop);
          })();

          const testDistFast = (() => {
            const origin = fastest.steps[0]?.action === "start" ? fastest.steps[0].node : testFastPickups[0]?.node;
            const drop = dropoffList[0]?.node;
            if (!origin || !drop || testFastPickups.length === 0) return 0;
            let d = 0, cur = origin;
            for (const st of testFastPickups) { d += this.getPairwiseDistance(cur, st.node); cur = st.node; }
            return d + this.getPairwiseDistance(cur, drop);
          })();

          const newMax = Math.max(testDistSlow, testDistFast);
          if (newMax < bestNewMax - 10) {
            bestNewMax = newMax;
            bestSwapIdx = i;
          }
        }

        if (bestSwapIdx !== -1) {
          const movedStop = slowPickups[bestSwapIdx];
          slowest.steps = slowest.steps.filter(st => st !== movedStop);
          slowest.totalScuLoaded -= movedStop.scuLoaded;
          slowest.currentHold -= movedStop.scuLoaded;
          slowest.availableCap += movedStop.scuLoaded;

          fastest.steps.push(movedStop);
          fastest.totalScuLoaded += movedStop.scuLoaded;
          fastest.currentHold += movedStop.scuLoaded;
          fastest.availableCap -= movedStop.scuLoaded;
        } else {
          break;
        }
      }
    }

    // Optimize geometric order (TSP) for each ship's pickups to avoid zigzagging
    shipSchedules.forEach(sched => {
      const originStep = sched.steps[0]?.action === "start" ? sched.steps[0] : null;
      const pickupSteps = sched.steps.filter(s => s.action === "pickup");
      const intermediateDrops = sched.steps.filter(s => s.isOffloadStop);

      if (pickupSteps.length >= 2 && intermediateDrops.length === 0) {
        let curPos = originStep ? originStep.node : pickupSteps[0].node;
        const unrouted = [...pickupSteps];
        const reordered = [];

        while (unrouted.length > 0) {
          unrouted.sort((a, b) => this.getPairwiseDistance(curPos, a.node) - this.getPairwiseDistance(curPos, b.node));
          const nxt = unrouted.shift();
          reordered.push(nxt);
          curPos = nxt.node;
        }

        sched.steps = originStep ? [originStep, ...reordered] : reordered;
        let rollHold = 0;
        sched.steps.forEach(st => {
          if (st.action === "pickup") {
            rollHold += st.scuLoaded;
            st.cargoOnboard = rollHold;
          }
        });
      }
    });

    // Final delivery for all ships holding cargo
    shipSchedules.forEach(s => {
      if (s.currentHold > 0 || s.steps.length === 1) {
        dropoffList.forEach(drop => {
          s.steps.push({
            uid: `final_drop_${s.shipInfo.id}_${drop.locId}`,
            node: drop.node,
            action: "dropoff",
            scuLoaded: 0,
            scuUnloaded: s.currentHold,
            cargoOnboard: 0,
            isOffloadStop: false,
            splitNote: `Final Delivery of Fleet Cargo (-${s.currentHold} SCU)`
          });
          s.currentHold = 0;
        });
      }
    });

    // Build complete route telemetry for each ship
    const fleetRoutes = [];
    let totalFleetDist = 0;
    let maxFleetTimeSec = 0;
    let totalFleetFuelL = 0;
    let totalFleetFuelCost = 0;
    let totalFleetCargoSCU = 0;

    const drive = this.data.quantumDrives.find(d => d.id === (options.quantumDriveId || "size3_industrial")) || this.data.quantumDrives[2];
    const fuelBurnRate = drive.fuelBurnPerMkm || 75.0;

    shipSchedules.forEach((sched, shipIdx) => {
      const cleanedSteps = [];
      sched.steps.forEach((st, idx) => {
        if (idx === 0 || st.node.id !== cleanedSteps[cleanedSteps.length - 1].node.id || st.scuLoaded > 0 || st.scuUnloaded > 0) {
          cleanedSteps.push(st);
        }
      });

      if (cleanedSteps.length < 2) return;

      const legs = [];
      let shipDist = 0;
      let shipTimeSec = 0;
      let shipFuelL = 0;

      for (let i = 0; i < cleanedSteps.length - 1; i++) {
        const cur = cleanedSteps[i].node;
        const nxt = cleanedSteps[i + 1].node;
        const nxtStep = cleanedSteps[i + 1];

        const segments = this.getTravelSegments(cur, nxt);
        let legDist = 0;
        let legTime = 0;

        for (const seg of segments) {
          legDist += seg.distanceMkm;
          if (seg.isJumpPoint) {
            legTime += seg.transitDurationSec || 65;
          } else {
            legTime += this.calculateQuantumTime(seg.distanceMkm, drive);
          }
        }

        shipDist += legDist;
        shipTimeSec += legTime;
        const legFuel = Math.round(legDist * fuelBurnRate);
        shipFuelL += legFuel;

        const cargoPercent = Math.min(100, Math.round((nxtStep.cargoOnboard / sched.capacity) * 100));

        legs.push({
          legIndex: i + 1,
          from: cur,
          to: nxt,
          fromUid: cleanedSteps[i].uid,
          toUid: nxtStep.uid,
          stepType: nxtStep.action || "dropoff",
          distanceMkm: legDist,
          timeSec: legTime,
          timeFormatted: this.formatTime(legTime),
          segments: segments,
          isInterSystem: cur.system !== nxt.system,
          isOffloadStop: nxtStep.isOffloadStop || false,
          scuLoaded: nxtStep.scuLoaded || 0,
          scuUnloaded: nxtStep.scuUnloaded || 0,
          cargoOnboard: nxtStep.cargoOnboard,
          cargoCapacity: sched.capacity,
          cargoPercent: cargoPercent,
          fuelBurnL: legFuel,
          splitNote: nxtStep.splitNote || "",
          threatBadge: nxt.isIllegal ? { type: 'illegal', label: 'Unmonitored Scrap Yard', details: nxt.threatLevel } : nxt.isPyroHostile ? { type: 'hostile', label: nxt.gang || 'Pirate Outpost', details: nxt.threatLevel } : null
        });
      }

      const shipFuelCost = Math.round((shipFuelL * 1.35) + (legs.length * 150));
      const shipScuLoaded = legs.reduce((s, l) => s + l.scuLoaded, 0);

      totalFleetDist += shipDist;
      maxFleetTimeSec = Math.max(maxFleetTimeSec, shipTimeSec);
      totalFleetFuelL += shipFuelL;
      totalFleetFuelCost += shipFuelCost;
      totalFleetCargoSCU += shipScuLoaded;

      // Breadcrumbs
      const breadcrumbItems = [];
      cleanedSteps.forEach((step, index) => {
        let tag = index === 0 ? "[Origin]" : step.isOffloadStop ? "[Offload]" : step.action === "pickup" ? `[Pickup +${step.scuLoaded} SCU]` : "[Dropoff]";
        breadcrumbItems.push({
          uid: step.uid,
          node: step.node,
          label: step.node.name,
          tag: tag,
          isOrigin: index === 0,
          isOffload: !!step.isOffloadStop,
          isPickup: step.action === "pickup",
          isDropoff: step.action === "dropoff",
          scu: step.scuLoaded || step.scuUnloaded || 0,
          cargoOnboard: step.cargoOnboard || 0
        });
      });

      fleetRoutes.push({
        shipInfo: sched.shipInfo,
        shipIndex: shipIdx + 1,
        waypoints: cleanedSteps.map(s => s.node),
        solvedSteps: cleanedSteps,
        breadcrumbItems: breadcrumbItems,
        legs: legs,
        totalDistanceMkm: Number(shipDist.toFixed(2)),
        totalTimeSec: shipTimeSec,
        totalTimeFormatted: this.formatTime(shipTimeSec),
        totalFuelUsedL: shipFuelL,
        estimatedFuelCost: shipFuelCost,
        totalScu: shipScuLoaded,
        capacity: sched.capacity,
        color: sched.shipInfo.color,
        containerManifest: this.calculateContainerBreakdown(shipScuLoaded)
      });
    });

    // Fleet Financials
    let fleetCommodityStats = null;
    if (options.commodityId && this.data.commodities) {
      const comm = this.data.commodities.find(c => c.id === options.commodityId);
      if (comm) {
        const buyPrice = options.customBuyPrice !== undefined && options.customBuyPrice !== null && options.customBuyPrice !== "" ? parseFloat(options.customBuyPrice) : comm.buyPrice;
        const sellPrice = options.customSellPrice !== undefined && options.customSellPrice !== null && options.customSellPrice !== "" ? parseFloat(options.customSellPrice) : comm.sellPrice;

        const investment = Math.round(totalFleetCargoSCU * buyPrice);
        const revenue = Math.round(totalFleetCargoSCU * sellPrice);
        const grossProfit = revenue - investment;
        const netInPocket = grossProfit - totalFleetFuelCost;

        fleetCommodityStats = {
          commodity: comm,
          totalScu: totalFleetCargoSCU,
          buyPrice: buyPrice,
          sellPrice: sellPrice,
          investment: investment,
          revenue: revenue,
          grossProfit: grossProfit,
          fuelExpense: totalFleetFuelCost,
          netInPocket: netInPocket,
          profitPerScu: sellPrice - buyPrice
        };
      }
    }

    return {
      isFleet: true,
      fleetRoutes: fleetRoutes,
      totalFleetScu: totalFleetCargoSCU,
      totalFleetDistanceMkm: Number(totalFleetDist.toFixed(2)),
      maxFleetTimeSec: maxFleetTimeSec,
      maxFleetTimeFormatted: this.formatTime(maxFleetTimeSec),
      totalFleetFuelCost: totalFleetFuelCost,
      fleetCommodityStats: fleetCommodityStats,
      containerManifest: this.calculateContainerBreakdown(totalFleetCargoSCU)
    };
  }

  /**
   * Paired Contract Missions Engine (Pickup and Delivery with Strict Origin ➔ Destination Binding)
   * Guarantees cargo picked up for Mission K is strictly delivered to Destination K,
   * with precedence enforcement (pickup before dropoff) and capacity constraints.
   */
  computeContractRoutes(fleetShips, contracts, options = {}) {
    if (!fleetShips || fleetShips.length === 0 || !contracts || contracts.length === 0) return null;

    const startNode = options.startLocationId ? this.getLocation(options.startLocationId) : null;
    const drive = this.data.quantumDrives.find(d => d.id === (options.quantumDriveId || "size3_industrial")) || this.data.quantumDrives[2];
    const fuelBurnRate = drive.fuelBurnPerMkm || 75.0;

    // Validate contracts
    const validContracts = contracts.map((c, idx) => {
      const fromNode = this.getLocation(c.fromId);
      const toNode = this.getLocation(c.toId);
      return {
        id: c.id || `contract_${idx + 1}`,
        name: c.name || `Contract #${idx + 1}`,
        cargoName: c.cargoName || "Mission Cargo",
        fromNode: fromNode,
        toNode: toNode,
        scu: Math.max(1, parseInt(c.scu) || 100)
      };
    }).filter(c => c.fromNode && c.toNode);

    if (validContracts.length === 0) return null;

    // Distribute contracts across ships
    const shipAssignments = fleetShips.map(s => ({
      ship: s,
      assignedContracts: []
    }));

    validContracts.forEach((c) => {
      shipAssignments.sort((a, b) => {
        const loadA = a.assignedContracts.reduce((sum, item) => sum + item.scu, 0);
        const loadB = b.assignedContracts.reduce((sum, item) => sum + item.scu, 0);
        return loadA - loadB;
      });
      shipAssignments[0].assignedContracts.push(c);
    });

    const fleetRoutes = [];
    let totalFleetDist = 0;
    let maxFleetTimeSec = 0;
    let totalFleetFuelL = 0;
    let totalFleetFuelCost = 0;
    let totalFleetCargoSCU = 0;

    shipAssignments.forEach((assignment, shipIdx) => {
      const ship = assignment.ship;
      const shipContracts = assignment.assignedContracts;
      if (shipContracts.length === 0) return;

      const capacity = ship.scu > 0 ? ship.scu : 500;
      let currentHold = 0;
      let availableCap = capacity;
      const effectiveStartNode = ship.startLocationId ? this.getLocation(ship.startLocationId) : startNode;
      let currentPos = effectiveStartNode || shipContracts[0].fromNode;

      const steps = [];
      if (effectiveStartNode) {
        steps.push({
          uid: `start_${ship.id}`,
          node: effectiveStartNode,
          action: "start",
          scuLoaded: 0,
          scuUnloaded: 0,
          cargoOnboard: 0,
          splitNote: `Depart Staging Base (${effectiveStartNode.name})`
        });
      }

      // Precedence tracking
      const unpicked = new Set(shipContracts);
      const onboard = new Map();
      let guard = 0;

      while ((unpicked.size > 0 || onboard.size > 0) && guard < 100) {
        guard++;

        const candidates = [];

        for (const c of unpicked) {
          if (c.scu <= availableCap) {
            candidates.push({
              type: "pickup",
              contract: c,
              targetNode: c.fromNode,
              dist: this.getPairwiseDistance(currentPos, c.fromNode)
            });
          }
        }

        for (const [cId, c] of onboard) {
          candidates.push({
            type: "dropoff",
            contract: c,
            targetNode: c.toNode,
            dist: this.getPairwiseDistance(currentPos, c.toNode)
          });
        }

        if (candidates.length === 0) {
          if (onboard.size > 0) {
            for (const [cId, c] of onboard) {
              candidates.push({
                type: "dropoff",
                contract: c,
                targetNode: c.toNode,
                dist: this.getPairwiseDistance(currentPos, c.toNode)
              });
            }
          } else {
            const hugeContract = Array.from(unpicked)[0];
            const loadFit = Math.min(hugeContract.scu, capacity);
            hugeContract.scu -= loadFit;
            if (hugeContract.scu === 0) unpicked.delete(hugeContract);
            candidates.push({
              type: "pickup",
              contract: { ...hugeContract, scu: loadFit },
              targetNode: hugeContract.fromNode,
              dist: this.getPairwiseDistance(currentPos, hugeContract.fromNode)
            });
          }
        }

        candidates.sort((a, b) => a.dist - b.dist);
        const best = candidates[0];

        if (best.type === "pickup") {
          currentHold += best.contract.scu;
          availableCap -= best.contract.scu;
          unpicked.delete(best.contract);
          onboard.set(best.contract.id, best.contract);

          steps.push({
            uid: `p_${best.contract.id}_${steps.length}`,
            node: best.targetNode,
            action: "pickup",
            scuLoaded: best.contract.scu,
            scuUnloaded: 0,
            cargoOnboard: currentHold,
            contractName: best.contract.name,
            cargoName: best.contract.cargoName,
            splitNote: `Collect +${best.contract.scu} SCU [${best.contract.name}: ${best.contract.cargoName} ➔ ${best.contract.toNode.name}]`
          });
          currentPos = best.targetNode;
        } else {
          currentHold -= best.contract.scu;
          availableCap += best.contract.scu;
          onboard.delete(best.contract.id);

          steps.push({
            uid: `d_${best.contract.id}_${steps.length}`,
            node: best.targetNode,
            action: "dropoff",
            scuLoaded: 0,
            scuUnloaded: best.contract.scu,
            cargoOnboard: currentHold,
            contractName: best.contract.name,
            cargoName: best.contract.cargoName,
            splitNote: `Deliver -${best.contract.scu} SCU [${best.contract.name}: ${best.contract.cargoName} Delivered to ${best.contract.toNode.name} ✓]`
          });
          currentPos = best.targetNode;
        }
      }

      if (steps.length < 2) return;

      const legs = [];
      let shipDist = 0;
      let shipTimeSec = 0;
      let shipFuelL = 0;

      for (let i = 0; i < steps.length - 1; i++) {
        const cur = steps[i].node;
        const nxt = steps[i + 1].node;
        const nxtStep = steps[i + 1];

        const segments = this.getTravelSegments(cur, nxt);
        let legDist = 0;
        let legTime = 0;

        for (const seg of segments) {
          legDist += seg.distanceMkm;
          if (seg.isJumpPoint) {
            legTime += seg.transitDurationSec || 65;
          } else {
            legTime += this.calculateQuantumTime(seg.distanceMkm, drive);
          }
        }

        shipDist += legDist;
        shipTimeSec += legTime;
        const legFuel = Math.round(legDist * fuelBurnRate);
        shipFuelL += legFuel;

        const cargoPercent = Math.min(100, Math.round((nxtStep.cargoOnboard / capacity) * 100));

        legs.push({
          legIndex: i + 1,
          from: cur,
          to: nxt,
          fromUid: steps[i].uid,
          toUid: nxtStep.uid,
          stepType: nxtStep.action || "dropoff",
          distanceMkm: legDist,
          timeSec: legTime,
          timeFormatted: this.formatTime(legTime),
          segments: segments,
          isInterSystem: cur.system !== nxt.system,
          scuLoaded: nxtStep.scuLoaded || 0,
          scuUnloaded: nxtStep.scuUnloaded || 0,
          cargoOnboard: nxtStep.cargoOnboard,
          cargoCapacity: capacity,
          cargoPercent: cargoPercent,
          fuelBurnL: legFuel,
          splitNote: nxtStep.splitNote || "",
          threatBadge: nxt.isIllegal ? { type: 'illegal', label: 'Unmonitored Scrap Yard', details: nxt.threatLevel } : nxt.isPyroHostile ? { type: 'hostile', label: nxt.gang || 'Pirate Outpost', details: nxt.threatLevel } : null
        });
      }

      const shipFuelCost = Math.round((shipFuelL * 1.35) + (legs.length * 150));
      const shipScuLoaded = legs.reduce((s, l) => s + l.scuLoaded, 0);

      totalFleetDist += shipDist;
      maxFleetTimeSec = Math.max(maxFleetTimeSec, shipTimeSec);
      totalFleetFuelL += shipFuelL;
      totalFleetFuelCost += shipFuelCost;
      totalFleetCargoSCU += shipScuLoaded;

      const breadcrumbItems = [];
      steps.forEach((step, index) => {
        let tag = index === 0 ? "[Origin]" : step.action === "pickup" ? `[Pickup +${step.scuLoaded} SCU]` : "[Dropoff]";
        breadcrumbItems.push({
          uid: step.uid,
          node: step.node,
          label: step.node.name,
          tag: tag,
          isOrigin: index === 0,
          isPickup: step.action === "pickup",
          isDropoff: step.action === "dropoff",
          scu: step.scuLoaded || step.scuUnloaded || 0,
          cargoOnboard: step.cargoOnboard || 0
        });
      });

      fleetRoutes.push({
        shipInfo: ship,
        shipIndex: shipIdx + 1,
        waypoints: steps.map(s => s.node),
        solvedSteps: steps,
        breadcrumbItems: breadcrumbItems,
        legs: legs,
        totalDistanceMkm: Number(shipDist.toFixed(2)),
        totalTimeSec: shipTimeSec,
        totalTimeFormatted: this.formatTime(shipTimeSec),
        totalFuelUsedL: shipFuelL,
        estimatedFuelCost: shipFuelCost,
        totalScu: shipScuLoaded,
        capacity: capacity,
        color: ship.color,
        containerManifest: this.calculateContainerBreakdown(shipScuLoaded)
      });
    });

    return {
      isFleet: fleetRoutes.length > 1,
      isContractMode: true,
      fleetRoutes: fleetRoutes,
      totalFleetScu: totalFleetCargoSCU,
      totalFleetDistanceMkm: Number(totalFleetDist.toFixed(2)),
      maxFleetTimeSec: maxFleetTimeSec,
      maxFleetTimeFormatted: this.formatTime(maxFleetTimeSec),
      totalFleetFuelCost: totalFleetFuelCost,
      fleetCommodityStats: null,
      containerManifest: this.calculateContainerBreakdown(totalFleetCargoSCU)
    };
  }
}

if (typeof window !== "undefined") {
  window.RouteOptimizer = RouteOptimizer;
}
