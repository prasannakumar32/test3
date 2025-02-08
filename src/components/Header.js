import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import {
  Factory as FactoryIcon,
  ElectricBolt as ConsumptionIcon,
  PieChart as AllocationIcon,
  BarChart as ReportsIcon,
} from '@mui/icons-material';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    handleClose();
  };

  const handleAccountDetails = () => {
    navigate('/account');
    handleClose();
  };

  const navigationIcons = [
    { icon: <FactoryIcon />, title: 'Production', path: '/production' },
    { icon: <ConsumptionIcon />, title: 'Consumption', path: '/consumption' },
    { icon: <AllocationIcon />, title: 'Allocation', path: '/allocation' },
    { icon: <ReportsIcon />, title: 'Reports', path: '/reports' },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        {/* Logo and Company Name */}
        <Box
          display="flex"
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <img
            src={logo}
            alt="Strio Logo"
            style={{
              height: 40,
              width: 'auto',
              marginRight: '1rem'
            }}
          />
          <Typography variant="h6" color="primary">
            STRIO ENERGY
          </Typography>
        </Box>

        {/* Navigation Icons */}
        <Box
          display="flex"
          alignItems="center"
          sx={{
            ml: 4,
            gap: 2,
            flexGrow: 1,
            justifyContent: 'center'
          }}
        >
          {navigationIcons.map((item) => (
            <Tooltip title={item.title} key={item.path}>
              <IconButton
                color="primary"
                onClick={() => navigate(item.path)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>

        {/* User Account */}
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            {user?.name || 'User'}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleMenu}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleAccountDetails}>Account Details</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;