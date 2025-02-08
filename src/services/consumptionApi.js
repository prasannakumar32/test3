import axios from 'axios';

const API_BASE_URL = 'https://673842714eb22e24fca75691.mockapi.io';

const api = axios.create({
  baseURL: `${API_BASE_URL}/consumption`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const productionApi = axios.create({
  baseURL: `${API_BASE_URL}/production`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const consumerApi = axios.create({
  baseURL: `${API_BASE_URL}/consumer`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const resourceApi = axios.create({
  baseURL: `${API_BASE_URL}/resource`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Validation utilities
const validateNumericValues = (data, fields) => {
  const errors = [];
  fields.forEach(field => {
    if (field in data && (typeof data[field] !== 'number' || isNaN(data[field]))) {
      errors.push(`${field} must be a valid number`);
    }
  });
  return errors;
};

const validateProductionData = (data) => {
  const numericFields = ['c1', 'c2', 'c3', 'c4', 'c5'];
  const errors = validateNumericValues(data, numericFields);
  
  if (!data.user_id) {
    errors.push('user_id is required');
  }
  if (!data.month_year) {
    errors.push('month_year is required');
  }
  
  return errors;
};

const validateConsumerData = (data) => {
  const numericFields = ['c1', 'c2', 'c3', 'cc4', 'c5'];
  const errors = validateNumericValues(data, numericFields);
  
  if (!data.user_id) {
    errors.push('user_id is required');
  }
  if (!data.month_year) {
    errors.push('month_year is required');
  }
  
  return errors;
};

const validateResourceData = (data) => {
  const numericFields = ['r1', 'r2', 'r3', 'r4', 'r5'];
  const errors = validateNumericValues(data, numericFields);
  
  if (!data.user_id) {
    errors.push('user_id is required');
  }
  if (!data.month_year) {
    errors.push('month_year is required');
  }
  
  return errors;
};

// Get all consumption records with optional filters
export const getAllConsumption = async (filters = {}) => {
  try {
    const response = await api.get('/', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching consumption data:', error);
    throw error;
  }
};

// Get a specific consumption record by ID
export const getConsumptionById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching consumption by ID:', error);
    throw error;
  }
};

// Create a new consumption record
export const createConsumption = async (consumptionData) => {
  try {
    const response = await api.post('/', consumptionData);
    return response.data;
  } catch (error) {
    console.error('Error creating consumption:', error);
    throw error;
  }
};

// Update an existing consumption record
export const updateConsumption = async (id, consumptionData) => {
  try {
    const response = await api.put(`/${id}`, consumptionData);
    return response.data;
  } catch (error) {
    console.error('Error updating consumption:', error);
    throw error;
  }
};

// Delete a consumption record
export const deleteConsumption = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting consumption:', error);
    throw error;
  }
};

// Get consumption statistics
export const getConsumptionStats = async (timeRange = 'daily') => {
  try {
    const response = await api.get('/stats', { params: { timeRange } });
    return response.data;
  } catch (error) {
    console.error('Error fetching consumption stats:', error);
    throw error;
  }
};

// Get consumption trends
export const getConsumptionTrends = async (startDate, endDate) => {
  try {
    const response = await api.get('/trends', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching consumption trends:', error);
    throw error;
  }
};

// Get consumption summary
export const getConsumptionSummary = async () => {
  try {
    const response = await api.get('/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching consumption summary:', error);
    throw error;
  }
};

// Get all production records with optional filters
export const getAllProduction = async (filters = {}) => {
  try {
    const response = await productionApi.get('/', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching production data:', error);
    throw error;
  }
};

// Get a specific production record by ID
export const getProductionById = async (id) => {
  try {
    const response = await productionApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching production by ID:', error);
    throw error;
  }
};

// Create a new production record
export const createProduction = async (productionData) => {
  try {
    const errors = validateProductionData(productionData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    const validatedData = {
      ...productionData,
      c1: Number(productionData.c1),
      c2: Number(productionData.c2),
      c3: Number(productionData.c3),
      c4: Number(productionData.c4),
      c5: Number(productionData.c5)
    };
    
    const response = await productionApi.post('/', validatedData);
    return response.data;
  } catch (error) {
    console.error('Error creating production:', error);
    throw error;
  }
};

// Update an existing production record
export const updateProduction = async (id, productionData) => {
  try {
    const errors = validateProductionData(productionData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    const validatedData = {
      ...productionData,
      c1: Number(productionData.c1),
      c2: Number(productionData.c2),
      c3: Number(productionData.c3),
      c4: Number(productionData.c4),
      c5: Number(productionData.c5)
    };
    
    const response = await productionApi.put(`/${id}`, validatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating production:', error);
    throw error;
  }
};

// Delete a production record
export const deleteProduction = async (id) => {
  try {
    const response = await productionApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting production:', error);
    throw error;
  }
};

// Get all consumer records with optional filters
export const getAllConsumers = async (filters = {}) => {
  try {
    const response = await consumerApi.get('/', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching consumer data:', error);
    throw error;
  }
};

// Get a specific consumer record by ID
export const getConsumerById = async (id) => {
  try {
    const response = await consumerApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching consumer by ID:', error);
    throw error;
  }
};

// Create a new consumer record
export const createConsumer = async (consumerData) => {
  try {
    const errors = validateConsumerData(consumerData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    const validatedData = {
      ...consumerData,
      c1: Number(consumerData.c1),
      c2: Number(consumerData.c2),
      c3: Number(consumerData.c3),
      cc4: Number(consumerData.cc4),
      c5: Number(consumerData.c5)
    };
    
    const response = await consumerApi.post('/', validatedData);
    return response.data;
  } catch (error) {
    console.error('Error creating consumer:', error);
    throw error;
  }
};

// Update an existing consumer record
export const updateConsumer = async (id, consumerData) => {
  try {
    const errors = validateConsumerData(consumerData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    const validatedData = {
      ...consumerData,
      c1: Number(consumerData.c1),
      c2: Number(consumerData.c2),
      c3: Number(consumerData.c3),
      cc4: Number(consumerData.cc4),
      c5: Number(consumerData.c5)
    };
    
    const response = await consumerApi.put(`/${id}`, validatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating consumer:', error);
    throw error;
  }
};

// Delete a consumer record
export const deleteConsumer = async (id) => {
  try {
    const response = await consumerApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting consumer:', error);
    throw error;
  }
};

// Get all resource records with optional filters
export const getAllResources = async (filters = {}) => {
  try {
    const response = await resourceApi.get('/', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching resource data:', error);
    throw error;
  }
};

// Get a specific resource record by ID
export const getResourceById = async (id) => {
  try {
    const response = await resourceApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resource by ID:', error);
    throw error;
  }
};

// Create a new resource record
export const createResource = async (resourceData) => {
  try {
    const errors = validateResourceData(resourceData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    const validatedData = {
      ...resourceData,
      r1: Number(resourceData.r1),
      r2: Number(resourceData.r2),
      r3: Number(resourceData.r3),
      r4: Number(resourceData.r4),
      r5: Number(resourceData.r5)
    };
    
    const response = await resourceApi.post('/', validatedData);
    return response.data;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

// Update an existing resource record
export const updateResource = async (id, resourceData) => {
  try {
    const errors = validateResourceData(resourceData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    const validatedData = {
      ...resourceData,
      r1: Number(resourceData.r1),
      r2: Number(resourceData.r2),
      r3: Number(resourceData.r3),
      r4: Number(resourceData.r4),
      r5: Number(resourceData.r5)
    };
    
    const response = await resourceApi.put(`/${id}`, validatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
};

// Delete a resource record
export const deleteResource = async (id) => {
  try {
    const response = await resourceApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};

export { api, productionApi, consumerApi, resourceApi };
