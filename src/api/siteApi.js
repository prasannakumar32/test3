import { MOCK_CONSUMPTION_SITES } from '../services/productionApi';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const siteApi = {
  getAllSites: async () => {
    return MOCK_CONSUMPTION_SITES;
  },

  getSiteById: async (siteId) => {
    const site = MOCK_CONSUMPTION_SITES.find(site => site.id === siteId);
    if (!site) {
      throw new Error('Site not found');
    }
    return site;
  }
};