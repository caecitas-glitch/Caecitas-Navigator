/**
 * Star Citizen mobiGlas / Skyline Canvas Starmap Engine
 */

class StarMap {
  constructor(canvas, data, onSelectNode) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.data = data;
    this.onSelectNode = onSelectNode;

    // Viewport state
    this.activeSystem = "stanton"; // "stanton" | "pyro" | "interstellar"
    this.zoom = 12.0; // pixels per Mkm
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.hoveredNode = null;
    this.selectedNode = null;
    this.currentRoute = null;

    // Animation ticker
    this.animTime = 0;

    // Interstellar coordinate offsets for dual-system view
    this.interstellarOffsets = {
      stanton: { x: -75, y: 0 },
      pyro: { x: 75, y: 0 }
    };

    this.initEvents();
    this.resize();
    this.centerView();
    this.startRenderLoop();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  setSystem(systemId) {
    this.activeSystem = systemId;
    this.centerView();
  }

  centerView() {
    this.panX = this.width / 2;
    this.panY = this.height / 2;
    if (this.activeSystem === "stanton") {
      this.zoom = Math.min(this.width, this.height) / 75;
    } else if (this.activeSystem === "pyro") {
      this.zoom = Math.min(this.width, this.height) / 280;
    } else {
      // Interstellar
      this.zoom = Math.min(this.width, this.height) / 240;
    }
  }

  focusOnNode(nodeId) {
    const node = this.data.locationMap[nodeId];
    if (!node) return;

    if (this.activeSystem !== "interstellar" && this.activeSystem !== node.system) {
      this.activeSystem = node.system;
    }

    const screenPos = this.worldToScreen(node.x, node.y, node.system);
    // Adjust pan to put node in center
    this.panX += this.width / 2 - screenPos.x;
    this.panY += this.height / 2 - screenPos.y;
    this.selectedNode = node;

    // Adjust zoom closer if too far
    const minZoom = node.type === "city" || node.type === "outpost" ? 22 : 14;
    if (this.zoom < minZoom) {
      this.zoom = minZoom;
    }
  }

  setFleetRoutes(fleetRoutes) {
    this.fleetRoutes = fleetRoutes || [];
    this.currentRoute = null;
    if (this.fleetRoutes.length === 0) return;

    const allWaypoints = [];
    this.fleetRoutes.forEach(r => {
      if (r.waypoints) allWaypoints.push(...r.waypoints);
    });

    if (allWaypoints.length === 0) return;

    const systems = new Set(allWaypoints.map(w => w.system));
    if (systems.size > 1) {
      this.activeSystem = "interstellar";
    } else {
      this.activeSystem = allWaypoints[0].system;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    allWaypoints.forEach(wp => {
      let wx = wp.x;
      let wy = wp.y;
      if (this.activeSystem === "interstellar") {
        wx += this.interstellarOffsets[wp.system].x;
        wy += this.interstellarOffsets[wp.system].y;
      }
      minX = Math.min(minX, wx);
      maxX = Math.max(maxX, wx);
      minY = Math.min(minY, wy);
      maxY = Math.max(maxY, wy);
    });

    const routeWidth = Math.max(maxX - minX, 10);
    const routeHeight = Math.max(maxY - minY, 10);
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const scaleX = (this.width * 0.65) / routeWidth;
    const scaleY = (this.height * 0.65) / routeHeight;
    this.zoom = Math.min(scaleX, scaleY, 25);

    this.panX = this.width / 2 - midX * this.zoom;
    this.panY = this.height / 2 - midY * this.zoom;
  }

  fitRoute(route) {
    if (!route || !route.waypoints || route.waypoints.length === 0) return;
    this.currentRoute = route;
    this.fleetRoutes = [];

    // Check if route crosses systems
    const systems = new Set(route.waypoints.map(w => w.system));
    if (systems.size > 1) {
      this.activeSystem = "interstellar";
    } else {
      this.activeSystem = route.waypoints[0].system;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    route.waypoints.forEach(wp => {
      let wx = wp.x;
      let wy = wp.y;
      if (this.activeSystem === "interstellar") {
        wx += this.interstellarOffsets[wp.system].x;
        wy += this.interstellarOffsets[wp.system].y;
      }
      minX = Math.min(minX, wx);
      maxX = Math.max(maxX, wx);
      minY = Math.min(minY, wy);
      maxY = Math.max(maxY, wy);
    });

    const routeWidth = Math.max(maxX - minX, 10);
    const routeHeight = Math.max(maxY - minY, 10);
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const scaleX = (this.width * 0.65) / routeWidth;
    const scaleY = (this.height * 0.65) / routeHeight;
    this.zoom = Math.min(scaleX, scaleY, 25);

    this.panX = this.width / 2 - midX * this.zoom;
    this.panY = this.height / 2 - midY * this.zoom;
  }

  worldToScreen(wx, wy, nodeSystem) {
    let x = wx;
    let y = wy;
    if (this.activeSystem === "interstellar" && nodeSystem) {
      x += this.interstellarOffsets[nodeSystem].x;
      y += this.interstellarOffsets[nodeSystem].y;
    }
    return {
      x: this.panX + x * this.zoom,
      y: this.panY + y * this.zoom
    };
  }

  screenToWorld(sx, sy) {
    const wx = (sx - this.panX) / this.zoom;
    const wy = (sy - this.panY) / this.zoom;
    return { wx, wy };
  }

  initEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });

    this.canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
      }
    });

    window.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        const dx = e.clientX - this.dragStartX;
        const dy = e.clientY - this.dragStartY;
        this.panX += dx;
        this.panY += dy;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
      } else if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
        // Hit test for hover
        this.checkHover(mouseX, mouseY);
      }
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const newZoom = Math.max(1.5, Math.min(120, this.zoom * zoomFactor));

      // Zoom towards mouse pointer
      this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoom);
      this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoom);
      this.zoom = newZoom;
    }, { passive: false });

    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const clickedNode = this.getNodeAt(mouseX, mouseY);
      if (clickedNode) {
        this.selectedNode = clickedNode;
        if (this.onSelectNode) {
          this.onSelectNode(clickedNode);
        }
      }
    });
  }

  checkHover(mx, my) {
    const node = this.getNodeAt(mx, my);
    if (node !== this.hoveredNode) {
      this.hoveredNode = node;
      this.canvas.style.cursor = node ? "pointer" : "crosshair";
    }
  }

  getNodeAt(sx, sy) {
    const nodes = this.getVisibleNodes();
    // Prioritize stations, cities, and outposts over large planets if overlapping
    const sorted = [...nodes].sort((a, b) => {
      const rank = { outpost: 5, city: 4, station: 3, jump_point: 3, lagrange: 2, moon: 1, planet: 0 };
      return (rank[b.type] || 0) - (rank[a.type] || 0);
    });

    for (const node of sorted) {
      const pos = this.worldToScreen(node.x, node.y, node.system);
      const hitRadius = Math.max(12, this.getNodeRadius(node) + 5);
      const dist = Math.hypot(sx - pos.x, sy - pos.y);
      if (dist <= hitRadius) {
        return node;
      }
    }
    return null;
  }

  getVisibleNodes() {
    if (this.activeSystem === "interstellar") {
      return this.data.locations;
    }
    return this.data.locations.filter(loc => loc.system === this.activeSystem);
  }

  getNodeRadius(node) {
    switch (node.type) {
      case "planet": return Math.max(8, Math.min(22, 1.2 * this.zoom));
      case "moon": return Math.max(5, Math.min(12, 0.7 * this.zoom));
      case "city": return 6;
      case "station": return 7;
      case "jump_point": return 9;
      case "lagrange": return 5;
      case "outpost": return 4.5;
      default: return 5;
    }
  }

  startRenderLoop() {
    const loop = (t) => {
      this.animTime = t * 0.001;
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Starfield & Deep Space Background
    this.drawBackground(ctx);

    // 2. Draw Orbit Rings & Stars
    this.drawSystemOrbits(ctx);

    // 3. Draw Active Route Vectors (if calculated)
    if (this.currentRoute || (this.fleetRoutes && this.fleetRoutes.length > 0)) {
      this.drawRoute(ctx);
    }

    // 4. Draw Nodes (Planets, Moons, Stations, Outposts)
    this.drawNodes(ctx);

    // 5. Draw Selected Node Reticle & Tooltip
    this.drawOverlays(ctx);
  }

  drawBackground(ctx) {
    // Futuristic grid lines
    ctx.save();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.03)";
    ctx.lineWidth = 1;
    const gridSize = 50;
    const startX = this.panX % gridSize;
    const startY = this.panY % gridSize;

    ctx.beginPath();
    for (let x = startX; x < this.width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = startY; y < this.height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();

    // Radar coordinate compass in corner
    ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
    ctx.font = "10px monospace";
    ctx.fillText(`MAG: ${(this.zoom).toFixed(1)}x | SYS: ${this.activeSystem.toUpperCase()} | POS: [${((-this.panX + this.width/2)/this.zoom).toFixed(1)}, ${((-this.panY + this.height/2)/this.zoom).toFixed(1)}] Mkm`, 16, this.height - 16);
    ctx.restore();
  }

  drawSystemOrbits(ctx) {
    const systemsToDraw = this.activeSystem === "interstellar" ? ["stanton", "pyro"] : [this.activeSystem];

    systemsToDraw.forEach(sysId => {
      const sysData = this.data.systems[sysId];
      const origin = this.worldToScreen(0, 0, sysId);

      // Star Glow
      ctx.save();
      const starGrad = ctx.createRadialGradient(origin.x, origin.y, 2, origin.x, origin.y, sysId === "stanton" ? 35 : 45);
      if (sysId === "stanton") {
        starGrad.addColorStop(0, "rgba(255, 240, 180, 1.0)");
        starGrad.addColorStop(0.3, "rgba(255, 180, 50, 0.6)");
        starGrad.addColorStop(1, "rgba(255, 120, 0, 0)");
      } else {
        // Pyro flare star
        starGrad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        starGrad.addColorStop(0.2, "rgba(255, 70, 30, 0.8)");
        starGrad.addColorStop(0.7, "rgba(200, 20, 10, 0.3)");
        starGrad.addColorStop(1, "rgba(100, 0, 0, 0)");
      }
      ctx.fillStyle = starGrad;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, sysId === "stanton" ? 35 : 45, 0, Math.PI * 2);
      ctx.fill();

      // Star Label
      ctx.fillStyle = sysId === "stanton" ? "#ffdd88" : "#ff6644";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(sysData.star.name.toUpperCase(), origin.x, origin.y + 24);
      ctx.restore();

      // Planet Orbital Rings
      const planets = this.data.locations.filter(loc => loc.system === sysId && loc.type === "planet");
      planets.forEach(p => {
        const radPix = p.orbitRadius * this.zoom;
        ctx.save();
        ctx.strokeStyle = "rgba(0, 210, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radPix, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Jump Point Orbital Ring
      const jumpPoint = this.data.locations.find(loc => loc.system === sysId && loc.type === "jump_point");
      if (jumpPoint && jumpPoint.orbitRadius) {
        ctx.save();
        ctx.strokeStyle = "rgba(168, 85, 247, 0.2)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, jumpPoint.orbitRadius * this.zoom, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });

    // Interstellar Jump Tunnel Conduit in dual-system view
    if (this.activeSystem === "interstellar") {
      const stantonGate = this.data.locationMap["stanton_gateway"];
      const pyroGate = this.data.locationMap["pyro_gateway"];
      if (stantonGate && pyroGate) {
        const p1 = this.worldToScreen(stantonGate.x, stantonGate.y, "stanton");
        const p2 = this.worldToScreen(pyroGate.x, pyroGate.y, "pyro");

        ctx.save();
        // Wormhole glowing beam
        ctx.strokeStyle = "rgba(168, 85, 247, 0.45)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Pulsing energy particles along wormhole
        ctx.strokeStyle = "#c084fc";
        ctx.lineWidth = 2;
        ctx.setLineDash([12, 18]);
        ctx.lineDashOffset = -this.animTime * 35;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Midpoint label
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.fillStyle = "#e9d5ff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("STANTON-PYRO JUMP POINT WORMHOLE", midX, midY - 8);
        ctx.restore();
      }
    }
  }

  drawRoute(ctx) {
    const routesToDraw = (this.fleetRoutes && this.fleetRoutes.length > 0) ? this.fleetRoutes : (this.currentRoute ? [this.currentRoute] : []);
    if (routesToDraw.length === 0) return;

    ctx.save();

    routesToDraw.forEach((route, routeIdx) => {
      if (!route || !route.legs || route.legs.length === 0) return;
      const shipColor = route.color || ["#00f0ff", "#f59e0b", "#c084fc", "#10b981", "#f43f5e"][routeIdx % 5];
      const shipBadge = route.shipInfo ? `S${routeIdx + 1}` : "";

      route.legs.forEach(leg => {
        leg.segments.forEach(seg => {
          const p1 = this.worldToScreen(seg.from.x, seg.from.y, seg.from.system);
          const p2 = this.worldToScreen(seg.to.x, seg.to.y, seg.to.system);

          // Outer glow
          ctx.strokeStyle = seg.isJumpPoint ? "rgba(192, 132, 252, 0.5)" : shipColor + "55";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Inner animated dashed vector
          ctx.strokeStyle = seg.isJumpPoint ? "#d8b4fe" : shipColor;
          ctx.lineWidth = 2.2;
          ctx.setLineDash([10, 8]);
          ctx.lineDashOffset = -(this.animTime * 28 + routeIdx * 8);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Mid-vector directional chevron arrow
          const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          ctx.save();
          ctx.translate(midX, midY);
          ctx.rotate(angle);
          ctx.fillStyle = seg.isJumpPoint ? "#d8b4fe" : shipColor;
          ctx.beginPath();
          ctx.moveTo(7, 0);
          ctx.lineTo(-5, -5);
          ctx.lineTo(-2, 0);
          ctx.lineTo(-5, 5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });
      });

      // Waypoint badges
      route.waypoints.forEach((wp, idx) => {
        const pos = this.worldToScreen(wp.x, wp.y, wp.system);
        const isStart = idx === 0;
        const isEnd = idx === route.waypoints.length - 1;

        ctx.save();
        ctx.fillStyle = isStart ? "#10b981" : isEnd ? "#f59e0b" : shipColor;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const offsetX = -14 - (routeIdx * 14);
        const offsetY = -14 - (routeIdx * 12);
        ctx.arc(pos.x + offsetX, pos.y + offsetY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(shipBadge ? `${shipBadge}#${idx+1}` : `${idx + 1}`, pos.x + offsetX, pos.y + offsetY);
        ctx.restore();
      });
    });

    ctx.restore();
  }

  drawNodes(ctx) {
    const nodes = this.getVisibleNodes();

    nodes.forEach(node => {
      const pos = this.worldToScreen(node.x, node.y, node.system);
      const rad = this.getNodeRadius(node);

      // Node marker based on type
      ctx.save();
      switch (node.type) {
        case "planet":
          this.drawPlanetNode(ctx, pos, rad, node);
          break;
        case "moon":
          this.drawMoonNode(ctx, pos, rad, node);
          break;
        case "station":
          this.drawStationNode(ctx, pos, rad, node);
          break;
        case "city":
          this.drawCityNode(ctx, pos, rad, node);
          break;
        case "jump_point":
          this.drawJumpPointNode(ctx, pos, rad, node);
          break;
        case "lagrange":
          this.drawLagrangeNode(ctx, pos, rad, node);
          break;
        case "outpost":
          this.drawOutpostNode(ctx, pos, rad, node);
          break;
      }

      // Draw label when appropriate zoom or hovered
      const showLabel = this.zoom > 10 || node.type === "planet" || node.type === "jump_point" || node === this.hoveredNode || node === this.selectedNode;
      if (showLabel) {
        ctx.fillStyle = node === this.hoveredNode ? "#38bdf8" : "#e2e8f0";
        ctx.font = node.type === "planet" ? "bold 12px sans-serif" : "10px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
        ctx.shadowBlur = 4;
        ctx.fillText(node.name, pos.x + rad + 6, pos.y);
      }
      ctx.restore();
    });
  }

  drawPlanetNode(ctx, pos, rad, node) {
    ctx.save();

    // Direction to central star (0,0 in world coordinates)
    const starScreen = this.worldToScreen(0, 0, node.system);
    const ldx = starScreen.x - pos.x;
    const ldy = starScreen.y - pos.y;
    const ldist = Math.hypot(ldx, ldy) || 1;
    const nx = ldx / ldist;
    const ny = ldy / ldist;

    // Specular highlight center & shadow center
    const hx = pos.x + nx * rad * 0.35;
    const hy = pos.y + ny * rad * 0.35;

    // 1. Base sphere clipping path
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2);
    ctx.clip();

    // 2. Base planetary surface & procedural textures
    if (node.id === "hurston") {
      // Hurston: Smoggy industrial bronze, toxic smog bands, dust seas
      const bg = ctx.createLinearGradient(pos.x - rad, pos.y - rad, pos.x + rad, pos.y + rad);
      bg.addColorStop(0, "#92400e");
      bg.addColorStop(0.5, "#d97706");
      bg.addColorStop(1, "#451a03");
      ctx.fillStyle = bg;
      ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);

      // Smog & industrial belts
      ctx.fillStyle = "rgba(78, 42, 10, 0.4)";
      for (let i = -rad; i < rad; i += rad * 0.35) {
        ctx.fillRect(pos.x - rad, pos.y + i, rad * 2, rad * 0.18);
      }
    } else if (node.id === "crusader") {
      // Crusader: Swirling pink, peach & violet gas giant bands
      const bg = ctx.createLinearGradient(pos.x, pos.y - rad, pos.x, pos.y + rad);
      bg.addColorStop(0, "#f472b6");
      bg.addColorStop(0.2, "#fda4af");
      bg.addColorStop(0.4, "#fbcfe8");
      bg.addColorStop(0.65, "#fb7185");
      bg.addColorStop(0.85, "#db2777");
      bg.addColorStop(1, "#831843");
      ctx.fillStyle = bg;
      ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);

      // Gas storms and latitudinal atmospheric streams
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.ellipse(pos.x - rad * 0.2, pos.y + rad * 0.1, rad * 0.6, rad * 0.12, 0.05, 0, Math.PI * 2);
      ctx.fill();
    } else if (node.id === "arccorp") {
      // ArcCorp: Bronze cybernetic planet with glowing city grid night lights
      ctx.fillStyle = "#9a3412";
      ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);

      // Metallic city sectors
      ctx.fillStyle = "rgba(154, 52, 18, 0.7)";
      ctx.strokeStyle = "rgba(251, 191, 36, 0.35)";
      ctx.lineWidth = 0.8;
      for (let i = -rad; i < rad; i += rad * 0.3) {
        ctx.beginPath();
        ctx.moveTo(pos.x - rad, pos.y + i);
        ctx.lineTo(pos.x + rad, pos.y + i);
        ctx.stroke();
      }
      // Glowing megalopolis city cluster lights on shadow side
      ctx.fillStyle = "#fef08a";
      for (let j = 0; j < 6; j++) {
        const cx = pos.x - nx * rad * 0.4 + (Math.sin(j * 1.5) * rad * 0.3);
        const cy = pos.y - ny * rad * 0.4 + (Math.cos(j * 1.5) * rad * 0.3);
        ctx.fillRect(cx, cy, 1.5, 1.5);
      }
    } else if (node.id === "microtech") {
      // microTech: Frozen glacial oceans, tundra blues & snowy polar ice caps
      const bg = ctx.createLinearGradient(pos.x - rad, pos.y - rad, pos.x + rad, pos.y + rad);
      bg.addColorStop(0, "#0284c7");
      bg.addColorStop(0.5, "#38bdf8");
      bg.addColorStop(1, "#075985");
      ctx.fillStyle = bg;
      ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);

      // White glacial snow caps & cloud storms
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y - rad * 0.65, rad * 0.45, 0, Math.PI * 2);
      ctx.arc(pos.x, pos.y + rad * 0.65, rad * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y, rad * 0.8, rad * 0.2, -0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (node.id === "pyro_1" || node.id === "pyro_i") {
      // Pyro I: Scorched magma, molten cracks, dark volcanic crust
      ctx.fillStyle = "#450a0a";
      ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pos.x - rad * 0.6, pos.y - rad * 0.2);
      ctx.lineTo(pos.x + rad * 0.2, pos.y + rad * 0.3);
      ctx.lineTo(pos.x + rad * 0.7, pos.y - rad * 0.1);
      ctx.stroke();
    } else if (node.id === "monox") {
      // Monox: Toxic chartreuse sulfur atmosphere
      const bg = ctx.createLinearGradient(pos.x - rad, pos.y, pos.x + rad, pos.y);
      bg.addColorStop(0, "#84cc16");
      bg.addColorStop(0.6, "#a3e635");
      bg.addColorStop(1, "#365314");
      ctx.fillStyle = bg;
      ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);
    } else if (node.id === "bloom") {
      // Bloom: Deep emerald vegetation & teal waters
      const bg = ctx.createRadialGradient(pos.x, pos.y, 2, pos.x, pos.y, rad);
      bg.addColorStop(0, "#16a34a");
      bg.addColorStop(0.7, "#15803d");
      bg.addColorStop(1, "#064e3b");
      ctx.fillStyle = bg;
      ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);

      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.ellipse(pos.x + rad * 0.2, pos.y - rad * 0.1, rad * 0.5, rad * 0.3, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (node.id === "pyro_5" || node.id === "pyro_v") {
      // Pyro V: Golden yellow banded gas giant
      const bg = ctx.createLinearGradient(pos.x, pos.y - rad, pos.x, pos.y + rad);
      bg.addColorStop(0, "#eab308");
      bg.addColorStop(0.3, "#fef08a");
      bg.addColorStop(0.6, "#ca8a04");
      bg.addColorStop(1, "#713f12");
      ctx.fillStyle = bg;
      ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);
    } else {
      // Default rock planet (Terminus / Pyro IV)
      const bg = ctx.createRadialGradient(pos.x, pos.y, 1, pos.x, pos.y, rad);
      bg.addColorStop(0, "#7c3aed");
      bg.addColorStop(0.6, "#475569");
      bg.addColorStop(1, "#1e293b");
      ctx.fillStyle = bg;
      ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);
    }

    // 3. Spherical 3D Day/Night Terminator & Radial Light Shader
    const sphereShader = ctx.createRadialGradient(hx, hy, rad * 0.1, pos.x, pos.y, rad);
    sphereShader.addColorStop(0, "rgba(255, 255, 255, 0.4)");
    sphereShader.addColorStop(0.45, "rgba(255, 255, 255, 0.0)");
    sphereShader.addColorStop(0.8, "rgba(0, 0, 0, 0.45)");
    sphereShader.addColorStop(1, "rgba(0, 0, 0, 0.92)");
    ctx.fillStyle = sphereShader;
    ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);

    ctx.restore();

    // 4. Atmospheric Fresnel Glow / Limb Ring
    ctx.save();
    const atmoGlow = ctx.createRadialGradient(pos.x, pos.y, rad * 0.85, pos.x, pos.y, rad * 1.25);
    const atmoColor = node.id === "crusader" ? "rgba(244, 114, 182, " : node.id === "microtech" ? "rgba(56, 189, 248, " : node.id === "arccorp" ? "rgba(249, 115, 22, " : node.id === "bloom" ? "rgba(34, 197, 94, " : "rgba(0, 240, 255, ";
    atmoGlow.addColorStop(0, atmoColor + "0.4)");
    atmoGlow.addColorStop(0.7, atmoColor + "0.15)");
    atmoGlow.addColorStop(1, atmoColor + "0.0)");
    ctx.fillStyle = atmoGlow;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad * 1.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = atmoColor + "0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawMoonNode(ctx, pos, rad, node) {
    ctx.save();

    // 1. Clip path for spherical lunar orb
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2);
    ctx.clip();

    // 2. Base lunar mineral color
    let baseColor = "#94a3b8";
    if (node.id === "lyria") baseColor = "#cffafe";
    else if (node.id === "daymar") baseColor = "#fde047";
    else if (node.id === "ariel") baseColor = "#fb923c";
    else if (node.id === "yela") baseColor = "#e2e8f0";
    else if (node.id === "aberdeen") baseColor = "#a3e635";
    else if (node.id === "wala") baseColor = "#86efac";

    ctx.fillStyle = baseColor;
    ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);

    // Procedural lunar craters & maria patches
    ctx.fillStyle = "rgba(30, 41, 59, 0.4)";
    ctx.beginPath();
    ctx.arc(pos.x - rad * 0.3, pos.y - rad * 0.2, rad * 0.25, 0, Math.PI * 2);
    ctx.arc(pos.x + rad * 0.25, pos.y + rad * 0.3, rad * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 3. 3D Spherical Light Shader
    const starScreen = this.worldToScreen(0, 0, node.system);
    const ldx = starScreen.x - pos.x;
    const ldy = starScreen.y - pos.y;
    const ldist = Math.hypot(ldx, ldy) || 1;
    const nx = ldx / ldist;
    const ny = ldy / ldist;

    const hx = pos.x + nx * rad * 0.35;
    const hy = pos.y + ny * rad * 0.35;

    const shade = ctx.createRadialGradient(hx, hy, rad * 0.1, pos.x, pos.y, rad);
    shade.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    shade.addColorStop(0.5, "rgba(0, 0, 0, 0.05)");
    shade.addColorStop(1, "rgba(0, 0, 0, 0.85)");
    ctx.fillStyle = shade;
    ctx.fillRect(pos.x - rad, pos.y - rad, rad * 2, rad * 2);

    ctx.restore();

    // Subtle moon rim
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawStationNode(ctx, pos, rad, node) {
    // Diamond station marker
    const isPirate = node.security.includes("Lawless") || node.security.includes("Contested");
    ctx.fillStyle = isPirate ? "#ef4444" : "#06b6d4";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.beginPath();
    ctx.moveTo(0, -rad);
    ctx.lineTo(rad, 0);
    ctx.lineTo(0, rad);
    ctx.lineTo(-rad, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawCityNode(ctx, pos, rad, node) {
    // Futuristic beacon square with crosshair
    ctx.fillStyle = "#3b82f6";
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 1.2;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.fillRect(-rad, -rad, rad * 2, rad * 2);
    ctx.strokeRect(-rad, -rad, rad * 2, rad * 2);
    ctx.restore();
  }

  drawJumpPointNode(ctx, pos, rad, node) {
    // Glowing concentric rings (Jump Gate)
    ctx.save();
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#e9d5ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawLagrangeNode(ctx, pos, rad, node) {
    // Triangle
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.strokeStyle = "#10b981";
    ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -rad);
    ctx.lineTo(rad * 0.9, rad * 0.8);
    ctx.lineTo(-rad * 0.9, rad * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawOutpostNode(ctx, pos, rad, node) {
    ctx.fillStyle = "#f59e0b";
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawOverlays(ctx) {
    // Highlight Selected Node with mobiGlas targeting bracket
    if (this.selectedNode) {
      const pos = this.worldToScreen(this.selectedNode.x, this.selectedNode.y, this.selectedNode.system);
      const boxSize = Math.max(16, this.getNodeRadius(this.selectedNode) + 8);

      ctx.save();
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2;
      const corner = 5;

      // 4 corners
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(pos.x - boxSize, pos.y - boxSize + corner);
      ctx.lineTo(pos.x - boxSize, pos.y - boxSize);
      ctx.lineTo(pos.x - boxSize + corner, pos.y - boxSize);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(pos.x + boxSize - corner, pos.y - boxSize);
      ctx.lineTo(pos.x + boxSize, pos.y - boxSize);
      ctx.lineTo(pos.x + boxSize, pos.y - boxSize + corner);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(pos.x - boxSize, pos.y + boxSize - corner);
      ctx.lineTo(pos.x - boxSize, pos.y + boxSize);
      ctx.lineTo(pos.x - boxSize + corner, pos.y + boxSize);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(pos.x + boxSize - corner, pos.y + boxSize);
      ctx.lineTo(pos.x + boxSize, pos.y + boxSize);
      ctx.lineTo(pos.x + boxSize, pos.y + boxSize - corner);
      ctx.stroke();

      ctx.restore();
    }

    // Hover tooltip
    if (this.hoveredNode && this.hoveredNode !== this.selectedNode) {
      const pos = this.worldToScreen(this.hoveredNode.x, this.hoveredNode.y, this.hoveredNode.system);
      const text = `${this.hoveredNode.name} [${this.hoveredNode.type.toUpperCase()}]`;

      ctx.save();
      ctx.font = "11px sans-serif";
      const w = ctx.measureText(text).width + 16;
      const h = 24;
      const tx = pos.x + 12;
      const ty = pos.y - 28;

      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
      ctx.lineWidth = 1;
      ctx.fillRect(tx, ty, w, h);
      ctx.strokeRect(tx, ty, w, h);

      ctx.fillStyle = "#00f0ff";
      ctx.textBaseline = "middle";
      ctx.fillText(text, tx + 8, ty + h / 2);
      ctx.restore();
    }
  }
}

if (typeof window !== "undefined") {
  window.StarMap = StarMap;
}
