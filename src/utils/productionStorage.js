// Production Storage Utils

const PRODUCTION_HISTORY_KEY = 'productionHistory';
const PRODUCTION_SITES_KEY = 'productionSites';

// Clear existing data to ensure consistent IDs
localStorage.removeItem(PRODUCTION_SITES_KEY);
localStorage.removeItem(PRODUCTION_HISTORY_KEY);

// Production sites data
let PRODUCTION_SITES = [
  {
    id: 'TW1',
    name: 'Tirunelveli Wind Farm',
    location: 'Tirunelveli, Tamil Nadu',
    type: 'WIND',
    grid: 'TANGEDCO',
    status: 'Active',
    capacity: '1000 kW',
    serviceNumber: '069534460069',
    historicalData: []
  },
  {
    id: 'PS1',
    name: 'Pudukottai Solar Park',
    location: 'Pudukottai, Tamil Nadu',
    type: 'SOLAR',
    grid: 'TANGEDCO',
    status: 'Active',
    capacity: '600 kW',
    serviceNumber: 'TNL-001',
    historicalData: []
  }
];

// Get production sites
export const getProductionSites = () => {
  return Promise.resolve(PRODUCTION_SITES);
};

export const getProductionSiteById = (id) => {
  const site = PRODUCTION_SITES.find(site => site.id === id);
  return Promise.resolve(site);
};

// Get production history
export const getProductionHistory = () => {
  try {
    const history = localStorage.getItem(PRODUCTION_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting production history:', error);
    return [];
  }
};

// Add production history entry
export const addProductionHistory = (entry) => {
  try {
    const history = getProductionHistory();
    const newEntry = {
      ...entry,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    history.push(newEntry);
    localStorage.setItem(PRODUCTION_HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error adding production history:', error);
    return false;
  }
};

// Update production history entry
export const updateProductionHistory = (id, updatedEntry) => {
  try {
    const history = getProductionHistory();
    const index = history.findIndex(entry => entry.id === id);
    if (index !== -1) {
      history[index] = {
        ...history[index],
        ...updatedEntry,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(PRODUCTION_HISTORY_KEY, JSON.stringify(history));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating production history:', error);
    return false;
  }
};

// Delete production history entry
export const deleteProductionHistory = (id) => {
  try {
    const history = getProductionHistory();
    const filteredHistory = history.filter(entry => entry.id !== id);
    localStorage.setItem(PRODUCTION_HISTORY_KEY, JSON.stringify(filteredHistory));
    return true;
  } catch (error) {
    console.error('Error deleting production history:', error);
    return false;
  }
};

// Get production history for a site
export const getProductionHistoryForSite = (siteId) => {
  const site = PRODUCTION_SITES.find(site => site.id === siteId);
  return Promise.resolve(site ? site.historicalData : []);
};

// Add new historical data
export const addHistoricalData = (siteId, data) => {
  const site = PRODUCTION_SITES.find(site => site.id === siteId);
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
  const site = PRODUCTION_SITES.find(site => site.id === siteId);
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
  const site = PRODUCTION_SITES.find(site => site.id === siteId);
  if (site) {
    const initialLength = site.historicalData.length;
    site.historicalData = site.historicalData.filter(data => data.id !== dataId);
    if (site.historicalData.length < initialLength) {
      return Promise.resolve(true);
    }
  }
  return Promise.reject(new Error('Data not found'));
};

// Add new production site
export const addProductionSite = async (newSite) => {
  try {
    // Get current sites
    const currentSites = PRODUCTION_SITES;
    
    // Add new site
    PRODUCTION_SITES = [...currentSites, newSite];
    
    // Update localStorage
    localStorage.setItem(PRODUCTION_SITES_KEY, JSON.stringify(PRODUCTION_SITES));
    
    return newSite;
  } catch (error) {
    console.error('Error adding production site:', error);
    throw error;
  }
};
