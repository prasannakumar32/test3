// Production Service with localStorage implementation
const productionService = {
  // Get all historical production data
  getAllHistoricalData: async () => {
    try {
      const historicalData = JSON.parse(localStorage.getItem('historicalProductionData') || '[]');
      console.log('Retrieved historical data:', historicalData);
      return historicalData;
    } catch (error) {
      console.error('Error getting historical data:', error);
      return [];
    }
  },

  // Get latest production data for each site
  getLatestProductionData: async () => {
    try {
      const historicalData = JSON.parse(localStorage.getItem('historicalProductionData') || '[]');
      console.log('Getting latest from historical data:', historicalData);
      
      if (!Array.isArray(historicalData)) {
        console.warn('Historical data is not an array, resetting');
        return [];
      }

      // Group entries by siteId and get the latest entry for each site
      const latestEntries = {};
      historicalData.forEach(entry => {
        const currentTimestamp = entry.timestamp ? new Date(entry.timestamp) : new Date();
        const existingTimestamp = latestEntries[entry.siteId] 
          ? new Date(latestEntries[entry.siteId].timestamp)
          : new Date(0);

        if (!latestEntries[entry.siteId] || currentTimestamp > existingTimestamp) {
          latestEntries[entry.siteId] = {
            ...entry,
            timestamp: currentTimestamp.toISOString()
          };
        }
      });

      const result = Object.values(latestEntries);
      console.log('Latest entries:', result);
      return result;
    } catch (error) {
      console.error('Error getting latest production data:', error);
      return [];
    }
  },

  // Subscribe to updates using localStorage events
  subscribeToUpdates: (callback) => {
    const handleStorageChange = (event) => {
      if (event.key === 'historicalProductionData' && event.newValue) {
        try {
          const newData = JSON.parse(event.newValue);
          if (Array.isArray(newData) && newData.length > 0) {
            // Get the latest entries for each site
            const latestEntries = {};
            newData.forEach(entry => {
              const currentTimestamp = entry.timestamp ? new Date(entry.timestamp) : new Date();
              const existingTimestamp = latestEntries[entry.siteId] 
                ? new Date(latestEntries[entry.siteId].timestamp)
                : new Date(0);

              if (!latestEntries[entry.siteId] || currentTimestamp > existingTimestamp) {
                latestEntries[entry.siteId] = entry;
              }
            });

            // Notify for each updated site
            Object.values(latestEntries).forEach(entry => {
              console.log('Notifying update for site:', entry);
              callback(entry);
            });
          }
        } catch (error) {
          console.error('Error processing storage update:', error);
        }
      }
    };

    // Listen for custom event for same-window updates
    const handleCustomEvent = (event) => {
      if (event.detail) {
        console.log('Custom event update:', event.detail);
        callback(event.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productionDataUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productionDataUpdated', handleCustomEvent);
    };
  },

  // Helper function to update production data
  updateProductionData: (newEntry) => {
    try {
      console.log('Updating with new entry:', newEntry);
      
      // Validate the entry
      if (!newEntry.siteId) {
        console.error('Missing siteId in entry');
        return false;
      }

      // Get existing data
      let historicalData = JSON.parse(localStorage.getItem('historicalProductionData') || '[]');
      if (!Array.isArray(historicalData)) {
        historicalData = [];
      }

      // Ensure numbers are properly parsed
      const processedEntry = {
        ...newEntry,
        c1: Number(newEntry.c1 || 0),
        c2: Number(newEntry.c2 || 0),
        c3: Number(newEntry.c3 || 0),
        c4: Number(newEntry.c4 || 0),
        c5: Number(newEntry.c5 || 0),
        timestamp: newEntry.timestamp || new Date().toISOString()
      };

      // Add the new entry
      historicalData.push(processedEntry);

      // Save back to localStorage
      localStorage.setItem('historicalProductionData', JSON.stringify(historicalData));
      console.log('Saved updated historical data:', historicalData);

      // Dispatch custom event for same-window updates
      const event = new CustomEvent('productionDataUpdated', { 
        detail: processedEntry 
      });
      window.dispatchEvent(event);

      return true;
    } catch (error) {
      console.error('Error updating production data:', error);
      return false;
    }
  },

  // Initialize three months of historical data using allocation data
  initializeHistoricalData: () => {
    const currentDate = new Date('2025-01-06T04:00:00Z');
    const months = [];

    // Generate 3 months of data points
    for (let i = 0; i < 3; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      const month = date.toISOString().slice(0, 7);
      months.push({
        month: month,
        date: date.toISOString()
      });
    }
    
    const historicalData = [];
    
    // Current month values for all sites
    const siteValues = {
      'PS1': {
        c1: 44373,
        c2: 0,
        c3: 0,
        c4: 121702,
        c5: 0,
        import: 3000,
        export: 8000,
        total_generation: 166075,
        type: 'production'
      },
      'PS2': {
        c1: 12127,
        c2: 17033,
        c3: 0,
        c4: 47727,
        c5: 24845,
        import: 2000,
        export: 5000,
        total_generation: 101732,
        type: 'production'
      },
      'CS1': {
        c1: 5254,
        c2: 0,
        c3: 0,
        c4: 30566,
        c5: 0,
        total_consumption: 35820,
        type: 'consumption'
      },
      'CS2': {
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 8039,
        c5: 0,
        total_consumption: 8039,
        type: 'consumption'
      },
      'CS3': {
        c1: 39119,
        c2: 0,
        c3: 0,
        c4: 83097,
        c5: 0,
        total_consumption: 122216,
        type: 'consumption'
      }
    };

    Object.entries(siteValues).forEach(([siteId, currentMonthValues]) => {
      months.forEach(({ month, date }, index) => {
        // Add random variation for previous months (±10%)
        const addVariation = (value) => {
          if (value === 0) return 0;
          const variation = (Math.random() - 0.5) * 0.2; // ±10%
          return Math.round(value * (1 + variation));
        };

        let values;
        if (index === 0) {
          // Use current month values as is
          values = { ...currentMonthValues };
        } else {
          // Generate variations for previous months
          values = {
            c1: addVariation(currentMonthValues.c1),
            c2: addVariation(currentMonthValues.c2),
            c3: addVariation(currentMonthValues.c3),
            c4: addVariation(currentMonthValues.c4),
            c5: addVariation(currentMonthValues.c5)
          };

          if (currentMonthValues.type === 'production') {
            values.import = addVariation(currentMonthValues.import);
            values.export = addVariation(currentMonthValues.export);
            values.total_generation = values.c1 + values.c2 + values.c3 + values.c4 + values.c5;
          } else {
            values.total_consumption = values.c1 + values.c2 + values.c3 + values.c4 + values.c5;
          }
        }

        const entry = {
          site_id: siteId,
          site_name: getSiteName(siteId),
          timestamp: date,
          month_year: month,
          c1: values.c1,
          c2: values.c2,
          c3: values.c3,
          c4: values.c4,
          c5: values.c5,
          type: currentMonthValues.type
        };

        if (currentMonthValues.type === 'production') {
          entry.import = values.import;
          entry.export = values.export;
          entry.total_generation = values.total_generation;
        } else {
          entry.total_consumption = values.total_consumption;
        }

        historicalData.push(entry);
      });
    });

    // Helper function to get site names
    function getSiteName(siteId) {
      const siteNames = {
        'PS1': 'Pudukottai Solar',
        'PS2': 'Tirunelveli Wind',
        'CS1': 'POLYSPIN EXPORTS LTD.,EXPANSION UNIT.',
        'CS2': 'PEL TEXTILES',
        'CS3': 'M/S. A RAMAR AND SONS'
      };
      return siteNames[siteId] || siteId;
    }

    // Clear existing data
    localStorage.removeItem('historicalProductionData');
    
    // Store in localStorage
    localStorage.setItem('historicalProductionData', JSON.stringify(historicalData));
    console.log('Initialized historical data:', historicalData);
    return historicalData;
  },

  // Test function to add sample data
  addTestData: () => {
    const testData = [
      {
        siteId: 'PS1',
        c1: 3902,
        c2: 0,
        c3: 0,
        c4: 0,
        c5: 0,
        timestamp: new Date().toISOString()
      },
      {
        siteId: 'PS2',
        c1: 1500,
        c2: 2000,
        c3: 1800,
        c4: 1600,
        c5: 1700,
        timestamp: new Date().toISOString()
      }
    ];

    testData.forEach(entry => {
      productionService.updateProductionData(entry);
    });
  },

  // Clear all production data (for testing)
  clearProductionData: () => {
    localStorage.removeItem('historicalProductionData');
    console.log('Cleared all production data');
  }
};

export default productionService;
