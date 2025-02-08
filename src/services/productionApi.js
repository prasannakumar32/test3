import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Mock data for development
export const MOCK_PRODUCTION_SITES = [
  {
    id: 'PW1',
    name: 'PUDUKOTTAI',
    location: 'Vadakadu, Keelathur, Pudukottai',
    type: 'SOLAR',
    status: 'Active',
    capacity: '1000 MW',
    serviceNumber: '069534460069',
    grid: 'TANGEDCO'
  },
  {
    id: 'TW1',
    name: 'TIRUNELVELI',
    location: 'Tirunelveli, Tamil Nadu',
    type: 'SOLAR',
    status: 'Active',
    capacity: '500 MW',
    serviceNumber: 'TNL-001',
    grid: 'TANGEDCO'
  }
];

export const getAllProductionSites = () => {
  return Promise.resolve(MOCK_PRODUCTION_SITES);
};

export const getProductionSiteById = (id) => {
  const site = MOCK_PRODUCTION_SITES.find(site => site.id === id);
  return Promise.resolve(site || null);
};

export const getProductionStats = () => {
  return Promise.resolve([]);
};

export const updateProductionSite = (id, data) => {
  return Promise.resolve({ ...data, id });
};

export const createProductionSite = (data) => {
  return Promise.resolve({ ...data, id: Date.now().toString() });
};

export const deleteProductionSite = (id) => {
  return Promise.resolve({ success: true });
};

export const handleAllocation = (allocationData) => {
  return Promise.resolve({
    success: true,
    allocation: {
      ...allocationData,
      id: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString()
    }
  });
};
