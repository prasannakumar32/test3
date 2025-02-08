// Constants for localStorage keys
const SITE_DATA_KEY = 'siteData';
const SUBSCRIBERS_KEY = 'dataSubscribers';

// Initialize subscribers array
let subscribers = [];

// Helper function to get current timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// Helper function to get data from localStorage
const getStoredData = () => {
  const storedData = localStorage.getItem(SITE_DATA_KEY);
  return storedData ? JSON.parse(storedData) : {};
};

// Helper function to save data to localStorage
const saveData = (data) => {
  localStorage.setItem(SITE_DATA_KEY, JSON.stringify(data));
  notifySubscribers();
};

// Notify all subscribers of data changes
const notifySubscribers = () => {
  subscribers.forEach(callback => callback());
};

// Get all site data
export const getAllSitesLatestData = () => {
  return getStoredData();
};

// Get specific site data
export const getSiteData = (siteId) => {
  const allData = getStoredData();
  return allData[siteId] || null;
};

// Update production site data
export const updateProductionSiteData = (siteId, month, data) => {
  const allData = getStoredData();
  const currentSiteData = allData[siteId] || {};
  
  const monthlyData = currentSiteData[month] || {
    unitValues: {
      C1: 0,
      C2: 0,
      C3: 0,
      C4: 0,
      C5: 0
    },
    timestamp: getCurrentTimestamp()
  };

  monthlyData.unitValues = {
    ...monthlyData.unitValues,
    ...data.unitValues
  };

  monthlyData.timestamp = getCurrentTimestamp();

  allData[siteId] = {
    ...currentSiteData,
    [month]: monthlyData
  };

  saveData(allData);
  return monthlyData;
};

// Update consumption site data
export const updateConsumptionSiteData = (siteId, month, data) => {
  const allData = getStoredData();
  const currentSiteData = allData[siteId] || {};
  
  const monthlyData = currentSiteData[month] || {
    unitValues: {
      C1: 0,
      C2: 0,
      C3: 0,
      C4: 0,
      C5: 0
    },
    timestamp: getCurrentTimestamp()
  };

  monthlyData.unitValues = {
    ...monthlyData.unitValues,
    ...data.unitValues
  };

  monthlyData.timestamp = getCurrentTimestamp();

  allData[siteId] = {
    ...currentSiteData,
    [month]: monthlyData
  };

  saveData(allData);
  return monthlyData;
};

// Save site data and notify subscribers (for backward compatibility)
export const saveSiteDataAndNotify = (siteId, data) => {
  const { month, unitValues } = data;
  if (data.type === 'production') {
    return updateProductionSiteData(siteId, month, { unitValues });
  } else {
    return updateConsumptionSiteData(siteId, month, { unitValues });
  }
};

// Delete site data and notify subscribers
export const deleteSiteDataAndNotify = (siteId, month) => {
  const allData = getStoredData();
  const currentSiteData = allData[siteId] || {};
  
  if (currentSiteData[month]) {
    delete currentSiteData[month];
    allData[siteId] = currentSiteData;
    saveData(allData);
    return true;
  }
  return false;
};

// Get monthly data for a site
export const getSiteMonthlyData = (siteId, month) => {
  const siteData = getSiteData(siteId);
  return siteData ? siteData[month] || null : null;
};

// Get all monthly data for a site
export const getAllMonthlyData = (siteId) => {
  const siteData = getSiteData(siteId);
  return siteData || {};
};

// Subscribe to data changes
export const subscribeToDataChanges = (callback) => {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(cb => cb !== callback);
  };
};

// Clear all data for a site
export const clearSiteData = (siteId) => {
  const allData = getStoredData();
  delete allData[siteId];
  saveData(allData);
};

// Clear all site data
export const clearAllData = () => {
  localStorage.removeItem(SITE_DATA_KEY);
  notifySubscribers();
};

// Get latest unit values for a site
export const getLatestUnitValues = (siteId) => {
  const siteData = getSiteData(siteId);
  if (!siteData) return null;

  const months = Object.keys(siteData);
  if (months.length === 0) return null;

  const latestMonth = months.reduce((latest, month) => {
    if (!latest) return month;
    return siteData[month].timestamp > siteData[latest].timestamp ? month : latest;
  });

  return siteData[latestMonth].unitValues;
};

// Batch update multiple sites
export const batchUpdateSites = (updates) => {
  const allData = getStoredData();
  
  updates.forEach(({ siteId, month, data }) => {
    const currentSiteData = allData[siteId] || {};
    const monthlyData = currentSiteData[month] || {
      unitValues: {
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 0,
        C5: 0
      },
      timestamp: getCurrentTimestamp()
    };

    monthlyData.unitValues = {
      ...monthlyData.unitValues,
      ...data.unitValues
    };
    monthlyData.timestamp = getCurrentTimestamp();

    allData[siteId] = {
      ...currentSiteData,
      [month]: monthlyData
    };
  });

  saveData(allData);
  return allData;
};
