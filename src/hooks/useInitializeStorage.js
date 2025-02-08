import { useEffect } from 'react';
import { initializeStorage } from '../services/initializeStorage';

export const useInitializeStorage = () => {
  useEffect(() => {
    console.log('Running storage initialization...');
    try {
      // Clear any existing data first
      localStorage.removeItem('productionSiteData');
      localStorage.removeItem('consumptionSiteData');
      
      // Initialize with fresh data
      initializeStorage();
      console.log('Storage initialized successfully');
      
      // Verify the data
      const prodData = localStorage.getItem('productionSiteData');
      const consData = localStorage.getItem('consumptionSiteData');
      
      if (!prodData || !consData) {
        console.error('Data not properly initialized');
        // Try initializing again
        initializeStorage();
      } else {
        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }, []); // Empty dependency array means this runs once when component mounts
};
