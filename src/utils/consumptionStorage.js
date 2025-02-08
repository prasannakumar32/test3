// Consumption Storage Utils
const CONSUMPTION_HISTORY_KEY = 'consumptionHistory';
const CONSUMPTION_SITES_KEY = 'consumptionSites';

// Consumption sites data
let CONSUMPTION_SITES = [
  {
    id: 'CS1',
    name: 'POLYSPIN EXPORTS LTD.,EXPANSION UNIT.',
    location: 'VIRUDUNAGAR',
    type: 'Consumer',
    serviceNumber: '079094620335',
    status: 'Active',
    consumption_ratio: 0.25,
    historicalData: [
      { 
        id: '1',
        month: 'Current',
        c1: 5254,
        c2: 0,
        c3: 0,
        c4: 30566,
        c5: 0
      }
    ]
  },
  {
    id: 'CS2',
    name: 'PEL TEXTILES',
    location: 'VIRUDUNAGAR',
    type: 'Consumer',
    serviceNumber: '079094620348',
    status: 'Active',
    consumption_ratio: 0.25,
    historicalData: [
      { 
        id: '1',
        month: 'Current',
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 8039,
        c5: 0
      }
    ]
  },
  {
    id: 'CS3',
    name: 'M/S. A RAMAR AND SONS',
    location: 'MADURAI METRO',
    type: 'Consumer',
    serviceNumber: '059094630184',
    status: 'Active',
    consumption_ratio: 0.50,
    historicalData: [
      { 
        id: '1',
        month: 'Current',
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 0,
        c5: 0
      }
    ]
  }
];

// Get all consumption sites
export const getConsumptionSites = async () => {
  try {
    // First try to fetch from API
    const response = await fetch('/api/consumption-sites');
    if (response.ok) {
      const data = await response.json();
      // Cache the data in localStorage
      localStorage.setItem(CONSUMPTION_SITES_KEY, JSON.stringify(data));
      return data;
    }
    
    // If API fails, try to get from localStorage
    const cachedData = localStorage.getItem(CONSUMPTION_SITES_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // If no cached data, return default CONSUMPTION_SITES
    return CONSUMPTION_SITES;
  } catch (error) {
    console.error('Error fetching consumption sites:', error);
    // Fallback to default data if everything fails
    return CONSUMPTION_SITES;
  }
};

// Get consumption site by id
export const getConsumptionSiteById = (id) => {
  const site = CONSUMPTION_SITES.find(site => site.id === id);
  return Promise.resolve(site);
};

// Get consumption history for a site
export const getConsumptionHistory = (siteId) => {
  const site = CONSUMPTION_SITES.find(site => site.id === siteId);
  return Promise.resolve(site ? site.historicalData : []);
};

// Calculate allocated units based on ratio
export const calculateAllocation = (totalUnits) => {
  return CONSUMPTION_SITES.map(site => ({
    id: site.id,
    name: site.name,
    allocatedUnits: totalUnits * site.consumption_ratio,
    ratio: site.consumption_ratio === 0.5 ? '2' : '1'
  }));
};

// Add consumption history entry
export const addConsumptionHistory = (entry) => {
  try {
    const history = getConsumptionHistory(entry.siteId);
    const newEntry = {
      ...entry,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    history.push(newEntry);
    const site = CONSUMPTION_SITES.find(site => site.id === entry.siteId);
    site.historicalData = history;
    return true;
  } catch (error) {
    console.error('Error adding consumption history:', error);
    return false;
  }
};

// Update consumption history entry
export const updateConsumptionHistory = (siteId, id, updatedEntry) => {
  try {
    const history = getConsumptionHistory(siteId);
    const index = history.findIndex(entry => entry.id === id);
    if (index !== -1) {
      history[index] = {
        ...history[index],
        ...updatedEntry,
        timestamp: new Date().toISOString()
      };
      const site = CONSUMPTION_SITES.find(site => site.id === siteId);
      site.historicalData = history;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating consumption history:', error);
    return false;
  }
};

// Delete consumption history entry
export const deleteConsumptionHistory = (siteId, id) => {
  try {
    const history = getConsumptionHistory(siteId);
    const filteredHistory = history.filter(entry => entry.id !== id);
    const site = CONSUMPTION_SITES.find(site => site.id === siteId);
    site.historicalData = filteredHistory;
    return true;
  } catch (error) {
    console.error('Error deleting consumption history:', error);
    return false;
  }
};

// Add new historical data
export const addHistoricalData = (siteId, data) => {
  const site = CONSUMPTION_SITES.find(site => site.id === siteId);
  if (site) {
    const newData = {
      id: Date.now().toString(),
      ...data
    };
    site.historicalData.unshift(newData);
    return Promise.resolve(newData);
  }
  return Promise.reject(new Error('Site not found'));
};

// Update historical data
export const updateHistoricalData = (siteId, dataId, updatedData) => {
  const site = CONSUMPTION_SITES.find(site => site.id === siteId);
  if (site) {
    const dataIndex = site.historicalData.findIndex(data => data.id === dataId);
    if (dataIndex !== -1) {
      site.historicalData[dataIndex] = {
        ...site.historicalData[dataIndex],
        ...updatedData
      };
      return Promise.resolve(site.historicalData[dataIndex]);
    }
  }
  return Promise.reject(new Error('Data not found'));
};

// Delete historical data
export const deleteHistoricalData = (siteId, dataId) => {
  const site = CONSUMPTION_SITES.find(site => site.id === siteId);
  if (site) {
    const initialLength = site.historicalData.length;
    site.historicalData = site.historicalData.filter(data => data.id !== dataId);
    if (site.historicalData.length < initialLength) {
      return Promise.resolve(true);
    }
  }
  return Promise.reject(new Error('Data not found'));
};

// Calculate total consumption
export const calculateTotalConsumption = (data) => {
  return Object.values(data).reduce((total, value) => {
    if (typeof value === 'number') {
      return total + value;
    }
    return total;
  }, 0);
};
