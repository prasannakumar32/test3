// Script to update local storage with January default values

const productionData = {
  TIRUNELVELI: {
    siteInfo: {
      id: 'TIRUNELVELI',
      name: 'M/S STRIO KAIZEN HITECH RESEARCH LABS PVT.LTD.',
      location: 'Tirunelveli',
      type: 'IS-CAPTIVE',
      serviceNumber: '079204721131',
      isRec: 'Non-Rec',
      machineCapacity: 600,
      netGeneration: 101732,
    },
    monthlyData: {
      '2025-01': {
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
        },
        timestamp: new Date().toISOString()
      }
    }
  },
  PUDUKOTTAI: {
    siteInfo: {
      id: 'PUDUKOTTAI',
      name: 'M/s.STRIO KAIZEN HITECH RESEARCH LABS (P) LTD',
      location: 'Pudukottai',
      type: 'IS-CAPTIVE',
      serviceNumber: '069534460069',
      isRec: 'Non-Rec',
      machineCapacity: 1000,
      netGeneration: 166075,
    },
    monthlyData: {
      '2025-01': {
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
        },
        timestamp: new Date().toISOString()
      }
    }
  }
};

const consumptionData = {
  CS1: {
    siteInfo: {
      id: 'CS1',
      name: 'POLYSPIN EXPORTS LTD.,EXPANSION UNIT.',
      location: 'VIRUDUNAGAR',
      type: 'Consumer',
      serviceNumber: '079094620335',
      allocated: 35820,
    },
    monthlyData: {
      '2025-01': {
        C1: 12127,
        C2: 17033,
        C3: 0,
        C4: 47727,
        C5: 24845,
        total: 101732,
        timestamp: new Date().toISOString()
      }
    }
  },
  CS2: {
    siteInfo: {
      id: 'CS2',
      name: 'PEL TEXTILES',
      location: 'VIRUDUNAGAR',
      type: 'Consumer',
      serviceNumber: '079094620348',
      allocated: 8039,
    },
    monthlyData: {
      '2025-01': {
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 8039,
        C5: 0,
        total: 8039,
        timestamp: new Date().toISOString()
      }
    }
  },
  CS3: {
    siteInfo: {
      id: 'CS3',
      name: 'M/S. A RAMAR AND SONS',
      location: 'MADURAI METRO',
      type: 'Consumer',
      serviceNumber: '059094630184',
      allocated: 122216,
    },
    monthlyData: {
      '2025-01': {
        C1: 39119,
        C2: 0,
        C3: 0,
        C4: 83097,
        C5: 0,
        total: 122216,
        timestamp: new Date().toISOString()
      }
    }
  }
};

// Update local storage with the new data
localStorage.setItem('productionSiteData', JSON.stringify(productionData));
localStorage.setItem('consumptionSiteData', JSON.stringify(consumptionData));

console.log('Local storage updated with January default values');
