import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSiteContext } from '../context/SiteContext';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const SiteSelector = ({ selectedSite, onSiteSelect, siteType }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [hoveredSite, setHoveredSite] = useState(null);
  const { hasAccessToSite } = useAuth();
  const { productionSites, consumptionSites, loading, error } = useSiteContext();

  // Get the appropriate sites based on type
  const sites = siteType === 'PRODUCTION' ? productionSites : consumptionSites;

  // Filter sites based on user permissions
  const userSites = sites.filter(site => hasAccessToSite(site.id));

  const getSiteImageUrl = (siteId) => {
    return `/assets/sites/site-${siteId}.jpg`;
  };

  const handleImageError = (siteId) => {
    setImageErrors(prev => ({
      ...prev,
      [siteId]: true
    }));
  };

  const getSiteTypeIcon = (type) => {
    switch (type) {
      case 'WINDFARM':
        return '🌪️';
      case 'SOLAR':
        return '☀️';
      case 'WIND_BANKING':
        return '🔋';
      default:
        return '🏭';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="m-4">
        Error loading sites: {error}
      </Alert>
    );
  }

  if (!userSites.length) {
    return (
      <Alert severity="info" className="m-4">
        No {siteType.toLowerCase()} sites available for your account
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {userSites.map((site) => {
        const isHovered = hoveredSite === site.id;
        
        return (
          <div
            key={site.id}
            className={`cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
              selectedSite === site.id 
                ? 'ring-2 ring-blue-500 transform scale-105' 
                : 'hover:scale-102'
            }`}
            onClick={() => onSiteSelect(site.id)}
            onMouseEnter={() => setHoveredSite(site.id)}
            onMouseLeave={() => setHoveredSite(null)}
          >
            <div className="relative pb-[75%] bg-gradient-to-br from-blue-500 to-blue-600">
              {!imageErrors[site.id] && (
                <img
                  src={getSiteImageUrl(site.id)}
                  alt={site.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}
                  onError={() => handleImageError(site.id)}
                />
              )}
              <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${
                isHovered ? 'from-black/80' : 'from-black/60'
              } to-transparent`} />
              <div className="absolute top-3 right-3">
                <span className="text-2xl filter drop-shadow-lg" title={site.type}>
                  {getSiteTypeIcon(site.type)}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">{site.name}</h3>
                  <p className="text-sm text-white/90">{site.type}</p>
                  <p className="text-sm text-white/80">Location: {site.location}</p>
                  {site.capacity && (
                    <p className="text-sm text-white/80">Capacity: {site.capacity}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SiteSelector;
