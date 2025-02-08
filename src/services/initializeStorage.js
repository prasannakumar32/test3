// Function to initialize storage with default January values
export const initializeStorage = () => {
  // Clear existing data first
  localStorage.removeItem('productionSiteData');
  localStorage.removeItem('consumptionSiteData');

  const productionData = {
    TIRUNELVELI: {
      siteInfo: {
        id: 'TIRUNELVELI',
        name: 'M/S STRIO KAIZEN HITECH RESEARCH LABS PVT.LTD.',
        location: 'Tirunelveli',
        type: 'IS-CAPTIVE',
        category: 'Wind'
      },
      defaultValues: {
        C1: 12127,
        C2: 17033,
        C3: 0,
        C4: 47727,
        C5: 24845,
        total: 101732
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
          }
        },
        '2025-02': {
          fromPowerplant: {
            C1: 13000,
            C2: 18000,
            C3: 0,
            C4: 48000,
            C5: 25000,
            total: 104000
          },
          fromBanking: {
            C1: 0,
            C2: 0,
            C3: 0,
            C4: 0,
            C5: 1,
            total: 1
          }
        },
        '2025-03': {
          fromPowerplant: {
            C1: 12500,
            C2: 17500,
            C3: 0,
            C4: 47800,
            C5: 24900,
            total: 102700
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
      }
    },
    PUDUKOTTAI: {
      siteInfo: {
        id: 'PUDUKOTTAI',
        name: 'M/s.STRIO KAIZEN HITECH RESEARCH LABS (P) LTD',
        location: 'Pudukottai',
        type: 'IS-CAPTIVE',
        category: 'Solar'
      },
      defaultValues: {
        C1: 44373,
        C2: 0,
        C3: 0,
        C4: 121702,
        C5: 0,
        total: 166075
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
          }
        },
        '2025-02': {
          fromPowerplant: {
            C1: 45000,
            C2: 0,
            C3: 0,
            C4: 122000,
            C5: 0,
            total: 167000
          }
        },
        '2025-03': {
          fromPowerplant: {
            C1: 44500,
            C2: 0,
            C3: 0,
            C4: 121800,
            C5: 0,
            total: 166300
          }
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
        allocated: 35820
      },
      defaultValues: {
        C1: 12127,
        C2: 17033,
        C3: 0,
        C4: 47727,
        C5: 24845,
        total: 101732
      },
      monthlyData: {
        '2025-01': {
          C1: 12127,
          C2: 17033,
          C3: 0,
          C4: 47727,
          C5: 24845,
          total: 101732
        },
        '2025-02': {
          C1: 12200,
          C2: 17100,
          C3: 0,
          C4: 47800,
          C5: 24900,
          total: 102000
        },
        '2025-03': {
          C1: 12150,
          C2: 17050,
          C3: 0,
          C4: 47750,
          C5: 24850,
          total: 101800
        }
      }
    },
    CS2: {
      siteInfo: {
        id: 'CS2',
        name: 'PEL TEXTILES',
        location: 'VIRUDUNAGAR',
        type: 'Consumer',
        allocated: 8039
      },
      defaultValues: {
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 8039,
        C5: 0,
        total: 8039
      },
      monthlyData: {
        '2025-01': {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 8039,
          C5: 0,
          total: 8039
        },
        '2025-02': {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 8100,
          C5: 0,
          total: 8100
        },
        '2025-03': {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 8050,
          C5: 0,
          total: 8050
        }
      }
    },
    CS3: {
      siteInfo: {
        id: 'CS3',
        name: 'M/S. A RAMAR AND SONS',
        location: 'MADURAI METRO',
        type: 'Consumer',
        allocated: 122216
      },
      defaultValues: {
        C1: 39119,
        C2: 0,
        C3: 0,
        C4: 83097,
        C5: 0,
        total: 122216
      },
      monthlyData: {
        '2025-01': {
          C1: 39119,
          C2: 0,
          C3: 0,
          C4: 83097,
          C5: 0,
          total: 122216
        },
        '2025-02': {
          C1: 39200,
          C2: 0,
          C3: 0,
          C4: 83200,
          C5: 0,
          total: 122400
        },
        '2025-03': {
          C1: 39150,
          C2: 0,
          C3: 0,
          C4: 83150,
          C5: 0,
          total: 122300
        }
      }
    }
  };

  console.log('Setting production data:', productionData);
  console.log('Setting consumption data:', consumptionData);

  // Force set the new data
  localStorage.setItem('productionSiteData', JSON.stringify(productionData));
  localStorage.setItem('consumptionSiteData', JSON.stringify(consumptionData));

  // Verify the data was set
  const savedProd = localStorage.getItem('productionSiteData');
  const savedCons = localStorage.getItem('consumptionSiteData');
  
  console.log('Saved production data:', JSON.parse(savedProd));
  console.log('Saved consumption data:', JSON.parse(savedCons));
};
