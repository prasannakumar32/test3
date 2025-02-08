import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import {
  Factory as FactoryIcon,
  ElectricBolt as ConsumptionIcon,
  PieChart as AllocationIcon,
  BarChart as ReportsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { MOCK_HISTORICAL_DATA, MOCK_CONSUMPTION_DATA } from '../services/productionApi';

const Dashboard = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);

  useEffect(() => {
    // Combine and format production data from all sites
    const productionData = Object.values(MOCK_HISTORICAL_DATA).reduce((acc, siteData) => {
      siteData.forEach(monthData => {
        const existingMonth = acc.find(item => item.month === monthData.month);
        if (existingMonth) {
          existingMonth.production += monthData.production;
        } else {
          acc.push({
            month: monthData.month,
            production: monthData.production
          });
        }
      });
      return acc;
    }, []);

    // Format consumption data
    const formattedConsumption = Object.values(MOCK_CONSUMPTION_DATA).reduce((acc, siteData) => {
      siteData.forEach(monthData => {
        const existingMonth = acc.find(item => item.month === monthData.month);
        if (existingMonth) {
          existingMonth.consumption += parseInt(monthData.totalConsumption);
        } else {
          acc.push({
            month: monthData.month,
            consumption: parseInt(monthData.totalConsumption)
          });
        }
      });
      return acc;
    }, []);

    // Combine production and consumption data
    const combinedData = productionData.map(prod => ({
      ...prod,
      consumption: formattedConsumption.find(cons => cons.month === prod.month)?.consumption || 0
    }));

    setHistoricalData(combinedData);
  }, []);

  const dashboardData = {
    production: { totalCapacity: '1405 MW', windSites: 6, solarSites: 4 },
    consumption: { total: '290 MW', activeConsumers: 3, available: '1115 MW' },
    allocation: { total: '125 MW', recentAllocations: 2, availableForAllocation: '1280 MW' },
    reports: { monthlyReports: 3, performance: 'Available', efficiency: 'Updated' },
  };

  const renderMetricCard = (title, mainMetric, label1, value1, label2, value2, icon, color, path) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: 40, height: 40, bgcolor: color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <ArrowForwardIcon />
        </Box>
        <Typography variant="h4" sx={{ color, fontWeight: 500 }}>
          {mainMetric}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">{label1}</Typography>
            <Typography variant="subtitle1">{value1}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">{label2}</Typography>
            <Typography variant="subtitle1">{value2}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome back, {JSON.parse(localStorage.getItem('user'))?.name || 'User'}!
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard('Production', dashboardData.production.totalCapacity, 'Wind Sites', dashboardData.production.windSites, 'Solar Sites', dashboardData.production.solarSites, <FactoryIcon />, '#1976d2', '/production')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard('Consumption', dashboardData.consumption.total, 'Active Consumers', dashboardData.consumption.activeConsumers, 'Available', dashboardData.consumption.available, <ConsumptionIcon />, '#2e7d32', '/consumption')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard('Allocation', dashboardData.allocation.total, 'Recent Allocations', dashboardData.allocation.recentAllocations, 'Available for Allocation', dashboardData.allocation.availableForAllocation, <AllocationIcon />, '#ed6c02', '/allocation')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard('Reports', dashboardData.reports.monthlyReports, 'Performance', dashboardData.reports.performance, 'Efficiency', dashboardData.reports.efficiency, <ReportsIcon />, '#9c27b0', '/reports')}
        </Grid>

        {/* Historical Data Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Production & Consumption History
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={historicalData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="production"
                      stroke="#1976d2"
                      name="Production"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke="#2e7d32"
                      name="Consumption"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard; 