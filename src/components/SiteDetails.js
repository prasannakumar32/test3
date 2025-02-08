import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  CircularProgress, 
  Alert, 
  Typography, 
  Grid, 
  Paper,
  Button,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './SiteDetails.css';
import Layout from './Layout';
import productionService from '../services/productionService';

const PRODUCTION_SITES = {
  PS1: { name: 'Pudukottai Solar Park', location: 'Pudukottai', type: 'Solar' },
  PS2: { name: 'Tirunelveli Wind Farm', location: 'Tirunelveli', type: 'Wind' }
};

const SiteDetails = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [siteData, setSiteData] = useState(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setLoading(true);
        setError(null);

        const siteConfig = PRODUCTION_SITES[siteId];
        if (!siteConfig) {
          setError('Invalid site ID');
          return;
        }

        const latestData = await productionService.getLatestProductionData();
        const siteData = latestData.find(data => data.siteId === siteId);
        
        if (siteData) {
          setSiteData({
            ...siteConfig,
            ...siteData,
            lastUpdated: siteData.timestamp ? new Date(siteData.timestamp).toLocaleString() : 'N/A'
          });
        } else {
          setSiteData({
            ...siteConfig,
            c1: 0,
            c2: 0,
            c3: 0,
            c4: 0,
            c5: 0,
            status: 'No Data',
            lastUpdated: 'N/A'
          });
        }
      } catch (err) {
        console.error('Error fetching site data:', err);
        setError('Error loading site data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [siteId]);

  const handleBack = () => {
    navigate('/allocation');
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box m={2}>
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={handleBack}>
              Go Back
            </Button>
          }>
            {error}
          </Alert>
        </Box>
      </Layout>
    );
  }

  if (!siteData) {
    return (
      <Layout>
        <Box m={2}>
          <Alert severity="info" action={
            <Button color="inherit" size="small" onClick={handleBack}>
              Go Back
            </Button>
          }>
            No site data available
          </Alert>
        </Box>
      </Layout>
    );
  }

  const totalProduction = 
    Number(siteData.c1 || 0) +
    Number(siteData.c2 || 0) +
    Number(siteData.c3 || 0) +
    Number(siteData.c4 || 0) +
    Number(siteData.c5 || 0);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header with back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            {siteData.name}
          </Typography>
        </Box>

        {/* Site Information */}
        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Site Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography color="textSecondary">Location</Typography>
                  <Typography variant="h6">{siteData.location}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography color="textSecondary">Type</Typography>
                  <Typography variant="h6">{siteData.type}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography color="textSecondary">Status</Typography>
                  <Typography variant="h6">{siteData.status}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Production Data */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Production Data</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Total Production</Typography>
                      <Typography variant="h4">{totalProduction}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Grid item xs={12} sm={6} md={2.4} key={num}>
                        <Card>
                          <CardContent>
                            <Typography color="textSecondary">C{num}</Typography>
                            <Typography variant="h5">{siteData[`c${num}`] || 0}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Last Updated */}
        <Box sx={{ mt: 2 }}>
          <Typography color="textSecondary">
            Last Updated: {siteData.lastUpdated}
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
};

export default SiteDetails;