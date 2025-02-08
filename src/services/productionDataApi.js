// Production Site Data Management API
import { PRODUCTION_SITES } from '../data/sites';

const STORAGE_KEY = 'productionSiteData';

// Helper function to format date
const formatMonthYear = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// Initialize storage with empty data for each site
const initializeStorage = () => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    const initialData = PRODUCTION_SITES.reduce((acc, site) => {
      acc[site.id] = {
        siteInfo: { ...site },
        monthlyData: {},
        totalGeneration: 0,
        lastUpdated: null
      };
      return acc;
    }, {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(existingData);
};

// Get all production data
export const getAllProductionData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initializeStorage();
};

// Get production data for a specific site with historical data
export const getSiteProductionData = (siteId) => {
  const allData = getAllProductionData();
  const siteData = allData[siteId];
  
  if (!siteData) return null;

  // Format historical data for display
  const historicalData = Object.entries(siteData.monthlyData)
    .map(([monthYear, data]) => ({
      monthYear,
      ...data,
      total: parseFloat(data.generation || 0)
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    ...siteData,
    historicalData
  };
};

// Add new production data entry
export const addProductionDataEntry = (siteId, formData) => {
  const allData = getAllProductionData();
  const monthYear = formatMonthYear(new Date());
  const timestamp = new Date().toISOString();

  if (!allData[siteId]) {
    throw new Error('Site not found');
  }

  // Update monthly data
  allData[siteId].monthlyData[monthYear] = {
    ...formData,
    timestamp,
    total: parseFloat(formData.generation || 0)
  };

  // Update site totals
  allData[siteId].totalGeneration = Object.values(allData[siteId].monthlyData)
    .reduce((sum, month) => sum + parseFloat(month.generation || 0), 0);
  allData[siteId].lastUpdated = timestamp;

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));

  // Return updated site data
  return getSiteProductionData(siteId);
};

// Get data for allocation table
export const getProductionAllocationData = () => {
  const allData = getAllProductionData();
  
  return Object.entries(allData).map(([siteId, data]) => {
    const site = PRODUCTION_SITES.find(s => s.id === siteId);
    const latestMonth = Object.entries(data.monthlyData)
      .sort(([,a], [,b]) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    return {
      siteId,
      siteName: site.name,
      location: site.location,
      type: site.type,
      capacity: site.capacity,
      totalGeneration: data.totalGeneration,
      lastUpdated: data.lastUpdated,
      latestMonthData: latestMonth ? latestMonth[1] : null
    };
  });
};

// Delete production data entry
export const deleteProductionDataEntry = (siteId, monthYear) => {
  const allData = getAllProductionData();
  
  if (!allData[siteId] || !allData[siteId].monthlyData[monthYear]) {
    throw new Error('Data entry not found');
  }

  // Remove the entry
  delete allData[siteId].monthlyData[monthYear];

  // Recalculate totals
  allData[siteId].totalGeneration = Object.values(allData[siteId].monthlyData)
    .reduce((sum, month) => sum + parseFloat(month.generation || 0), 0);
  allData[siteId].lastUpdated = new Date().toISOString();

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));

  // Return updated site data
  return getSiteProductionData(siteId);
};

// Subscribe to data changes
export const subscribeToProductionDataChanges = (callback) => {
  const handleStorageChange = (event) => {
    if (event.key === STORAGE_KEY) {
      callback(JSON.parse(event.newValue));
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
};
