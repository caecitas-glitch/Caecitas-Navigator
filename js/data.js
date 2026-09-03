/**
 * Complete Star Citizen Celestial & Location Database for Stanton and Pyro
 * Generated from live community API data (UEX Corp API 2.0)
 * Total Nodes: 202 (All stations, outposts, moons, planets, and jump gates)
 */

const SC_DATA = {
  systems: {
    stanton: {
      name: "Stanton",
      type: "Star System",
      affiliation: "United Empire of Earth (UEE)",
      security: "High / Medium",
      star: {
        name: "Stanton",
        type: "G-type Main-Sequence Star",
        radius: 0.7
      },
      radiusMkm: 42.0,
      description: "A corporate-owned star system leased to four mega-corporations: Hurston Dynamics, Crusader Industries, ArcCorp, and microTech."
    },
    pyro: {
      name: "Pyro",
      type: "Star System",
      affiliation: "Unclaimed / Pirate Gangs",
      security: "Lawless (Hostile)",
      star: {
        name: "Pyro",
        type: "M-type Flare Star",
        radius: 0.9
      },
      radiusMkm: 140.0,
      description: "A desolate, lawless system centered around an unstable flare star. High hazard, abandoned corporate ruins, and contested pirate zones."
    }
  },

  // Jump Point connection
  jumpTunnel: {
    fromSystem: "stanton",
    toSystem: "pyro",
    stantonNodeId: "stanton_gateway",
    pyroNodeId: "pyro_gateway",
    name: "Stanton-Pyro Jump Point",
    transitDurationSec: 65,
    distanceMkmEquivalent: 15.0
  },

  // Ships / Quantum Drives configuration with Fuel Burn rates (L/Mkm)
  quantumDrives: [
    { id: "size1_civilian", name: "Size 1 - Civilian (Atlas / Voyage)", speedMkmPerSec: 0.152, spoolSec: 5.2, accelSec: 12.0, fuelBurnPerMkm: 42.0, desc: "Standard Light Hauler / Fighter QT Drive (152,000 km/s)" },
    { id: "size2_military", name: "Size 2 - Military (Crossfield / XL-1)", speedMkmPerSec: 0.283, spoolSec: 4.5, accelSec: 10.0, fuelBurnPerMkm: 98.0, desc: "High Speed Medium Hauler (Cutlass / Freelancer / C1 / Taurus) (283,000 km/s)" },
    { id: "size3_industrial", name: "Size 3 - Industrial (TS-2 / Pontes)", speedMkmPerSec: 0.245, spoolSec: 6.0, accelSec: 18.0, fuelBurnPerMkm: 72.0, desc: "Heavy Cargo Transporter (C2 Hercules / Caterpillar / Hull-C) (245,000 km/s)" },
    { id: "size1_stealth", name: "Size 1 - Efficient (Spectre / Colossus)", speedMkmPerSec: 0.088, spoolSec: 7.0, accelSec: 15.0, fuelBurnPerMkm: 26.0, desc: "Eco / Long Range Explorer Drive (88,000 km/s)" }
  ],

  // Popular Hauling Ships, SCU Capacities, Quantum Fuel Tanks (L) & Pad Sizes
  ships: [
    { id: "c2_hercules", name: "Crusader C2 Hercules", scu: 696, fuelTankL: 11000, qtDriveId: "size3_industrial", padClass: "extra_large", canLandOnPlanets: true, minPadSize: "Extra Large (S5/S6)", manufacturer: "Crusader Industries" },
    { id: "caterpillar", name: "Drake Caterpillar", scu: 576, fuelTankL: 11000, qtDriveId: "size3_industrial", padClass: "extra_large", canLandOnPlanets: true, minPadSize: "Extra Large (S5/S6)", manufacturer: "Drake Interplanetary" },
    { id: "ironclad", name: "Drake Ironclad", scu: 1536, fuelTankL: 12500, qtDriveId: "size3_industrial", padClass: "extra_large", canLandOnPlanets: true, minPadSize: "Extra Large (S5/S6)", manufacturer: "Drake Interplanetary" },
    { id: "ironclad_assault", name: "Drake Ironclad Assault", scu: 1152, fuelTankL: 12500, qtDriveId: "size3_industrial", padClass: "extra_large", canLandOnPlanets: true, minPadSize: "Extra Large (S5/S6)", manufacturer: "Drake Interplanetary" },
    { id: "hull_c", name: "MISC Hull C", scu: 4608, fuelTankL: 15000, qtDriveId: "size3_industrial", padClass: "capital_spindle", canLandOnPlanets: false, minPadSize: "Capital Spindle (Space Only)", manufacturer: "MISC" },
    { id: "hull_b", name: "MISC Hull B", scu: 512, fuelTankL: 2750, qtDriveId: "size2_military", padClass: "large", canLandOnPlanets: true, minPadSize: "Large (S4)", manufacturer: "MISC" },
    { id: "hull_a", name: "MISC Hull A", scu: 64, fuelTankL: 650, qtDriveId: "size1_civilian", padClass: "small", canLandOnPlanets: true, minPadSize: "Small (S2)", manufacturer: "MISC" },
    { id: "carrack", name: "Anvil Carrack", scu: 456, fuelTankL: 11000, qtDriveId: "size3_industrial", padClass: "extra_large", canLandOnPlanets: true, minPadSize: "Extra Large (S5/S6)", manufacturer: "Anvil Aerospace" },
    { id: "galaxy", name: "RSI Galaxy (Cargo)", scu: 512, fuelTankL: 11000, qtDriveId: "size3_industrial", padClass: "large", canLandOnPlanets: true, minPadSize: "Large (S4)", manufacturer: "Roberts Space Industries" },
    { id: "bmm", name: "Banu Merchantman (BMM)", scu: 2880, fuelTankL: 15000, qtDriveId: "size3_industrial", padClass: "extra_large", canLandOnPlanets: true, minPadSize: "Capital / XL (S6)", manufacturer: "Banu" },
    { id: "starfarer", name: "MISC Starfarer", scu: 291, fuelTankL: 12000, qtDriveId: "size3_industrial", padClass: "extra_large", canLandOnPlanets: true, minPadSize: "Extra Large (S5)", manufacturer: "MISC" },
    { id: "taurus", name: "RSI Constellation Taurus", scu: 174, fuelTankL: 3000, qtDriveId: "size2_military", padClass: "large", canLandOnPlanets: true, minPadSize: "Large (S4)", manufacturer: "Roberts Space Industries" },
    { id: "freelancer_max", name: "MISC Freelancer MAX", scu: 120, fuelTankL: 3000, qtDriveId: "size2_military", padClass: "medium", canLandOnPlanets: true, minPadSize: "Medium (S3)", manufacturer: "MISC" },
    { id: "msr", name: "Crusader Mercury (MSR)", scu: 114, fuelTankL: 2800, qtDriveId: "size2_military", padClass: "medium", canLandOnPlanets: true, minPadSize: "Medium (S3)", manufacturer: "Crusader Industries" },
    { id: "raft", name: "Argo RAFT", scu: 96, fuelTankL: 2750, qtDriveId: "size2_military", padClass: "medium", canLandOnPlanets: true, minPadSize: "Medium (S3)", manufacturer: "Argo Astronautics" },
    { id: "corsair", name: "Drake Corsair", scu: 72, fuelTankL: 2500, qtDriveId: "size2_military", padClass: "medium", canLandOnPlanets: true, minPadSize: "Medium (S3)", manufacturer: "Drake Interplanetary" },
    { id: "freelancer", name: "MISC Freelancer", scu: 66, fuelTankL: 2500, qtDriveId: "size2_military", padClass: "medium", canLandOnPlanets: true, minPadSize: "Medium (S3)", manufacturer: "MISC" },
    { id: "c1_spirit", name: "Crusader C1 Spirit", scu: 64, fuelTankL: 2500, qtDriveId: "size2_military", padClass: "medium", canLandOnPlanets: true, minPadSize: "Medium (S3)", manufacturer: "Crusader Industries" },
    { id: "cutlass_black", name: "Drake Cutlass Black", scu: 46, fuelTankL: 2500, qtDriveId: "size2_military", padClass: "medium", canLandOnPlanets: true, minPadSize: "Medium (S3)", manufacturer: "Drake Interplanetary" },
    { id: "nomad", name: "Consolidated Outland Nomad", scu: 24, fuelTankL: 750, qtDriveId: "size1_civilian", padClass: "small", canLandOnPlanets: true, minPadSize: "Small (S2)", manufacturer: "Consolidated Outland" },
    { id: "avenger_titan", name: "Aegis Avenger Titan", scu: 8, fuelTankL: 583, qtDriveId: "size1_civilian", padClass: "small", canLandOnPlanets: true, minPadSize: "Small (S1/S2)", manufacturer: "Aegis Dynamics" },
    { id: "custom", name: "Custom Ship Hold", scu: 0, fuelTankL: 5000, qtDriveId: "size2_military", padClass: "medium", canLandOnPlanets: true, minPadSize: "Custom", manufacturer: "Custom" }
  ],

  // Celestial Mining & Ore Composition Survey (Moons & Planets)
  miningOres: {
  "lyria": [
    {
      "name": "Quantanium",
      "minQuality": 14,
      "maxQuality": 48,
      "rarity": "High Value (Volatile)",
      "color": "#a855f7"
    },
    {
      "name": "Bexalite",
      "minQuality": 8,
      "maxQuality": 36,
      "rarity": "Rare",
      "color": "#ec4899"
    },
    {
      "name": "Laranite",
      "minQuality": 12,
      "maxQuality": 44,
      "rarity": "Valuable",
      "color": "#3b82f6"
    },
    {
      "name": "Quartz",
      "minQuality": 25,
      "maxQuality": 85,
      "rarity": "Abundant",
      "color": "#94a3b8"
    }
  ],
  "daymar": [
    {
      "name": "Bexalite",
      "minQuality": 10,
      "maxQuality": 38,
      "rarity": "Rare",
      "color": "#ec4899"
    },
    {
      "name": "Agricium",
      "minQuality": 12,
      "maxQuality": 45,
      "rarity": "Valuable",
      "color": "#eab308"
    },
    {
      "name": "Gold",
      "minQuality": 8,
      "maxQuality": 32,
      "rarity": "High Value",
      "color": "#fbbf24"
    },
    {
      "name": "Beryl",
      "minQuality": 15,
      "maxQuality": 60,
      "rarity": "Common",
      "color": "#10b981"
    }
  ],
  "ariel": [
    {
      "name": "Laranite",
      "minQuality": 18,
      "maxQuality": 52,
      "rarity": "Very High Yield",
      "color": "#3b82f6"
    },
    {
      "name": "Bexalite",
      "minQuality": 12,
      "maxQuality": 40,
      "rarity": "Rare",
      "color": "#ec4899"
    },
    {
      "name": "Titanium",
      "minQuality": 20,
      "maxQuality": 70,
      "rarity": "Common",
      "color": "#64748b"
    },
    {
      "name": "Diamond",
      "minQuality": 15,
      "maxQuality": 55,
      "rarity": "Uncommon",
      "color": "#38bdf8"
    }
  ],
  "yela": [
    {
      "name": "Agricium",
      "minQuality": 10,
      "maxQuality": 42,
      "rarity": "Valuable",
      "color": "#eab308"
    },
    {
      "name": "Laranite",
      "minQuality": 8,
      "maxQuality": 35,
      "rarity": "Valuable",
      "color": "#3b82f6"
    },
    {
      "name": "Diamond",
      "minQuality": 15,
      "maxQuality": 50,
      "rarity": "Uncommon",
      "color": "#38bdf8"
    },
    {
      "name": "Corundum",
      "minQuality": 20,
      "maxQuality": 65,
      "rarity": "Abundant",
      "color": "#94a3b8"
    }
  ],
  "aberdeen": [
    {
      "name": "Hephaestanite",
      "minQuality": 15,
      "maxQuality": 46,
      "rarity": "Dense Deposit",
      "color": "#f97316"
    },
    {
      "name": "Agricium",
      "minQuality": 10,
      "maxQuality": 38,
      "rarity": "Valuable",
      "color": "#eab308"
    },
    {
      "name": "Gold",
      "minQuality": 5,
      "maxQuality": 28,
      "rarity": "Rare",
      "color": "#fbbf24"
    }
  ],
  "magda": [
    {
      "name": "Borase",
      "minQuality": 12,
      "maxQuality": 40,
      "rarity": "Valuable",
      "color": "#06b6d4"
    },
    {
      "name": "Titanium",
      "minQuality": 15,
      "maxQuality": 65,
      "rarity": "Common",
      "color": "#64748b"
    },
    {
      "name": "Diamond",
      "minQuality": 10,
      "maxQuality": 45,
      "rarity": "Uncommon",
      "color": "#38bdf8"
    }
  ],
  "ita": [
    {
      "name": "Borase",
      "minQuality": 10,
      "maxQuality": 38,
      "rarity": "Valuable",
      "color": "#06b6d4"
    },
    {
      "name": "Diamond",
      "minQuality": 12,
      "maxQuality": 48,
      "rarity": "Uncommon",
      "color": "#38bdf8"
    },
    {
      "name": "Quartz",
      "minQuality": 20,
      "maxQuality": 75,
      "rarity": "Abundant",
      "color": "#94a3b8"
    }
  ],
  "cellin": [
    {
      "name": "Gold",
      "minQuality": 6,
      "maxQuality": 30,
      "rarity": "Valuable",
      "color": "#fbbf24"
    },
    {
      "name": "Agricium",
      "minQuality": 8,
      "maxQuality": 32,
      "rarity": "Valuable",
      "color": "#eab308"
    },
    {
      "name": "Beryl",
      "minQuality": 12,
      "maxQuality": 50,
      "rarity": "Common",
      "color": "#10b981"
    }
  ],
  "wala": [
    {
      "name": "Taranite",
      "minQuality": 10,
      "maxQuality": 38,
      "rarity": "Rare",
      "color": "#8b5cf6"
    },
    {
      "name": "Agricium",
      "minQuality": 8,
      "maxQuality": 35,
      "rarity": "Valuable",
      "color": "#eab308"
    },
    {
      "name": "Beryl",
      "minQuality": 14,
      "maxQuality": 58,
      "rarity": "Common",
      "color": "#10b981"
    }
  ],
  "clio": [
    {
      "name": "Taranite",
      "minQuality": 8,
      "maxQuality": 34,
      "rarity": "Rare",
      "color": "#8b5cf6"
    },
    {
      "name": "Agricium",
      "minQuality": 10,
      "maxQuality": 38,
      "rarity": "Valuable",
      "color": "#eab308"
    },
    {
      "name": "Titanium",
      "minQuality": 18,
      "maxQuality": 62,
      "rarity": "Common",
      "color": "#64748b"
    }
  ],
  "calliope": [
    {
      "name": "Agricium",
      "minQuality": 12,
      "maxQuality": 40,
      "rarity": "Valuable",
      "color": "#eab308"
    },
    {
      "name": "Beryl",
      "minQuality": 15,
      "maxQuality": 55,
      "rarity": "Common",
      "color": "#10b981"
    },
    {
      "name": "Quartz",
      "minQuality": 20,
      "maxQuality": 70,
      "rarity": "Abundant",
      "color": "#94a3b8"
    }
  ],
  "euterpe": [
    {
      "name": "Taranite",
      "minQuality": 10,
      "maxQuality": 36,
      "rarity": "Rare",
      "color": "#8b5cf6"
    },
    {
      "name": "Titanium",
      "minQuality": 15,
      "maxQuality": 60,
      "rarity": "Common",
      "color": "#64748b"
    },
    {
      "name": "Quartz",
      "minQuality": 25,
      "maxQuality": 75,
      "rarity": "Abundant",
      "color": "#94a3b8"
    }
  ],
  "monox": [
    {
      "name": "Quantanium",
      "minQuality": 15,
      "maxQuality": 50,
      "rarity": "Extreme Grade (Pyro)",
      "color": "#a855f7"
    },
    {
      "name": "Gold",
      "minQuality": 12,
      "maxQuality": 40,
      "rarity": "High Purity",
      "color": "#fbbf24"
    },
    {
      "name": "Stibnite",
      "minQuality": 20,
      "maxQuality": 65,
      "rarity": "Toxic Mineral",
      "color": "#84cc16"
    }
  ],
  "bloom": [
    {
      "name": "Agricium",
      "minQuality": 15,
      "maxQuality": 48,
      "rarity": "Lush Bed",
      "color": "#eab308"
    },
    {
      "name": "Diamond",
      "minQuality": 18,
      "maxQuality": 55,
      "rarity": "Deep Vein",
      "color": "#38bdf8"
    },
    {
      "name": "Titanium",
      "minQuality": 22,
      "maxQuality": 68,
      "rarity": "Common",
      "color": "#64748b"
    }
  ],
  "terminus": [
    {
      "name": "Bexalite",
      "minQuality": 14,
      "maxQuality": 45,
      "rarity": "Outlaw Crust",
      "color": "#ec4899"
    },
    {
      "name": "Taranite",
      "minQuality": 12,
      "maxQuality": 42,
      "rarity": "Rare",
      "color": "#8b5cf6"
    },
    {
      "name": "Unrefined Ores",
      "minQuality": 25,
      "maxQuality": 70,
      "rarity": "Abundant Slag",
      "color": "#94a3b8"
    }
  ],
  "pyro_i": [
    {
      "name": "Hephaestanite",
      "minQuality": 18,
      "maxQuality": 52,
      "rarity": "Magma Vein",
      "color": "#f97316"
    },
    {
      "name": "Gold",
      "minQuality": 10,
      "maxQuality": 35,
      "rarity": "Molten Crust",
      "color": "#fbbf24"
    },
    {
      "name": "Scorched Basalt",
      "minQuality": 30,
      "maxQuality": 80,
      "rarity": "Surface Rock",
      "color": "#64748b"
    }
  ],
  "pyro_iv": [
    {
      "name": "Bexalite",
      "minQuality": 12,
      "maxQuality": 40,
      "rarity": "Rare",
      "color": "#ec4899"
    },
    {
      "name": "Titanium",
      "minQuality": 20,
      "maxQuality": 65,
      "rarity": "Common",
      "color": "#64748b"
    }
  ],
  "hurston": [
    {
      "name": "Hephaestanite",
      "minQuality": 10,
      "maxQuality": 35,
      "rarity": "Industrial Waste Vein",
      "color": "#f97316"
    },
    {
      "name": "Titanium",
      "minQuality": 15,
      "maxQuality": 55,
      "rarity": "Common",
      "color": "#64748b"
    }
  ],
  "microtech": [
    {
      "name": "Taranite",
      "minQuality": 8,
      "maxQuality": 32,
      "rarity": "Glacial Subsurface",
      "color": "#8b5cf6"
    },
    {
      "name": "Agricium",
      "minQuality": 10,
      "maxQuality": 36,
      "rarity": "Valuable",
      "color": "#eab308"
    }
  ]
},

  // Trading Commodities & Live Market Prices (UEX Corp 2.0)
  commodities: [
  {
    "id": "agricium",
    "name": "Agricium",
    "code": "AGRI",
    "buyPrice": 8190,
    "sellPrice": 9682,
    "kind": "Metal"
  },
  {
    "id": "altruciatoxin",
    "name": "Altruciatoxin",
    "code": "AUTR",
    "buyPrice": 5097,
    "sellPrice": 6345,
    "kind": "Drug"
  },
  {
    "id": "aluminum",
    "name": "Aluminum",
    "code": "ALUM",
    "buyPrice": 2954,
    "sellPrice": 3673,
    "kind": "Metal"
  },
  {
    "id": "astatine",
    "name": "Astatine",
    "code": "ASTA",
    "buyPrice": 2785,
    "sellPrice": 3479,
    "kind": "Halogen"
  },
  {
    "id": "beryl",
    "name": "Beryl",
    "code": "BERY",
    "buyPrice": 15390,
    "sellPrice": 19890,
    "kind": "Mineral"
  },
  {
    "id": "corundum",
    "name": "Corundum",
    "code": "CORU",
    "buyPrice": 2848,
    "sellPrice": 3640,
    "kind": "Mineral"
  },
  {
    "id": "diamond",
    "name": "Diamond",
    "code": "DIAM",
    "buyPrice": 5892,
    "sellPrice": 7577,
    "kind": "Metal"
  },
  {
    "id": "distilled_spirits",
    "name": "Distilled Spirits",
    "code": "DIST",
    "buyPrice": 1501,
    "sellPrice": 1859,
    "kind": "Vice"
  },
  {
    "id": "e_tam",
    "name": "E'tam",
    "code": "ETAM",
    "buyPrice": 17762,
    "sellPrice": 23188,
    "kind": "Drug"
  },
  {
    "id": "gold",
    "name": "Gold",
    "code": "GOLD",
    "buyPrice": 27782,
    "sellPrice": 29191,
    "kind": "Metal"
  },
  {
    "id": "golden_medmon",
    "name": "Golden Medmon",
    "code": "GOLM",
    "buyPrice": 51415,
    "sellPrice": 57634,
    "kind": "Natural"
  },
  {
    "id": "helium",
    "name": "Helium",
    "code": "HELI",
    "buyPrice": 740,
    "sellPrice": 1016,
    "kind": "Gas"
  },
  {
    "id": "hydrogen",
    "name": "Hydrogen",
    "code": "HYDR",
    "buyPrice": 760,
    "sellPrice": 1046,
    "kind": "Gas"
  },
  {
    "id": "laranite",
    "name": "Laranite",
    "code": "LARA",
    "buyPrice": 7391,
    "sellPrice": 8559,
    "kind": "Metal"
  },
  {
    "id": "medical_supplies",
    "name": "Medical Supplies",
    "code": "MEDS",
    "buyPrice": 3670,
    "sellPrice": 5224,
    "kind": "Medical"
  },
  {
    "id": "neon",
    "name": "Neon",
    "code": "NEON",
    "buyPrice": 14517,
    "sellPrice": 18375,
    "kind": "Drug"
  },
  {
    "id": "quartz",
    "name": "Quartz",
    "code": "QUAR",
    "buyPrice": 3407,
    "sellPrice": 4290,
    "kind": "Metal"
  },
  {
    "id": "recycled_material_composite",
    "name": "Recycled Material Composite",
    "code": "RMC",
    "buyPrice": 7485,
    "sellPrice": 7167,
    "kind": "Scrap"
  },
  {
    "id": "slam",
    "name": "SLAM",
    "code": "SLAM",
    "buyPrice": 30386,
    "sellPrice": 37982,
    "kind": "Drug"
  },
  {
    "id": "titanium",
    "name": "Titanium",
    "code": "TITA",
    "buyPrice": 7287,
    "sellPrice": 8178,
    "kind": "Metal"
  },
  {
    "id": "tungsten",
    "name": "Tungsten",
    "code": "TUNG",
    "buyPrice": 8584,
    "sellPrice": 10230,
    "kind": "Metal"
  },
  {
    "id": "widow",
    "name": "WiDoW",
    "code": "WIDO",
    "buyPrice": 5929,
    "sellPrice": 7389,
    "kind": "Drug"
  },
  {
    "id": "hydrogen_fuel",
    "name": "Hydrogen Fuel",
    "code": "HYDF",
    "buyPrice": 782,
    "sellPrice": 710,
    "kind": "Fuel"
  },
  {
    "id": "diamond_laminate",
    "name": "Diamond Laminate",
    "code": "DIAL",
    "buyPrice": 66880,
    "sellPrice": 85304,
    "kind": "Man-made"
  }
],

  // Full Landmark list
  locations: [
  {
    "id": "hurston",
    "name": "Hurston",
    "system": "stanton",
    "type": "planet",
    "parent": null,
    "x": 12.8,
    "y": 0.0,
    "orbitRadius": 12.8,
    "security": "Medium",
    "faction": "Hurston Dynamics",
    "services": [
      "Trade",
      "Refuel",
      "Repair"
    ],
    "description": "Major planetary body in Stanton system: Hurston."
  },
  {
    "id": "crusader",
    "name": "Crusader",
    "system": "stanton",
    "type": "planet",
    "parent": null,
    "x": 0.0,
    "y": 19.0,
    "orbitRadius": 19.0,
    "security": "High",
    "faction": "Crusader Industries",
    "services": [
      "Trade",
      "Refuel",
      "Repair"
    ],
    "description": "Major planetary body in Stanton system: Crusader."
  },
  {
    "id": "arccorp",
    "name": "ArcCorp",
    "system": "stanton",
    "type": "planet",
    "parent": null,
    "x": -22.8,
    "y": 0.0,
    "orbitRadius": 22.8,
    "security": "High",
    "faction": "ArcCorp",
    "services": [
      "Trade",
      "Refuel",
      "Repair"
    ],
    "description": "Major planetary body in Stanton system: ArcCorp."
  },
  {
    "id": "microtech",
    "name": "MicroTech",
    "system": "stanton",
    "type": "planet",
    "parent": null,
    "x": -0.0,
    "y": -28.6,
    "orbitRadius": 28.6,
    "security": "High",
    "faction": "microTech",
    "services": [
      "Trade",
      "Refuel",
      "Repair"
    ],
    "description": "Major planetary body in Stanton system: MicroTech."
  },
  {
    "id": "pyro_i",
    "name": "Pyro I",
    "system": "pyro",
    "type": "planet",
    "parent": null,
    "x": 14.512,
    "y": 4.173,
    "orbitRadius": 15.1,
    "security": "Lawless",
    "faction": "None (Desolate)",
    "services": [
      "Outlaw Commerce",
      "Frontier Hazard"
    ],
    "description": "Celestial body in Pyro system: Pyro I."
  },
  {
    "id": "monox",
    "name": "Monox",
    "system": "pyro",
    "type": "planet",
    "parent": null,
    "x": -27.918,
    "y": 16.044,
    "orbitRadius": 32.2,
    "security": "Lawless",
    "faction": "Rough & Ready / Scavengers",
    "services": [
      "Outlaw Commerce",
      "Frontier Hazard"
    ],
    "description": "Celestial body in Pyro system: Monox."
  },
  {
    "id": "bloom",
    "name": "Bloom",
    "system": "pyro",
    "type": "planet",
    "parent": null,
    "x": 38.36,
    "y": -38.714,
    "orbitRadius": 54.5,
    "security": "Lawless",
    "faction": "Citizens for Pyro",
    "services": [
      "Outlaw Commerce",
      "Frontier Hazard"
    ],
    "description": "Celestial body in Pyro system: Bloom."
  },
  {
    "id": "pyro_iv",
    "name": "Pyro IV",
    "system": "pyro",
    "type": "planet",
    "parent": "pyro_v",
    "x": 62.12,
    "y": 57.871,
    "orbitRadius": 84.9,
    "security": "Lawless",
    "faction": "Unclaimed",
    "services": [
      "Outlaw Commerce",
      "Frontier Hazard"
    ],
    "description": "Celestial body in Pyro system: Pyro IV."
  },
  {
    "id": "pyro_v",
    "name": "Pyro V",
    "system": "pyro",
    "type": "planet",
    "parent": null,
    "x": 62.12,
    "y": 57.871,
    "orbitRadius": 84.9,
    "security": "Lawless",
    "faction": "Contested Syndicate",
    "services": [
      "Outlaw Commerce",
      "Frontier Hazard"
    ],
    "description": "Celestial body in Pyro system: Pyro V."
  },
  {
    "id": "terminus",
    "name": "Terminus",
    "system": "pyro",
    "type": "planet",
    "parent": null,
    "x": -84.347,
    "y": 92.523,
    "orbitRadius": 125.2,
    "security": "Lawless (Pirate Capital)",
    "faction": "Pyro Council / Outlaws",
    "services": [
      "Outlaw Commerce",
      "Frontier Hazard"
    ],
    "description": "Celestial body in Pyro system: Terminus."
  },
  {
    "id": "stanton_gateway",
    "name": "Stanton Gateway (Stanton-Pyro Jump Point)",
    "system": "stanton",
    "type": "jump_point",
    "parent": null,
    "x": 28.5,
    "y": 22.0,
    "orbitRadius": 36.0,
    "security": "Medium / UEE Navy",
    "faction": "UEE Navy & Gateway Authority",
    "services": [
      "Jump Gate Access",
      "Platinum Bay",
      "Refuel",
      "Repair",
      "Customs"
    ],
    "description": "Jump point station connecting Stanton to Pyro."
  },
  {
    "id": "pyro_gateway",
    "name": "Stanton Gateway (Pyro-Stanton Jump Point)",
    "system": "pyro",
    "type": "jump_point",
    "parent": null,
    "x": -45.0,
    "y": -35.0,
    "orbitRadius": 57.0,
    "security": "Lawless / Contested",
    "faction": "Frontier Cartel / Contested",
    "services": [
      "Jump Gate Access",
      "Refuel",
      "Repair",
      "Black Market"
    ],
    "description": "Primary jump gate entrance from Stanton into Pyro."
  },
  {
    "id": "nyx_gateway_pyro",
    "name": "Nyx Gateway (Pyro Jump Point)",
    "system": "pyro",
    "type": "jump_point",
    "parent": null,
    "x": 114.0,
    "y": -62.0,
    "orbitRadius": 130.0,
    "security": "Lawless",
    "faction": "Independent Outlaws",
    "services": [
      "Jump Gate Access",
      "Refuel"
    ],
    "description": "Jump point connecting Pyro to Nyx system."
  },
  {
    "id": "aberdeen",
    "name": "Aberdeen",
    "system": "stanton",
    "type": "moon",
    "parent": "hurston",
    "x": 13.049,
    "y": 0.434,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Hurston in Stanton."
  },
  {
    "id": "arial",
    "name": "Arial",
    "system": "stanton",
    "type": "moon",
    "parent": "hurston",
    "x": 12.472,
    "y": 0.561,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Hurston in Stanton."
  },
  {
    "id": "calliope",
    "name": "Calliope",
    "system": "stanton",
    "type": "moon",
    "parent": "microtech",
    "x": 0.249,
    "y": -28.166,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of MicroTech in Stanton."
  },
  {
    "id": "cellin",
    "name": "Cellin",
    "system": "stanton",
    "type": "moon",
    "parent": "crusader",
    "x": 0.249,
    "y": 19.434,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Crusader in Stanton."
  },
  {
    "id": "clio",
    "name": "Clio",
    "system": "stanton",
    "type": "moon",
    "parent": "microtech",
    "x": -0.328,
    "y": -28.039,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of MicroTech in Stanton."
  },
  {
    "id": "daymar",
    "name": "Daymar",
    "system": "stanton",
    "type": "moon",
    "parent": "crusader",
    "x": -0.328,
    "y": 19.561,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Crusader in Stanton."
  },
  {
    "id": "euterpe",
    "name": "Euterpe",
    "system": "stanton",
    "type": "moon",
    "parent": "microtech",
    "x": -0.8,
    "y": -28.607,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of MicroTech in Stanton."
  },
  {
    "id": "ita",
    "name": "Ita",
    "system": "stanton",
    "type": "moon",
    "parent": "hurston",
    "x": 12.0,
    "y": -0.007,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Hurston in Stanton."
  },
  {
    "id": "lyria",
    "name": "Lyria",
    "system": "stanton",
    "type": "moon",
    "parent": "arccorp",
    "x": -22.551,
    "y": 0.434,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of ArcCorp in Stanton."
  },
  {
    "id": "magda",
    "name": "Magda",
    "system": "stanton",
    "type": "moon",
    "parent": "hurston",
    "x": 12.334,
    "y": -0.828,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Hurston in Stanton."
  },
  {
    "id": "wala",
    "name": "Wala",
    "system": "stanton",
    "type": "moon",
    "parent": "arccorp",
    "x": -23.128,
    "y": 0.561,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of ArcCorp in Stanton."
  },
  {
    "id": "yela",
    "name": "Yela",
    "system": "stanton",
    "type": "moon",
    "parent": "crusader",
    "x": -0.8,
    "y": 18.993,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Crusader in Stanton."
  },
  {
    "id": "adir",
    "name": "Adir",
    "system": "pyro",
    "type": "moon",
    "parent": "pyro_v",
    "x": 62.369,
    "y": 58.305,
    "security": "Lawless",
    "faction": "Independent",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Pyro V in Pyro."
  },
  {
    "id": "fairo",
    "name": "Fairo",
    "system": "pyro",
    "type": "moon",
    "parent": "pyro_v",
    "x": 61.792,
    "y": 58.432,
    "security": "Lawless",
    "faction": "Independent",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Pyro V in Pyro."
  },
  {
    "id": "fuego",
    "name": "Fuego",
    "system": "pyro",
    "type": "moon",
    "parent": "pyro_v",
    "x": 61.32,
    "y": 57.864,
    "security": "Lawless",
    "faction": "Independent",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Pyro V in Pyro."
  },
  {
    "id": "ignis",
    "name": "Ignis",
    "system": "pyro",
    "type": "moon",
    "parent": "pyro_v",
    "x": 61.655,
    "y": 57.043,
    "security": "Lawless",
    "faction": "Independent",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Pyro V in Pyro."
  },
  {
    "id": "vatra",
    "name": "Vatra",
    "system": "pyro",
    "type": "moon",
    "parent": "pyro_v",
    "x": 62.684,
    "y": 56.926,
    "security": "Lawless",
    "faction": "Independent",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Pyro V in Pyro."
  },
  {
    "id": "vuur",
    "name": "Vuur",
    "system": "pyro",
    "type": "moon",
    "parent": "pyro_v",
    "x": 63.37,
    "y": 57.892,
    "security": "Lawless",
    "faction": "Independent",
    "services": [
      "Outposts",
      "Mining Reserves"
    ],
    "description": "Moon of Pyro V in Pyro."
  },
  {
    "id": "area_18",
    "name": "Area 18",
    "system": "stanton",
    "type": "city",
    "parent": "arccorp",
    "x": -22.8,
    "y": 0.02,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops",
      "Interstellar Spaceport"
    ],
    "description": "Major landing city on ArcCorp."
  },
  {
    "id": "lorville",
    "name": "Lorville",
    "system": "stanton",
    "type": "city",
    "parent": "hurston",
    "x": 12.8,
    "y": 0.02,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops",
      "Interstellar Spaceport"
    ],
    "description": "Major landing city on Hurston."
  },
  {
    "id": "new_babbage",
    "name": "New Babbage",
    "system": "stanton",
    "type": "city",
    "parent": "microtech",
    "x": -0.0,
    "y": -28.58,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops",
      "Interstellar Spaceport"
    ],
    "description": "Major landing city on MicroTech."
  },
  {
    "id": "orison",
    "name": "Orison",
    "system": "stanton",
    "type": "city",
    "parent": "crusader",
    "x": 0.0,
    "y": 19.02,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops",
      "Interstellar Spaceport"
    ],
    "description": "Major landing city on Crusader."
  },
  {
    "id": "grim_hex",
    "name": "Grim HEX (Yela Asteroid Belt)",
    "system": "stanton",
    "type": "station",
    "parent": "crusader",
    "x": -1.0,
    "y": 18.5,
    "security": "Lawless (Pirate Haven)",
    "faction": "Nine Tails / Outlaws",
    "services": [
      "Black Market Cargo",
      "No-Scan Hangars",
      "Weapons/Armor",
      "Habitation",
      "Clinic",
      "Refuel"
    ],
    "description": "Converted Green Imperial asteroid station and legendary outlaw haven in Stanton."
  },
  {
    "id": "arc_l1_wide_forest_station",
    "name": "ARC-L1 Wide Forest Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "arccorp",
    "x": -20.3,
    "y": 0.0,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (ArcCorp Lagrange Point 1)."
  },
  {
    "id": "arc_l2_lively_pathway_station",
    "name": "ARC-L2 Lively Pathway Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "arccorp",
    "x": -25.8,
    "y": 0.0,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (ArcCorp Lagrange Point 2)."
  },
  {
    "id": "arc_l3_modern_express_station",
    "name": "ARC-L3 Modern Express Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "arccorp",
    "x": 22.8,
    "y": -0.0,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Shops"
    ],
    "description": "Space station in Stanton (ArcCorp Lagrange Point 3)."
  },
  {
    "id": "arc_l4_faint_glen_station",
    "name": "ARC-L4 Faint Glen Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "arccorp",
    "x": -11.4,
    "y": -19.745,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (ArcCorp Lagrange Point 4)."
  },
  {
    "id": "arc_l5_yellow_core_station",
    "name": "ARC-L5 Yellow Core Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "arccorp",
    "x": -11.4,
    "y": 19.745,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (ArcCorp Lagrange Point 5)."
  },
  {
    "id": "baijini_point",
    "name": "Baijini Point",
    "system": "stanton",
    "type": "station",
    "parent": "arccorp",
    "x": -22.8,
    "y": -0.08,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (ArcCorp)."
  },
  {
    "id": "cru_l1_ambitious_dream_station",
    "name": "CRU-L1 Ambitious Dream Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "crusader",
    "x": 0.0,
    "y": 16.5,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Crusader Lagrange Point 1)."
  },
  {
    "id": "cru_l4_shallow_fields_station",
    "name": "CRU-L4 Shallow Fields Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "crusader",
    "x": -16.454,
    "y": 9.5,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Crusader Lagrange Point 4)."
  },
  {
    "id": "cru_l5_beautiful_glen_station",
    "name": "CRU-L5 Beautiful Glen Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "crusader",
    "x": 16.454,
    "y": 9.5,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Crusader Lagrange Point 5)."
  },
  {
    "id": "everus_harbor",
    "name": "Everus Harbor",
    "system": "stanton",
    "type": "station",
    "parent": "hurston",
    "x": 12.8,
    "y": -0.08,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Hurston)."
  },
  {
    "id": "green_imperial_housing_exchange",
    "name": "Green Imperial Housing Exchange",
    "system": "stanton",
    "type": "station",
    "parent": "crusader",
    "x": 0.0,
    "y": 18.92,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Crusader)."
  },
  {
    "id": "hur_l1_green_glade_station",
    "name": "HUR-L1 Green Glade Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "hurston",
    "x": 10.3,
    "y": 0.0,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Hurston Lagrange Point 1)."
  },
  {
    "id": "hur_l2_faithful_dream_station",
    "name": "HUR-L2 Faithful Dream Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "hurston",
    "x": 15.8,
    "y": 0.0,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Hurston Lagrange Point 2)."
  },
  {
    "id": "hur_l3_thundering_express_station",
    "name": "HUR-L3 Thundering Express Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "hurston",
    "x": -12.8,
    "y": 0.0,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Hurston Lagrange Point 3)."
  },
  {
    "id": "hur_l4_melodic_fields_station",
    "name": "HUR-L4 Melodic Fields Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "hurston",
    "x": 6.4,
    "y": 11.085,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Hurston Lagrange Point 4)."
  },
  {
    "id": "hur_l5_high_course_station",
    "name": "HUR-L5 High Course Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "hurston",
    "x": 6.4,
    "y": -11.085,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Hurston Lagrange Point 5)."
  },
  {
    "id": "mic_l1_shallow_frontier_station",
    "name": "MIC-L1 Shallow Frontier Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "microtech",
    "x": -0.0,
    "y": -26.1,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (microTech Lagrange Point 1)."
  },
  {
    "id": "mic_l2_long_forest_station",
    "name": "MIC-L2 Long Forest Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "microtech",
    "x": -0.0,
    "y": -31.6,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (microTech Lagrange Point 2)."
  },
  {
    "id": "mic_l3_endless_odyssey_station",
    "name": "MIC-L3 Endless Odyssey Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "microtech",
    "x": 0.0,
    "y": 28.6,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (microTech Lagrange Point 3)."
  },
  {
    "id": "mic_l4_red_crossroads_station",
    "name": "MIC-L4 Red Crossroads Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "microtech",
    "x": 24.768,
    "y": -14.3,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (microTech Lagrange Point 4)."
  },
  {
    "id": "mic_l5_modern_icarus_station",
    "name": "MIC-L5 Modern Icarus Station",
    "system": "stanton",
    "type": "lagrange",
    "parent": "microtech",
    "x": -24.768,
    "y": -14.3,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (microTech Lagrange Point 5)."
  },
  {
    "id": "port_olisar",
    "name": "Port Olisar",
    "system": "stanton",
    "type": "station",
    "parent": "crusader",
    "x": 0.0,
    "y": 18.92,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Stanton (Crusader)."
  },
  {
    "id": "port_tressler",
    "name": "Port Tressler",
    "system": "stanton",
    "type": "station",
    "parent": "microtech",
    "x": -0.0,
    "y": -28.68,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (MicroTech)."
  },
  {
    "id": "seraphim_station",
    "name": "Seraphim Station",
    "system": "stanton",
    "type": "station",
    "parent": "crusader",
    "x": 0.0,
    "y": 18.92,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Stanton (Crusader)."
  },
  {
    "id": "ins_jericho",
    "name": "INS Jericho",
    "system": "stanton",
    "type": "lagrange",
    "parent": "microtech",
    "x": -0.0,
    "y": -26.1,
    "security": "High",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Space station in Stanton (microTech Lagrange Point 1)."
  },
  {
    "id": "wikelo_emporium_kinga_station",
    "name": "Wikelo Emporium Kinga Station",
    "system": "stanton",
    "type": "station",
    "parent": null,
    "x": 0.0,
    "y": -0.08,
    "security": "High",
    "faction": "R&R / Corporation",
    "services": [
      "Refuel",
      "Repair"
    ],
    "description": "Space station in Stanton (None)."
  },
  {
    "id": "wikelo_emporium_dasi_station",
    "name": "Wikelo Emporium Dasi Station",
    "system": "stanton",
    "type": "station",
    "parent": null,
    "x": 0.0,
    "y": -0.08,
    "security": "High",
    "faction": "R&R / Corporation",
    "services": [
      "Refuel",
      "Repair"
    ],
    "description": "Space station in Stanton (None)."
  },
  {
    "id": "wikelo_emporium_selo_station",
    "name": "Wikelo Emporium Selo Station",
    "system": "stanton",
    "type": "station",
    "parent": null,
    "x": 0.0,
    "y": -0.08,
    "security": "High",
    "faction": "R&R / Corporation",
    "services": [
      "Refuel",
      "Repair"
    ],
    "description": "Space station in Stanton (None)."
  },
  {
    "id": "pyam_farstat_1_2",
    "name": "PYAM-FARSTAT-1-2",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_i",
    "x": 17.395,
    "y": 5.002,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Pyro I Lagrange Point 2)."
  },
  {
    "id": "pyam_farstat_1_3",
    "name": "PYAM-FARSTAT-1-3",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_i",
    "x": -14.512,
    "y": -4.173,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Pyro I Lagrange Point 3)."
  },
  {
    "id": "pyam_farstat_1_5",
    "name": "PYAM-FARSTAT-1-5",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_i",
    "x": 10.87,
    "y": -10.481,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Pyro I Lagrange Point 5)."
  },
  {
    "id": "checkmate_station",
    "name": "Checkmate Station",
    "system": "pyro",
    "type": "lagrange",
    "parent": "monox",
    "x": -27.854,
    "y": -16.156,
    "security": "Contested Zone (PvP / High Threat)",
    "faction": "Rough & Ready",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Monox Lagrange Point 4)."
  },
  {
    "id": "orbituary",
    "name": "Orbituary",
    "system": "pyro",
    "type": "station",
    "parent": "bloom",
    "x": 38.21,
    "y": -38.614,
    "security": "Contested Zone (PvP / High Threat)",
    "faction": "Rough & Ready",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Bloom)."
  },
  {
    "id": "starlight_service_station",
    "name": "Starlight Service Station",
    "system": "pyro",
    "type": "lagrange",
    "parent": "bloom",
    "x": 36.6,
    "y": -36.938,
    "security": "Lawless / Contested",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Bloom Lagrange Point 1)."
  },
  {
    "id": "patch_city",
    "name": "Patch City",
    "system": "pyro",
    "type": "lagrange",
    "parent": "bloom",
    "x": -38.36,
    "y": 38.714,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Bloom Lagrange Point 3)."
  },
  {
    "id": "pyam_farstat_3_5",
    "name": "PYAM-FARSTAT-3-5",
    "system": "pyro",
    "type": "lagrange",
    "parent": "bloom",
    "x": -14.348,
    "y": -52.577,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Bloom Lagrange Point 5)."
  },
  {
    "id": "pyam_farstat_5_1",
    "name": "PYAM-FARSTAT-5-1",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_v",
    "x": 60.291,
    "y": 56.167,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Pyro V Lagrange Point 1)."
  },
  {
    "id": "pyam_farstat_5_3",
    "name": "PYAM-FARSTAT-5-3",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_v",
    "x": -62.12,
    "y": -57.871,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Pyro V Lagrange Point 3)."
  },
  {
    "id": "rod_s_fuel_n_supplies",
    "name": "Rod's Fuel 'N Supplies",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_v",
    "x": -19.058,
    "y": 82.733,
    "security": "Lawless / Contested",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Pyro V Lagrange Point 4)."
  },
  {
    "id": "rat_s_nest",
    "name": "Rat's Nest",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_v",
    "x": 81.178,
    "y": -24.862,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Pyro V Lagrange Point 5)."
  },
  {
    "id": "pyam_farstat_6_2",
    "name": "PYAM-FARSTAT-6-2",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_iv",
    "x": 64.315,
    "y": 59.916,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Pyro VI Lagrange Point 2)."
  },
  {
    "id": "endgame",
    "name": "Endgame",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_iv",
    "x": -62.12,
    "y": -57.871,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Pyro VI Lagrange Point 3)."
  },
  {
    "id": "dudley_daughters",
    "name": "Dudley & Daughters",
    "system": "pyro",
    "type": "lagrange",
    "parent": "terminus",
    "x": -122.301,
    "y": -26.785,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Pyro VI Lagrange Point 4)."
  },
  {
    "id": "megumi_refueling",
    "name": "Megumi Refueling",
    "system": "pyro",
    "type": "lagrange",
    "parent": "terminus",
    "x": 37.954,
    "y": 119.309,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Pyro VI Lagrange Point 5)."
  },
  {
    "id": "ruin_station",
    "name": "Ruin Station",
    "system": "pyro",
    "type": "station",
    "parent": "terminus",
    "x": -84.227,
    "y": 92.403,
    "security": "Contested Zone (PvP / High Threat)",
    "faction": "Rough & Ready",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Refinery Deck",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Terminus)."
  },
  {
    "id": "gaslight",
    "name": "Gaslight",
    "system": "pyro",
    "type": "lagrange",
    "parent": "pyro_v",
    "x": 64.315,
    "y": 59.916,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Habitation",
      "Clinic",
      "Shops"
    ],
    "description": "Space station in Pyro (Pyro V Lagrange Point 2)."
  },
  {
    "id": "pyam_farstat_2_3",
    "name": "PYAM-FARSTAT-2-3",
    "system": "pyro",
    "type": "lagrange",
    "parent": "monox",
    "x": 27.918,
    "y": -16.044,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Monox Lagrange Point 3)."
  },
  {
    "id": "pyam_supvisr_3_4",
    "name": "PYAM-SUPVISR-3-4",
    "system": "pyro",
    "type": "lagrange",
    "parent": "bloom",
    "x": 52.707,
    "y": 13.863,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Bloom Lagrange Point 4)."
  },
  {
    "id": "pyam_supvisr_3_5",
    "name": "PYAM-SUPVISR-3-5",
    "system": "pyro",
    "type": "lagrange",
    "parent": "bloom",
    "x": -14.348,
    "y": -52.577,
    "security": "Lawless / Contested",
    "faction": "Rough & Ready / Outlaws",
    "services": [
      "Trade Terminal"
    ],
    "description": "Space station in Pyro (Bloom Lagrange Point 5)."
  },
  {
    "id": "arccorp_mining_area_045",
    "name": "ArcCorp Mining Area 045",
    "system": "stanton",
    "type": "outpost",
    "parent": "wala",
    "x": -23.091,
    "y": 0.595,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Clinic"
    ],
    "description": "Surface outpost on Wala in Stanton."
  },
  {
    "id": "arccorp_mining_area_048",
    "name": "ArcCorp Mining Area 048",
    "system": "stanton",
    "type": "outpost",
    "parent": "wala",
    "x": -23.123,
    "y": 0.631,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Clinic"
    ],
    "description": "Surface outpost on Wala in Stanton."
  },
  {
    "id": "arccorp_mining_area_056",
    "name": "ArcCorp Mining Area 056",
    "system": "stanton",
    "type": "outpost",
    "parent": "wala",
    "x": -23.147,
    "y": 0.584,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Clinic"
    ],
    "description": "Surface outpost on Wala in Stanton."
  },
  {
    "id": "arccorp_mining_area_061",
    "name": "ArcCorp Mining Area 061",
    "system": "stanton",
    "type": "outpost",
    "parent": "wala",
    "x": -23.177,
    "y": 0.568,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Clinic"
    ],
    "description": "Surface outpost on Wala in Stanton."
  },
  {
    "id": "arccorp_mining_area_141",
    "name": "ArcCorp Mining Area 141",
    "system": "stanton",
    "type": "outpost",
    "parent": "daymar",
    "x": -0.291,
    "y": 19.595,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Daymar in Stanton."
  },
  {
    "id": "arccorp_mining_area_157",
    "name": "ArcCorp Mining Area 157",
    "system": "stanton",
    "type": "outpost",
    "parent": "yela",
    "x": -0.763,
    "y": 19.027,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Yela in Stanton."
  },
  {
    "id": "benson_mining_outpost",
    "name": "Benson Mining Outpost",
    "system": "stanton",
    "type": "outpost",
    "parent": "yela",
    "x": -0.795,
    "y": 19.063,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Yela in Stanton."
  },
  {
    "id": "bountiful_harvest_hydroponics",
    "name": "Bountiful Harvest Hydroponics",
    "system": "stanton",
    "type": "outpost",
    "parent": "daymar",
    "x": -0.323,
    "y": 19.631,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Daymar in Stanton."
  },
  {
    "id": "brio_s_breaker_yard",
    "name": "Brio's Breaker Yard",
    "system": "stanton",
    "type": "outpost",
    "parent": "daymar",
    "x": -0.347,
    "y": 19.584,
    "security": "Lawless (Pirate / Contested)",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Daymar in Stanton."
  },
  {
    "id": "bud_s_growery",
    "name": "Bud's Growery",
    "system": "stanton",
    "type": "outpost",
    "parent": "euterpe",
    "x": -0.763,
    "y": -28.573,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Euterpe in Stanton."
  },
  {
    "id": "deakins_research",
    "name": "Deakins Research",
    "system": "stanton",
    "type": "outpost",
    "parent": "yela",
    "x": -0.819,
    "y": 19.016,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Yela in Stanton."
  },
  {
    "id": "devlin_scrap_salvage",
    "name": "Devlin Scrap & Salvage",
    "system": "stanton",
    "type": "outpost",
    "parent": "euterpe",
    "x": -0.795,
    "y": -28.537,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Euterpe in Stanton."
  },
  {
    "id": "gallete_family_farms",
    "name": "Gallete Family Farms",
    "system": "stanton",
    "type": "outpost",
    "parent": "cellin",
    "x": 0.286,
    "y": 19.468,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Cellin in Stanton."
  },
  {
    "id": "hdms_anderson",
    "name": "HDMS-Anderson",
    "system": "stanton",
    "type": "outpost",
    "parent": "aberdeen",
    "x": 13.086,
    "y": 0.468,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Clinic"
    ],
    "description": "Surface outpost on Aberdeen in Stanton."
  },
  {
    "id": "hdms_bezdek",
    "name": "HDMS-Bezdek",
    "system": "stanton",
    "type": "outpost",
    "parent": "arial",
    "x": 12.509,
    "y": 0.595,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Arial in Stanton."
  },
  {
    "id": "hdms_edmond",
    "name": "HDMS-Edmond",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.837,
    "y": 0.034,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "hdms_hadley",
    "name": "HDMS-Hadley",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.805,
    "y": 0.07,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Clinic"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "hdms_hahn",
    "name": "HDMS-Hahn",
    "system": "stanton",
    "type": "outpost",
    "parent": "magda",
    "x": 12.371,
    "y": -0.794,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Magda in Stanton."
  },
  {
    "id": "hdms_lathan",
    "name": "HDMS-Lathan",
    "system": "stanton",
    "type": "outpost",
    "parent": "arial",
    "x": 12.477,
    "y": 0.631,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Arial in Stanton."
  },
  {
    "id": "hdms_norgaard",
    "name": "HDMS-Norgaard",
    "system": "stanton",
    "type": "outpost",
    "parent": "aberdeen",
    "x": 13.054,
    "y": 0.504,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Clinic"
    ],
    "description": "Surface outpost on Aberdeen in Stanton."
  },
  {
    "id": "hdms_oparei",
    "name": "HDMS-Oparei",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.781,
    "y": 0.023,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "hdms_perlman",
    "name": "HDMS-Perlman",
    "system": "stanton",
    "type": "outpost",
    "parent": "magda",
    "x": 12.339,
    "y": -0.758,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Magda in Stanton."
  },
  {
    "id": "hdms_pinewood",
    "name": "HDMS-Pinewood",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.751,
    "y": 0.007,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "hdms_ryder",
    "name": "HDMS-Ryder",
    "system": "stanton",
    "type": "outpost",
    "parent": "ita",
    "x": 12.037,
    "y": 0.027,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Ita in Stanton."
  },
  {
    "id": "hdms_stanhope",
    "name": "HDMS-Stanhope",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.743,
    "y": -0.04,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Clinic"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "hdms_thedus",
    "name": "HDMS-Thedus",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.794,
    "y": -0.029,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "hdms_woodruff",
    "name": "HDMS-Woodruff",
    "system": "stanton",
    "type": "outpost",
    "parent": "ita",
    "x": 12.005,
    "y": 0.063,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Ita in Stanton."
  },
  {
    "id": "hickes_research",
    "name": "Hickes Research",
    "system": "stanton",
    "type": "outpost",
    "parent": "cellin",
    "x": 0.254,
    "y": 19.504,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Cellin in Stanton."
  },
  {
    "id": "humboldt_mines",
    "name": "Humboldt Mines",
    "system": "stanton",
    "type": "outpost",
    "parent": "lyria",
    "x": -22.514,
    "y": 0.468,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Lyria in Stanton."
  },
  {
    "id": "jumptown",
    "name": "Jumptown",
    "system": "stanton",
    "type": "outpost",
    "parent": "yela",
    "x": -0.849,
    "y": 19.0,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Yela in Stanton."
  },
  {
    "id": "kudre_ore",
    "name": "Kudre Ore",
    "system": "stanton",
    "type": "outpost",
    "parent": "daymar",
    "x": -0.377,
    "y": 19.568,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Daymar in Stanton."
  },
  {
    "id": "loveridge_mineral_reserve",
    "name": "Loveridge Mineral Reserve",
    "system": "stanton",
    "type": "outpost",
    "parent": "lyria",
    "x": -22.546,
    "y": 0.504,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Lyria in Stanton."
  },
  {
    "id": "nt_999_xx",
    "name": "NT-999-XX",
    "system": "stanton",
    "type": "outpost",
    "parent": "yela",
    "x": -0.857,
    "y": 18.953,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Yela in Stanton."
  },
  {
    "id": "nuen_waste_management",
    "name": "Nuen Waste Management",
    "system": "stanton",
    "type": "outpost",
    "parent": "daymar",
    "x": -0.385,
    "y": 19.521,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Daymar in Stanton."
  },
  {
    "id": "outpost_54",
    "name": "Outpost 54",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": 0.037,
    "y": -28.566,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "paradise_cove",
    "name": "Paradise Cove",
    "system": "stanton",
    "type": "outpost",
    "parent": "wala",
    "x": -23.185,
    "y": 0.521,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Wala in Stanton."
  },
  {
    "id": "private_property",
    "name": "Private Property",
    "system": "stanton",
    "type": "outpost",
    "parent": "cellin",
    "x": 0.23,
    "y": 19.457,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Cellin in Stanton."
  },
  {
    "id": "raven_s_roost",
    "name": "Raven's Roost",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": 0.005,
    "y": -28.53,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "rayari_anvik_research_outpost",
    "name": "Rayari Anvik Research Outpost",
    "system": "stanton",
    "type": "outpost",
    "parent": "calliope",
    "x": 0.286,
    "y": -28.132,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Calliope in Stanton."
  },
  {
    "id": "rayari_cantwell_research_outpost",
    "name": "Rayari Cantwell Research Outpost",
    "system": "stanton",
    "type": "outpost",
    "parent": "clio",
    "x": -0.291,
    "y": -28.005,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Clio in Stanton."
  },
  {
    "id": "rayari_deltana_research_outpost",
    "name": "Rayari Deltana Research Outpost",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": -0.019,
    "y": -28.577,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "rayari_kaltag_research_outpost",
    "name": "Rayari Kaltag Research Outpost",
    "system": "stanton",
    "type": "outpost",
    "parent": "calliope",
    "x": 0.254,
    "y": -28.096,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Calliope in Stanton."
  },
  {
    "id": "rayari_mcgrath_research_outpost",
    "name": "Rayari McGrath Research Outpost",
    "system": "stanton",
    "type": "outpost",
    "parent": "clio",
    "x": -0.323,
    "y": -27.969,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Clio in Stanton."
  },
  {
    "id": "reclamation_disposal_orinth",
    "name": "Reclamation & Disposal Orinth",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.826,
    "y": -0.043,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "samson_son_s_salvage_center",
    "name": "Samson & Son's Salvage Center",
    "system": "stanton",
    "type": "outpost",
    "parent": "wala",
    "x": -23.134,
    "y": 0.532,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Wala in Stanton."
  },
  {
    "id": "shubin_mining_facility_sal_2",
    "name": "Shubin Mining Facility SAL-2",
    "system": "stanton",
    "type": "outpost",
    "parent": "lyria",
    "x": -22.57,
    "y": 0.457,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Lyria in Stanton."
  },
  {
    "id": "shubin_mining_facility_sal_5",
    "name": "Shubin Mining Facility SAL-5",
    "system": "stanton",
    "type": "outpost",
    "parent": "lyria",
    "x": -22.6,
    "y": 0.441,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Lyria in Stanton."
  },
  {
    "id": "shubin_mining_facility_scd_1",
    "name": "Shubin Mining Facility SCD-1",
    "system": "stanton",
    "type": "outpost",
    "parent": "daymar",
    "x": -0.334,
    "y": 19.532,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Daymar in Stanton."
  },
  {
    "id": "shubin_mining_facility_sm0_10",
    "name": "Shubin Mining Facility SM0-10",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": -0.049,
    "y": -28.593,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "shubin_mining_facility_sm0_13",
    "name": "Shubin Mining Facility SM0-13",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": -0.057,
    "y": -28.64,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "shubin_mining_facility_sm0_18",
    "name": "Shubin Mining Facility SM0-18",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": -0.006,
    "y": -28.629,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "shubin_mining_facility_sm0_22",
    "name": "Shubin Mining Facility SM0-22",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": 0.026,
    "y": -28.643,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "shubin_mining_facility_smca_6",
    "name": "Shubin Mining Facility SMCa-6",
    "system": "stanton",
    "type": "outpost",
    "parent": "calliope",
    "x": 0.23,
    "y": -28.143,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Calliope in Stanton."
  },
  {
    "id": "shubin_mining_facility_smca_8",
    "name": "Shubin Mining Facility SMCa-8",
    "system": "stanton",
    "type": "outpost",
    "parent": "calliope",
    "x": 0.2,
    "y": -28.159,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Calliope in Stanton."
  },
  {
    "id": "terra_mills_hydrofarm",
    "name": "Terra Mills HydroFarm",
    "system": "stanton",
    "type": "outpost",
    "parent": "cellin",
    "x": 0.2,
    "y": 19.441,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on Cellin in Stanton."
  },
  {
    "id": "the_necropolis",
    "name": "The Necropolis",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": 0.067,
    "y": -28.62,
    "security": "Medium",
    "faction": "Nine Tails",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "the_orphanage",
    "name": "The Orphanage",
    "system": "stanton",
    "type": "outpost",
    "parent": "lyria",
    "x": -22.608,
    "y": 0.394,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Lyria in Stanton."
  },
  {
    "id": "tram_myers_mining",
    "name": "Tram & Myers Mining",
    "system": "stanton",
    "type": "outpost",
    "parent": "cellin",
    "x": 0.192,
    "y": 19.394,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Cellin in Stanton."
  },
  {
    "id": "shady_glen",
    "name": "Shady Glen",
    "system": "stanton",
    "type": "outpost",
    "parent": "wala",
    "x": -23.102,
    "y": 0.518,
    "security": "Medium",
    "faction": "United Empire of Earth",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Wala in Stanton."
  },
  {
    "id": "astor_s_clearing",
    "name": "Astor's Clearing",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": 0.027,
    "y": -28.586,
    "security": "Medium",
    "faction": "Dusters",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "harper_s_point",
    "name": "Harper's Point",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": 0.017,
    "y": -28.553,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "dunboro",
    "name": "Dunboro",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": -0.027,
    "y": -28.535,
    "security": "Medium",
    "faction": "Dusters",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "weeping_cove",
    "name": "Weeping Cove",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.867,
    "y": -0.02,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "maker_s_point",
    "name": "Maker's Point",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.827,
    "y": 0.014,
    "security": "Medium",
    "faction": "Dusters",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "rappel",
    "name": "Rappel",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.817,
    "y": 0.047,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "picker_s_field",
    "name": "Picker's Field",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.773,
    "y": 0.065,
    "security": "Medium",
    "faction": "Dusters",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "nt_999_xxii",
    "name": "NT-999-XXII",
    "system": "stanton",
    "type": "outpost",
    "parent": "yela",
    "x": -0.806,
    "y": 18.964,
    "security": "Medium",
    "faction": "Nine Tails",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on Yela in Stanton."
  },
  {
    "id": "zephyr",
    "name": "Zephyr",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.773,
    "y": 0.012,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "cutter_s_rig",
    "name": "Cutter's Rig",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.753,
    "y": -0.016,
    "security": "Medium",
    "faction": "Dusters",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "finn_s_folly",
    "name": "Finn's Folly",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.767,
    "y": -0.062,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "ludlow",
    "name": "Ludlow",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.808,
    "y": -0.029,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "bloodshot_ridge",
    "name": "Bloodshot Ridge",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": -0.027,
    "y": -28.588,
    "security": "Medium",
    "faction": "Dusters",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "frostbite",
    "name": "Frostbite",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": -0.047,
    "y": -28.616,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "ghost_hollow",
    "name": "Ghost Hollow",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": -0.033,
    "y": -28.662,
    "security": "Medium",
    "faction": "Nine Tails",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "moreland_hills",
    "name": "Moreland Hills",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": 0.008,
    "y": -28.629,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "razor_s_edge",
    "name": "Razor's Edge",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": 0.042,
    "y": -28.627,
    "security": "Medium",
    "faction": "Dusters",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "sakura_sun_magnolia_workcenter",
    "name": "Sakura Sun Magnolia Workcenter",
    "system": "stanton",
    "type": "outpost",
    "parent": "hurston",
    "x": 12.842,
    "y": -0.027,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on Hurston in Stanton."
  },
  {
    "id": "sakura_sun_goldenrod_workcenter",
    "name": "Sakura Sun Goldenrod Workcenter",
    "system": "stanton",
    "type": "outpost",
    "parent": "microtech",
    "x": 0.069,
    "y": -28.587,
    "security": "Medium",
    "faction": "Independent / Corporate",
    "services": [
      "Refuel",
      "Repair"
    ],
    "description": "Surface outpost on MicroTech in Stanton."
  },
  {
    "id": "rustville",
    "name": "Rustville",
    "system": "pyro",
    "type": "outpost",
    "parent": "pyro_i",
    "x": 14.549,
    "y": 4.207,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Shops"
    ],
    "description": "Surface outpost on Pyro I in Pyro."
  },
  {
    "id": "jackson_s_swap",
    "name": "Jackson's Swap",
    "system": "pyro",
    "type": "outpost",
    "parent": "monox",
    "x": -27.882,
    "y": 16.078,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Monox in Pyro."
  },
  {
    "id": "last_ditch",
    "name": "Last Ditch",
    "system": "pyro",
    "type": "outpost",
    "parent": "monox",
    "x": -27.913,
    "y": 16.114,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on Monox in Pyro."
  },
  {
    "id": "sunset_mesa",
    "name": "Sunset Mesa",
    "system": "pyro",
    "type": "outpost",
    "parent": "monox",
    "x": -27.937,
    "y": 16.067,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Shops"
    ],
    "description": "Surface outpost on Monox in Pyro."
  },
  {
    "id": "yang_s_place",
    "name": "Yang's Place",
    "system": "pyro",
    "type": "outpost",
    "parent": "monox",
    "x": -27.968,
    "y": 16.051,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Monox in Pyro."
  },
  {
    "id": "bueno_ravine",
    "name": "Bueno Ravine",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.396,
    "y": -38.68,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "shadowfall",
    "name": "Shadowfall",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.365,
    "y": -38.644,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "shepherd_s_rest",
    "name": "Shepherd's Rest",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.341,
    "y": -38.691,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "the_golden_riviera",
    "name": "The Golden Riviera",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.31,
    "y": -38.707,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "the_yard",
    "name": "The Yard",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.302,
    "y": -38.754,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "stag_s_rut",
    "name": "Stag's Rut",
    "system": "pyro",
    "type": "outpost",
    "parent": "pyro_i",
    "x": 14.517,
    "y": 4.243,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Pyro I in Pyro."
  },
  {
    "id": "arid_reach",
    "name": "Arid Reach",
    "system": "pyro",
    "type": "outpost",
    "parent": "monox",
    "x": -27.976,
    "y": 16.004,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Monox in Pyro."
  },
  {
    "id": "ostler_s_claim",
    "name": "Ostler's Claim",
    "system": "pyro",
    "type": "outpost",
    "parent": "monox",
    "x": -27.925,
    "y": 16.015,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Monox in Pyro."
  },
  {
    "id": "carver_s_ridge",
    "name": "Carver's Ridge",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.353,
    "y": -38.744,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "frigid_knot",
    "name": "Frigid Knot",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.385,
    "y": -38.757,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "narena_s_rest",
    "name": "Narena's Rest",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.427,
    "y": -38.734,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "windfall",
    "name": "Windfall",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.386,
    "y": -38.701,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Refuel",
      "Repair",
      "Shops"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "ashland",
    "name": "Ashland",
    "system": "pyro",
    "type": "outpost",
    "parent": "ignis",
    "x": 61.692,
    "y": 57.077,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Ignis in Pyro."
  },
  {
    "id": "chawla_s_beach",
    "name": "Chawla's Beach",
    "system": "pyro",
    "type": "outpost",
    "parent": "pyro_iv",
    "x": 62.157,
    "y": 57.905,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Shops"
    ],
    "description": "Surface outpost on Pyro IV in Pyro."
  },
  {
    "id": "fallow_field",
    "name": "Fallow Field",
    "system": "pyro",
    "type": "outpost",
    "parent": "pyro_iv",
    "x": 62.125,
    "y": 57.941,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Pyro IV in Pyro."
  },
  {
    "id": "goner_s_deal",
    "name": "Goner's Deal",
    "system": "pyro",
    "type": "outpost",
    "parent": "pyro_iv",
    "x": 62.102,
    "y": 57.894,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Pyro IV in Pyro."
  },
  {
    "id": "sacren_s_plot",
    "name": "Sacren's Plot",
    "system": "pyro",
    "type": "outpost",
    "parent": "pyro_iv",
    "x": 62.071,
    "y": 57.878,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Pyro IV in Pyro."
  },
  {
    "id": "kabir_s_post",
    "name": "Kabir's Post",
    "system": "pyro",
    "type": "outpost",
    "parent": "ignis",
    "x": 61.66,
    "y": 57.113,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Ignis in Pyro."
  },
  {
    "id": "blackrock_exchange",
    "name": "Blackrock Exchange",
    "system": "pyro",
    "type": "outpost",
    "parent": "terminus",
    "x": -84.311,
    "y": 92.558,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Terminus in Pyro."
  },
  {
    "id": "bullock_s_reach",
    "name": "Bullock's Reach",
    "system": "pyro",
    "type": "outpost",
    "parent": "terminus",
    "x": -84.342,
    "y": 92.593,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Terminus in Pyro."
  },
  {
    "id": "canard_view",
    "name": "Canard View",
    "system": "pyro",
    "type": "outpost",
    "parent": "terminus",
    "x": -84.366,
    "y": 92.547,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Terminus in Pyro."
  },
  {
    "id": "kinder_plots",
    "name": "Kinder Plots",
    "system": "pyro",
    "type": "outpost",
    "parent": "terminus",
    "x": -84.397,
    "y": 92.531,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Terminus in Pyro."
  },
  {
    "id": "last_landings",
    "name": "Last Landings",
    "system": "pyro",
    "type": "outpost",
    "parent": "terminus",
    "x": -84.405,
    "y": 92.483,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Repair",
      "Shops"
    ],
    "description": "Surface outpost on Terminus in Pyro."
  },
  {
    "id": "rough_landing",
    "name": "Rough Landing",
    "system": "pyro",
    "type": "outpost",
    "parent": "terminus",
    "x": -84.354,
    "y": 92.494,
    "security": "Lawless",
    "faction": "Headhunters",
    "services": [
      "Cargo / Trade Deck",
      "Shops"
    ],
    "description": "Surface outpost on Terminus in Pyro."
  },
  {
    "id": "scarper_s_turn",
    "name": "Scarper's Turn",
    "system": "pyro",
    "type": "outpost",
    "parent": "terminus",
    "x": -84.322,
    "y": 92.481,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on Terminus in Pyro."
  },
  {
    "id": "stonetree",
    "name": "Stonetree",
    "system": "pyro",
    "type": "outpost",
    "parent": "terminus",
    "x": -84.28,
    "y": 92.504,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Trade Terminal"
    ],
    "description": "Surface outpost on Terminus in Pyro."
  },
  {
    "id": "prophet_s_peak",
    "name": "Prophet's Peak",
    "system": "pyro",
    "type": "outpost",
    "parent": "adir",
    "x": 62.406,
    "y": 58.339,
    "security": "Lawless",
    "faction": "Citizens For Prosperity",
    "services": [
      "Shops"
    ],
    "description": "Surface outpost on Adir in Pyro."
  },
  {
    "id": "seer_s_canyon",
    "name": "Seer's Canyon",
    "system": "pyro",
    "type": "outpost",
    "parent": "vatra",
    "x": 62.721,
    "y": 56.96,
    "security": "Lawless",
    "faction": "Outlaw Settlers",
    "services": [
      "Cargo / Trade Deck",
      "Refuel",
      "Shops"
    ],
    "description": "Surface outpost on Vatra in Pyro."
  },
  {
    "id": "prospect_depot",
    "name": "Prospect Depot",
    "system": "pyro",
    "type": "outpost",
    "parent": "bloom",
    "x": 38.377,
    "y": -38.667,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Bloom in Pyro."
  },
  {
    "id": "dinger_s_depot",
    "name": "Dinger's Depot",
    "system": "pyro",
    "type": "outpost",
    "parent": "pyro_iv",
    "x": 62.063,
    "y": 57.831,
    "security": "Lawless",
    "faction": "Outlaw Settlers",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Pyro IV in Pyro."
  },
  {
    "id": "slowburn_depot",
    "name": "Slowburn Depot",
    "system": "pyro",
    "type": "outpost",
    "parent": "monox",
    "x": -27.893,
    "y": 16.001,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Monox in Pyro."
  },
  {
    "id": "feo_canyon_depot",
    "name": "Feo Canyon Depot",
    "system": "pyro",
    "type": "outpost",
    "parent": "fairo",
    "x": 61.829,
    "y": 58.466,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Fairo in Pyro."
  },
  {
    "id": "gray_gardens_depot",
    "name": "Gray Gardens Depot",
    "system": "pyro",
    "type": "outpost",
    "parent": "pyro_i",
    "x": 14.493,
    "y": 4.196,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Pyro I in Pyro."
  },
  {
    "id": "watcher_s_depot",
    "name": "Watcher's Depot",
    "system": "pyro",
    "type": "outpost",
    "parent": "terminus",
    "x": -84.32,
    "y": 92.537,
    "security": "Lawless",
    "faction": "XenoThreat",
    "services": [
      "Cargo / Trade Deck"
    ],
    "description": "Surface outpost on Terminus in Pyro."
  }
]
};

// Map lookup helpers
SC_DATA.locationMap = {};
SC_DATA.locations.forEach(loc => {
  SC_DATA.locationMap[loc.id] = loc;
});

// Expose on window for browser scripts
if (typeof window !== "undefined") {
  window.SC_DATA = SC_DATA;
}
