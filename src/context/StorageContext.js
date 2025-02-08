import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllProductionUnits, getProductionData } from '../services/dynamoDBService';

const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
  const [productionUnits, setProductionUnits] = useState(null);
  const [productionData, setProductionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all production units
        const units = await getAllProductionUnits();
        setProductionUnits(units);

        // Fetch production data for each unit
        const productionDataMap = {};
        for (const unit of units) {
          const data = await getProductionData(unit.CompanyId, unit.ProductionId);
          productionDataMap[`${unit.CompanyId}-${unit.ProductionId}`] = data;
        }
        setProductionData(productionDataMap);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all production units
      const units = await getAllProductionUnits();
      setProductionUnits(units);

      // Fetch production data for each unit
      const productionDataMap = {};
      for (const unit of units) {
        const data = await getProductionData(unit.CompanyId, unit.ProductionId);
        productionDataMap[`${unit.CompanyId}-${unit.ProductionId}`] = data;
      }
      setProductionData(productionDataMap);

    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorageContext.Provider value={{
      productionUnits,
      productionData,
      loading,
      error,
      refreshData
    }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

export default StorageContext;
