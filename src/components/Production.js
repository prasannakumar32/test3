import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  IconButton,
  Button
} from '@mui/material';
import {
  dataIcons,
  navigationIcons,
  siteIcons,
  ProductionIcon,
  AddIcon
} from '../utils/icons';
import { getProductionSites, addProductionSite } from '../utils/productionStorage';
import ProductionSiteForm from './ProductionSiteForm';

function Production() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const loadSites = async () => {
      try {
        const sitesData = await getProductionSites();
        setSites(sitesData);
      } catch (error) {
        console.error('Error loading production sites:', error);
      }
    };
    loadSites();
  }, []);

  const handleSiteClick = (siteId) => {
    navigate(`/production/${siteId}`);
  };

  const handleAddSite = async (formData) => {
    try {
      // Generate a new site ID based on type
      const sitePrefix = formData.type === 'WIND' ? 'TW' : 'PS';
      const existingSites = sites.filter(site => site.id.startsWith(sitePrefix));
      const newSiteNumber = existingSites.length + 1;
      const newSiteId = `${sitePrefix}${newSiteNumber}`;

      // Create new site object
      const newSite = {
        ...formData,
        id: newSiteId,
        historicalData: {
          units: [],
          charges: []
        }
      };

      // Add the new site
      await addProductionSite(newSite);
      
      // Update sites list
      setSites(prevSites => [...prevSites, newSite]);
      
      // Close the form
      setOpenForm(false);
      
      // Navigate to the new site's details page
      navigate(`/production/${newSiteId}`);
    } catch (error) {
      console.error('Error adding new site:', error);
    }
  };

  const getFullSiteName = (site) => {
    return site.name;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#4caf50';
      case 'Inactive':
        return '#f44336';
      case 'Maintenance':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  const StatusIndicator = ({ status }) => (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '4px 12px',
        borderRadius: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 2
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: getStatusColor(status),
          boxShadow: `0 0 6px ${getStatusColor(status)}`,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        {status}
      </Typography>
    </Box>
  );

  const SiteIcon = ({ type }) => {
    const IconComponent = siteIcons[type];
    const iconStyle = {
      marginRight: 12,
      color: type === 'WIND' ? '#1a237e' : '#ff9800',
      fontSize: 28
    };

    return <IconComponent style={iconStyle} />;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 4, 
        mt: 3 
      }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: '#1a237e',
            padding: '8px 16px',
            borderRadius: '4px',
          }}
        >
          <ProductionIcon sx={{ color: '#fff', fontSize: 24, mr: 1.5 }} />
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 500 }}>
            Production Sites
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{
            backgroundColor: '#1a237e',
            '&:hover': {
              backgroundColor: '#0d47a1'
            }
          }}
        >
          Add New Site
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sites.map((site) => (
          <Grid item xs={12} sm={6} key={site.id}>
            <Paper
              sx={{
                p: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                backgroundColor: '#fff',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                border: `2px solid ${site.type === 'WIND' ? '#1a237e20' : '#ff980020'}`,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: site.type === 'WIND' 
                    ? 'linear-gradient(135deg, #1a237e10 0%, transparent 100%)'
                    : 'linear-gradient(135deg, #ff980010 0%, transparent 100%)',
                  zIndex: 0,
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: site.type === 'WIND'
                    ? '0 4px 20px 0 rgba(26, 35, 126, 0.2), 0 0 15px 0 rgba(26, 35, 126, 0.1)'
                    : '0 4px 20px 0 rgba(255, 152, 0, 0.2), 0 0 15px 0 rgba(255, 152, 0, 0.1)',
                  border: `2px solid ${site.type === 'WIND' ? '#1a237e40' : '#ff980040'}`,
                  '&:after': {
                    opacity: 1,
                  }
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: site.type === 'WIND'
                    ? 'radial-gradient(circle at center, rgba(26, 35, 126, 0.1) 0%, transparent 70%)'
                    : 'radial-gradient(circle at center, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out',
                  zIndex: 0,
                }
              }}
              onClick={() => handleSiteClick(site.id)}
              elevation={1}
            >
              <StatusIndicator status={site.status} />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  '& .MuiTypography-root': {
                    color: site.type === 'WIND' ? '#1a237e' : '#ff9800',
                    transition: 'color 0.3s ease-in-out'
                  }
                }}>
                  <SiteIcon type={site.type} />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {getFullSiteName(site)}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {React.createElement(dataIcons.location, { 
                        sx: { 
                          mr: 1, 
                          color: site.type === 'WIND' ? '#1a237e80' : '#ff980080',
                          transition: 'color 0.3s ease-in-out'
                        }
                      })}
                      <Typography variant="body2" sx={{ 
                        color: site.type === 'WIND' ? '#1a237ecc' : '#ff9800cc',
                        transition: 'color 0.3s ease-in-out'
                      }}>
                        {site.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {React.createElement(dataIcons.serviceNumber, { 
                        sx: { 
                          mr: 1, 
                          color: site.type === 'WIND' ? '#1a237e80' : '#ff980080',
                          transition: 'color 0.3s ease-in-out'
                        }
                      })}
                      <Typography variant="body2" sx={{ 
                        color: site.type === 'WIND' ? '#1a237ecc' : '#ff9800cc',
                        transition: 'color 0.3s ease-in-out'
                      }}>
                        {site.serviceNumber}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {React.createElement(dataIcons.capacity, { 
                        sx: { 
                          mr: 1, 
                          color: site.type === 'WIND' ? '#1a237e80' : '#ff980080',
                          transition: 'color 0.3s ease-in-out'
                        }
                      })}
                      <Typography variant="body2" sx={{ 
                        color: site.type === 'WIND' ? '#1a237ecc' : '#ff9800cc',
                        transition: 'color 0.3s ease-in-out'
                      }}>
                        {site.capacity}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {React.createElement(dataIcons.factory, { 
                        sx: { 
                          mr: 1, 
                          color: site.type === 'WIND' ? '#1a237e80' : '#ff980080',
                          transition: 'color 0.3s ease-in-out'
                        }
                      })}
                      <Typography variant="body2" sx={{ 
                        color: site.type === 'WIND' ? '#1a237ecc' : '#ff9800cc',
                        transition: 'color 0.3s ease-in-out'
                      }}>
                        {site.grid}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <ProductionSiteForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleAddSite}
      />
    </Container>
  );
}

export default Production;
