import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CONSUMPTION_SITES } from '../services/productionApi';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [productionSites, setProductionSites] = useState([
    {
      id: 'PS1',
      name: 'Tirunelveli Wind Farm',
      type: 'WIND',
      location: 'Tirunelveli',
      status: 'Active',
      c1: 250,
      c2: 300,
      c3: 275,
      c4: 325
    },
    {
      id: 'PS2',
      name: 'Pudukottai Solar Park',
      type: 'SOLAR',
      location: 'Pudukottai',
      status: 'Active',
      c1: 200,
      c2: 275,
      c3: 225,
      c4: 250
    }
  ]);

  const [consumptionSites, setConsumptionSites] = useState([
    {
      id: 'C1',
      name: 'Polyspin Exports Ltd',
      type: 'MANUFACTURING',
      location: 'Rajapalayam',
      status: 'Active'
    },
    {
      id: 'C2',
      name: 'PEL Textiles',
      type: 'TEXTILES',
      location: 'Rajapalayam',
      status: 'Active'
    },
    {
      id: 'C3',
      name: 'M/s Ramar and Sons',
      type: 'MANUFACTURING',
      location: 'Rajapalayam',
      status: 'Active'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    productionSites,
    consumptionSites,
    loading,
    error,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};
