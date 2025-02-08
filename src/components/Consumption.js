import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Numbers as ServiceNumberIcon,
  AccountBalance as BankIcon
} from '@mui/icons-material';
import { getConsumptionSites } from '../utils/consumptionStorage';

function Consumption() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const loadSites = async () => {
      try {
        const sitesData = await getConsumptionSites();
        setSites(sitesData);
      } catch (error) {
        console.error('Error loading consumption sites:', error);
      }
    };
    loadSites();
  }, []);

  const handleSiteClick = (siteId) => {
    navigate(`/consumption/${siteId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          sx={{ 
            mr: 2, 
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }}
        >
          <SpeedIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Consumption Sites
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {sites.map((site) => (
          <Grid item xs={12} sm={6} key={site.id}>
            <Paper
              sx={{
                p: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleSiteClick(site.id)}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {site.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {site.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Service Number: {site.serviceNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Consumer Type: {site.consumerType}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={site.type}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={site.id}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Consumption;
