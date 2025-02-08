import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography
} from '@mui/material';
import { getAllProductionUnits, getTotalSitesAndCapacity } from '../services/dynamoDBService';
import { getAllItems } from '../services/ddb';
// Custom styled card component
const DashboardCard = ({ title, items, bgColor = 'rgba(0, 171, 85, 0.08)' }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      height: '100%',
      backgroundColor: bgColor,
      borderRadius: 2,
      '&:hover': {
        boxShadow: 6,
        cursor: 'pointer'
      }
    }}
  >
    <Typography
      variant="h6"
      component="div"
      sx={{
        color: '#2196f3',
        fontWeight: 'bold',
        mb: 2
      }}
    >
      {title}
    </Typography>
    {items.map((item, index) => (
      <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 2, fontSize: '20px' }}>{item.icon}</Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {item.label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            {item.value}
          </Typography>
        </Box>
      </Box>
    ))}
  </Paper>
);


const Dashboard = () => {
  const navigate = useNavigate();
  const [productionStats, setProductionStats] = useState({
    totalSites: 0,
    totalCapacity: 0,
    activeSites: 0,
    windSites: 0,
    solarSites: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSites, setTotalSites] = useState(0);
  const [totalCapacity, setTotalCapacity] = useState(0);

  useEffect(() => {
    const fetchProductionStats = async () => {
      try {
        setLoading(true);
        const units = await getAllProductionUnits();

        const newStats = {
          totalSites: units.length,
          totalCapacity: units.reduce((sum, unit) => sum + (parseFloat(unit.Capacity_MW) || 0), 0),
          activeSites: units.filter(unit => unit.Status === 'Active').length,
          windSites: units.filter(unit => unit.Type === 'Wind').length,
          solarSites: units.filter(unit => unit.Type === 'Solar').length
        };

        setProductionStats(newStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching production stats:', err);
        setError('Failed to fetch production statistics');
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      const data = await getTotalSitesAndCapacity();
      setTotalSites(data.totalSites);
      setTotalCapacity(data.totalCapacity);
    };

    fetchProductionStats();
    fetchData();
  }, []);

  if (loading) return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography>Loading dashboard data...</Typography>
    </Container>
  );

  if (error) return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography color="error">{error}</Typography>
    </Container>
  );
  const cards = [
    {
      title: 'Production',
      bgColor: 'rgba(33, 150, 243, 0.08)',
      items: [
        { icon: '📊', label: 'total Sites', value: productionStats.totalSites },
        { icon: '⚡', label: 'total Capacity', value: `${productionStats.totalCapacity} units` },
        { icon: '✅', label: 'active Sites', value: productionStats.activeSites },
        { icon: '🌪️', label: 'wind Sites', value: productionStats.windSites },
        { icon: '☀️', label: 'solar Sites', value: productionStats.solarSites }
      ]
    },
    {
      title: 'Consumption',
      bgColor: 'rgba(233, 30, 99, 0.08)',
      items: [
        { icon: '📊', label: 'total Sites', value: 0 },
        { icon: '📈', label: 'total Consumption', value: '0 units' },
        { icon: '✅', label: 'active Sites', value: 0 }
      ]
    },
    {
      title: 'Allocation',
      bgColor: 'rgba(156, 39, 176, 0.08)',
      items: [
        { icon: '📋', label: 'total Allocated', value: '120 units' },
        { icon: '⏳', label: 'pending Allocations', value: 1 },
        { icon: '🔄', label: 'recent Allocations', value: 2 },
        { icon: '📊', label: 'available For Allocation', value: '30 units' }
      ]
    },
    {
      title: 'Reports',
      bgColor: 'rgba(255, 152, 0, 0.08)',
      items: [
        { icon: '📊', label: 'total Reports', value: 2 },
        { icon: '🕒', label: 'last Updated', value: '17/12/2024' }
      ]
    },
    {
      title: 'DynamoDB Stats',
      bgColor: 'rgba(0, 171, 85, 0.08)',
      items: [
        { icon: '📊', label: 'total Sites', value: totalSites },
        { icon: '⚡', label: 'total Capacity', value: `${totalCapacity} MW` }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <DashboardCard
              title={card.title}
              items={card.items}
              bgColor={card.bgColor}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
getAllItems();
console.log("Getting all items from the table...");
export default Dashboard;
