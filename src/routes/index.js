import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConsumptionSiteSelector from '../components/ConsumptionSiteSelector';
import ConsumptionSiteDetails from '../components/ConsumptionSiteDetails';
import ProductionSiteDetails from '../components/ProductionSiteDetails';
import Dashboard from '../pages/Dashboard';
import Allocation from '../components/Allocation';
import Consumption from '../components/Consumption';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/sites" element={<ConsumptionSiteSelector />} />
      <Route path="/consumption" element={<Consumption />} />
      <Route path="/consumption/view/:siteId" element={<ConsumptionSiteDetails />} />
      <Route path="/production/view/:siteId" element={<ProductionSiteDetails />} />
      <Route path="/allocation" element={<Allocation />} />
    </Routes>
  );
};

export default AppRoutes;