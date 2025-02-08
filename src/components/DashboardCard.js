import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import FactoryIcon from '@mui/icons-material/Factory';
import SpeedIcon from '@mui/icons-material/Speed';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';

const DashboardCard = ({ title, type, data }) => {
  const getCardContent = () => {
    switch (type) {
      case 'production':
        return {
          icon: <FactoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
          mainStat: data.length || 0,
          subStat: `${data.filter(unit => unit.Status === 'Active').length || 0} Active`,
        };
      case 'consumption':
        return {
          icon: <SpeedIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
          mainStat: data.length || 0,
          subStat: 'Total Records',
        };
      case 'allocation':
        return {
          icon: <AssignmentIcon sx={{ fontSize: 40, color: 'success.main' }} />,
          mainStat: data.length || 0,
          subStat: 'Active Allocations',
        };
      case 'reports':
        return {
          icon: <DescriptionIcon sx={{ fontSize: 40, color: 'info.main' }} />,
          mainStat: data.length || 0,
          subStat: 'Generated Reports',
        };
      default:
        return {
          icon: null,
          mainStat: 0,
          subStat: '',
        };
    }
  };

  const { icon, mainStat, subStat } = getCardContent();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {mainStat}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subStat}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;