import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  ViewModule as ViewModuleIcon,
  CompareArrows as CompareArrowsIcon,
  BarChart as BarChartIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { StorageProvider } from '../context/StorageContext';
import logo from '../assets/logo.jpg';

const navItems = [
  { icon: <HomeIcon />, path: '/dashboard', label: 'Home' },
  { icon: <ViewModuleIcon />, path: '/production', label: 'Production' },
  { icon: <AssessmentIcon />, path: '/consumption', label: 'Consumption' },
  { icon: <CompareArrowsIcon />, path: '/allocation', label: 'Allocation' },
  { icon: <BarChartIcon />, path: '/reports', label: 'Reports' }
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const username = localStorage.getItem('username') || 'User'; // Get username from localStorage

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    // Navigate to login page
    navigate('/login');
    handleClose();
  };

  return (
    <StorageProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: '#1a237e',
            boxShadow: 'none',
            zIndex: (theme) => theme.zIndex.drawer + 1 
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo and Company Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={logo}
                alt="STRIO ENERGY"
                sx={{
                  height: 40,
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/')}
              />
            </Box>

            {/* Navigation Icons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <IconButton
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: location.pathname.startsWith(item.path) 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Box>

            {/* User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 1, color: 'white' }}>
                {username}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
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
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8, // Add margin top to account for fixed AppBar
            backgroundColor: '#f5f5f5'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </StorageProvider>
  );
}

export default Layout;
