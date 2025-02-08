import React from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';

const ConsumptionSiteSelector = () => {
  const navigate = useNavigate();
  const { consumptionSites, loading } = useSiteContext();

  const handleSiteSelection = (selected) => {
    if (!selected) return;
    // The ID is already in the correct format (C1, C2, etc.)
    navigate(`/consumption/view/${selected.id}`);
  };

  if (loading) {
    return <div>Loading sites...</div>;
  }

  return (
    <div className="consumption-site-selector">
      <Select 
        options={consumptionSites}
        onChange={handleSiteSelection}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id}
        placeholder="Select a consumption site..."
        className="site-selector"
      />
    </div>
  );
};

export default ConsumptionSiteSelector;