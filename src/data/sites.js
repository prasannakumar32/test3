export const PRODUCTION_SITES = [
  {
    id: 'TIRUNELVELI',
    name: 'Tirunelveli Wind',
    fullName: 'M/S STRIO KAIZEN HITECH RESEARCH LABS PVT.LTD.',
    location: 'Tirunelveli',
    type: 'IS-CAPTIVE',
    category: 'IS-CAPTIVE',
    historicalData: {
      '2025-01': {
        fromPowerplant: {
          C1: 11500,
          C2: 15500,
          C3: 0,
          C4: 46000,
          C5: 23000,
          total: 96000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      },
      '2024-12': {
        fromPowerplant: {
          C1: 11000,
          C2: 15000,
          C3: 0,
          C4: 45000,
          C5: 22000,
          total: 93000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      },
      '2024-11': {
        fromPowerplant: {
          C1: 10500,
          C2: 16000,
          C3: 0,
          C4: 43000,
          C5: 23000,
          total: 92500
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      }
    },
    unitValues: {
      fromPowerplant: {
        C1: 12127,
        C2: 17033,
        C3: 0,
        C4: 47727,
        C5: 24845,
        total: 101732
      },
      fromBanking: {
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 0,
        C5: 1,
        total: 1
      }
    }
  },
  {
    id: 'PUDUKOTTAI',
    name: 'Pudukottai Solar',
    fullName: 'M/s.STRIO KAIZEN HITECH RESEARCH LABS (P) LTD',
    location: 'Pudukottai',
    type: 'IS-CAPTIVE',
    category: 'IS-CAPTIVE',
    historicalData: {
      '2025-01': {
        fromPowerplant: {
          C1: 43000,
          C2: 0,
          C3: 0,
          C4: 120000,
          C5: 0,
          total: 163000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      },
      '2024-12': {
        fromPowerplant: {
          C1: 42000,
          C2: 0,
          C3: 0,
          C4: 118000,
          C5: 0,
          total: 160000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      },
      '2024-11': {
        fromPowerplant: {
          C1: 41000,
          C2: 0,
          C3: 0,
          C4: 115000,
          C5: 0,
          total: 156000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      }
    },
    unitValues: {
      fromPowerplant: {
        C1: 44373,
        C2: 0,
        C3: 0,
        C4: 121702,
        C5: 0,
        total: 166075
      },
      fromBanking: {
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 0,
        C5: 0,
        total: 0
      }
    }
  }
];

export const CONSUMPTION_SITES = [
  {
    id: 'ramar-2',
    name: 'Ramar 2',
    location: 'VIRUDUNAGAR',
    type: 'Consumer',
    consumption_ratio: 0.35,
    historicalData: {
      '2024-12': {
        C1: 5000,
        C2: 0,
        C3: 0,
        C4: 29000,
        C5: 0,
        total: 34000
      },
      '2024-11': {
        C1: 4800,
        C2: 0,
        C3: 0,
        C4: 28000,
        C5: 0,
        total: 32800
      }
    }
  },
  {
    id: 'pel-1',
    name: 'PEL 1',
    location: 'VIRUDUNAGAR',
    type: 'Consumer',
    consumption_ratio: 0.30,
    historicalData: {
      '2024-12': {
        C1: 4500,
        C2: 0,
        C3: 0,
        C4: 25000,
        C5: 0,
        total: 29500
      },
      '2024-11': {
        C1: 4300,
        C2: 0,
        C3: 0,
        C4: 24000,
        C5: 0,
        total: 28300
      }
    }
  },
  {
    id: 'polyspin-1',
    name: 'Polyspin 1',
    location: 'VIRUDUNAGAR',
    type: 'Consumer',
    consumption_ratio: 0.35,
    historicalData: {
      '2024-12': {
        C1: 5500,
        C2: 0,
        C3: 0,
        C4: 31000,
        C5: 0,
        total: 36500
      },
      '2024-11': {
        C1: 5200,
        C2: 0,
        C3: 0,
        C4: 30000,
        C5: 0,
        total: 35200
      }
    }
  }
];
