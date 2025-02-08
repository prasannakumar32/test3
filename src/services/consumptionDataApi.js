// Consumption Site Data Management API
import { CONSUMPTION_SITES } from '../data/sites';

const STORAGE_KEY = 'consumptionSiteData';

// Helper function to format date
const formatMonthYear = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// Initialize storage with empty data for each site
const initializeStorage = () => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    const initialData = CONSUMPTION_SITES.reduce((acc, site) => {
      acc[site.id] = {
        siteInfo: { ...site },
        monthlyData: {},
        totalConsumption: 0,
        lastUpdated: null,
        consumers: {
          C1: { total: 0, lastUpdated: null },
          C2: { total: 0, lastUpdated: null },
          C3: { total: 0, lastUpdated: null },
          C4: { total: 0, lastUpdated: null },
          C5: { total: 0, lastUpdated: null }
        }
      };
      return acc;
    }, {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(existingData);
};

// Get all consumption data
export const getAllConsumptionData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initializeStorage();
};

// Get consumption data for a specific site with historical data
export const getSiteConsumptionData = (siteId) => {
  const allData = getAllConsumptionData();
  const siteData = allData[siteId];
  
  if (!siteData) return null;

  // Format historical data for display
  const historicalData = Object.entries(siteData.monthlyData)
    .map(([monthYear, data]) => ({
      monthYear,
      ...data,
      total: Object.entries(data)
        .filter(([key]) => key.startsWith('C'))
        .reduce((sum, [, value]) => sum + parseFloat(value || 0), 0)
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    ...siteData,
    historicalData,
    consumerTotals: siteData.consumers
  };
};

// Add new consumption data entry
export const addConsumptionDataEntry = (siteId, formData) => {
  const allData = getAllConsumptionData();
  const monthYear = formatMonthYear(new Date());
  const timestamp = new Date().toISOString();

  if (!allData[siteId]) {
    throw new Error('Site not found');
  }

  // Update monthly data
  allData[siteId].monthlyData[monthYear] = {
    ...formData,
    timestamp,
    total: Object.values(formData).reduce((sum, val) => sum + parseFloat(val || 0), 0)
  };

  // Update consumer totals
  Object.entries(formData).forEach(([consumer, value]) => {
    if (consumer.startsWith('C')) {
      allData[siteId].consumers[consumer].total = Object.values(allData[siteId].monthlyData)
        .reduce((sum, month) => sum + parseFloat(month[consumer] || 0), 0);
      allData[siteId].consumers[consumer].lastUpdated = timestamp;
    }
  });

  // Update site totals
  allData[siteId].totalConsumption = Object.values(allData[siteId].monthlyData)
    .reduce((sum, month) => sum + parseFloat(month.total || 0), 0);
  allData[siteId].lastUpdated = timestamp;

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));

  // Return updated site data
  return getSiteConsumptionData(siteId);
};

// Get data for allocation table
export const getConsumptionAllocationData = () => {
  const allData = getAllConsumptionData();
  
  return Object.entries(allData).map(([siteId, data]) => {
    const site = CONSUMPTION_SITES.find(s => s.id === siteId);
    const latestMonth = Object.entries(data.monthlyData)
      .sort(([,a], [,b]) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    return {
      siteId,
      siteName: site.name,
      location: site.location,
      type: site.type,
      capacity: site.capacity,
      totalConsumption: data.totalConsumption,
      lastUpdated: data.lastUpdated,
      consumerData: data.consumers,
      latestMonthData: latestMonth ? latestMonth[1] : null
    };
  });
};

// Delete consumption data entry
export const deleteConsumptionDataEntry = (siteId, monthYear) => {
  const allData = getAllConsumptionData();
  
  if (!allData[siteId] || !allData[siteId].monthlyData[monthYear]) {
    throw new Error('Data entry not found');
  }

  // Remove the entry
  delete allData[siteId].monthlyData[monthYear];

  // Recalculate totals
  const timestamp = new Date().toISOString();
  const consumers = ['C1', 'C2', 'C3', 'C4', 'C5'];

  consumers.forEach(consumer => {
    allData[siteId].consumers[consumer].total = Object.values(allData[siteId].monthlyData)
      .reduce((sum, month) => sum + parseFloat(month[consumer] || 0), 0);
    allData[siteId].consumers[consumer].lastUpdated = timestamp;
  });

  allData[siteId].totalConsumption = Object.values(allData[siteId].monthlyData)
    .reduce((sum, month) => 
      sum + consumers.reduce((monthSum, consumer) => 
        monthSum + parseFloat(month[consumer] || 0), 0), 0);
  allData[siteId].lastUpdated = timestamp;

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));

  // Return updated site data
  return getSiteConsumptionData(siteId);
};

// Subscribe to data changes
export const subscribeToConsumptionDataChanges = (callback) => {
  const handleStorageChange = (event) => {
    if (event.key === STORAGE_KEY) {
      callback(JSON.parse(event.newValue));
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
};
