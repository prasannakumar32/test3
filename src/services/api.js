import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Mock users data with their associated sites and roles
const MOCK_USERS = {
  strioadmin: {
    id: 'admin1',
    username: 'strioadmin',
    password: 'admin123',
    role: 'superuser',
    permissions: ['read', 'write', 'admin'],
    sites: [
      'PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PS6',  // Solar sites
      'PW1', 'PW2', 'PW3', 'PW4', 'PW5', 'PW6', 'PW7',  // Wind sites
      'WB1', 'WB2', 'WB3',  // Wind banking sites
      'CS1', 'CS2', 'CS3', 'CS4', 'CS5', 'CS6', 'CS7', 'CS8', 'CS9', 'CS10', 'CS11', 'CS12'  // Consumption sites
    ]
  },
  striouser: {
    id: 'manager1',
    username: 'striouser',
    password: 'user123',
    role: 'manager',
    permissions: ['read', 'write'],
    sites: [
      'PS1', 'PS2', 'PS3', 'PS4',  // First 4 solar sites
      'PW1', 'PW2', 'PW3', 'PW4',  // First 4 wind sites
      'WB1', 'WB2',  // First 2 wind banking sites
      'CS1', 'CS2', 'CS3', 'CS4', 'CS5', 'CS6'  // First 6 consumption sites
    ]
  },
  testcase1: {
    id: '1',
    username: 'testcase1',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PS1',         // One solar site
      'PW1',         // One wind site
      'CS1', 'CS2', 'CS3'  // Three consumption sites
    ]
  },
  testcase2: {
    id: '2',
    username: 'testcase2',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PS3', 'PS4',  // Next 2 solar sites
      'PW3', 'PW4',  // Next 2 wind sites
      'WB2',         // Second wind banking site
      'CS4', 'CS5'   // Next 2 consumption sites
    ]
  },
  testcase3: {
    id: '3',
    username: 'testcase3',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PS5',         // Fifth solar site
      'PW5',         // Fifth wind site
      'WB3',         // Third wind banking site
      'CS6', 'CS7'   // Next 2 consumption sites
    ]
  },
  testcase4: {
    id: '4',
    username: 'testcase4',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PS6',         // Last solar site
      'PW6',         // Sixth wind site
      'CS8', 'CS9'   // Next 2 consumption sites
    ]
  },
  testcase5: {
    id: '5',
    username: 'testcase5',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PW7',         // Last wind site
      'CS10', 'CS11', 'CS12'  // Last 3 consumption sites
    ]
  }
};

const mockData = {
  sites: [
    // Solar Production Sites
    {
      id: 'PS1',
      name: 'Pudukottai Solar Park',
      location: 'Vadakadu, Keelathur, Pudukottai',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      capacity: '1000',
      grid: 'TANGEDCO',
      serviceNumber: '069534460069',
      status: 'Active'
    },
    // Wind Production Sites
    {
      id: 'PW1',
      name: 'Tirunelveli Wind Farm',
      location: 'Tirunelveli, Tamil Nadu',
      type: 'WIND',
      siteType: 'PRODUCTION',
      capacity: '150',
      grid: 'TANGEDCO',
      serviceNumber: '069534460070',
      status: 'Active'
    },
    // Consumption Sites
    {
      id: 'CS1',
      name: 'Polyspin Exports Ltd',
      location: 'Rajapalayam, Tamil Nadu',
      type: 'Industrial',
      siteType: 'CONSUMPTION',
      capacity: '500',
      grid: 'TANGEDCO',
      serviceNumber: '069534460071',
      status: 'Active'
    },
    {
      id: 'CS2',
      name: 'PEL Textiles',
      location: 'Rajapalayam, Tamil Nadu',
      type: 'Industrial',
      siteType: 'CONSUMPTION',
      capacity: '300',
      grid: 'TANGEDCO',
      serviceNumber: '069534460072',
      status: 'Active'
    },
    {
      id: 'CS3',
      name: 'M/s Ramar and Sons',
      location: 'Rajapalayam, Tamil Nadu',
      type: 'Industrial',
      siteType: 'CONSUMPTION',
      capacity: '250',
      grid: 'TANGEDCO',
      serviceNumber: '069534460073',
      status: 'Active'
    }
  ],
  historicalData: {
    PS1: [
      {
        timestamp: '2024-01-01T00:00:00Z',
        c1: 789,
        c2: 456,
        c3: 123,
        c4: 789,
        c5: 456
      }
    ],
    PW1: [
      {
        timestamp: '2024-01-01T00:00:00Z',
        c1: 234,
        c2: 567,
        c3: 890,
        c4: 123,
        c5: 456
      }
    ],
    CS1: [
      {
        timestamp: '2024-01-01T00:00:00Z',
        c1: 123,
        c2: 456,
        c3: 789,
        c4: 234,
        c5: 567
      }
    ],
    CS2: [
      {
        timestamp: '2024-01-01T00:00:00Z',
        c1: 567,
        c2: 890,
        c3: 123,
        c4: 456,
        c5: 789
      }
    ],
    CS3: [
      {
        timestamp: '2024-01-01T00:00:00Z',
        c1: 890,
        c2: 123,
        c3: 456,
        c4: 789,
        c5: 234
      }
    ]
  }
};

const apiService = {
  async login(username, password) {
    try {
      console.log('Login attempt with:', { username, password });
      
      // Check if user exists in mock data
      const trimmedUsername = username.trim().toLowerCase();
      const user = MOCK_USERS[trimmedUsername];
      console.log('Found user:', user);
      
      if (!user) {
        console.log('User not found');
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      if (user.password !== password.trim()) {
        console.log('Password mismatch');
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Create user data object with all necessary information
      const userData = {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
        sites: user.sites
      };

      // Create a token
      const token = btoa(`${username}:${new Date().getTime()}`);
      
      // Store auth data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('Login successful:', { userData });

      return {
        success: true,
        data: userData,
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed'
      };
    }
  },

  async validateToken() {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        return { success: false };
      }

      const user = JSON.parse(storedUser);
      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: false };
    }
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  async getSites(siteType = 'PRODUCTION') {
    try {
      // In a real app, this would be an API call
      const sites = mockData.sites.filter(site => site.siteType === siteType);
      return { success: true, data: sites };
    } catch (error) {
      console.error('Error fetching sites:', error);
      return { success: false, error: 'Failed to fetch sites' };
    }
  },

  async getSiteDetails(siteId) {
    try {
      // In a real app, this would be an API call
      const site = mockData.sites.find(site => site.id === siteId);
      const history = mockData.historicalData[siteId] || [];
      
      if (!site) {
        throw new Error('Site not found');
      }

      return {
        success: true,
        data: {
          ...site,
          history
        }
      };
    } catch (error) {
      console.error('Error fetching site details:', error);
      return { success: false, error: 'Failed to fetch site details' };
    }
  },

  async addHistoricalData(siteId, data) {
    try {
      // In a real app, this would be an API call
      if (!mockData.historicalData[siteId]) {
        mockData.historicalData[siteId] = [];
      }
      mockData.historicalData[siteId].push({
        timestamp: new Date().toISOString(),
        ...data
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding historical data:', error);
      return { success: false, error: 'Failed to add historical data' };
    }
  },

  async updateHistoricalData(siteId, timestamp, data) {
    try {
      // In a real app, this would be an API call
      const siteHistory = mockData.historicalData[siteId];
      const index = siteHistory.findIndex(item => item.timestamp === timestamp);
      if (index !== -1) {
        siteHistory[index] = { ...siteHistory[index], ...data };
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating historical data:', error);
      return { success: false, error: 'Failed to update historical data' };
    }
  },

  async deleteHistoricalData(siteId, timestamp) {
    try {
      // In a real app, this would be an API call
      if (mockData.historicalData[siteId]) {
        mockData.historicalData[siteId] = mockData.historicalData[siteId].filter(
          item => item.timestamp !== timestamp
        );
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting historical data:', error);
      return { success: false, error: 'Failed to delete historical data' };
    }
  }
};

export default apiService;
