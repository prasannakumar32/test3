import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIndustry,
  faChartLine,
  faFileAlt,
  faSignOutAlt,
  faTachometerAlt
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(UserContext);

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: faTachometerAlt, 
      path: '/dashboard' 
    },
    { 
      text: 'Production', 
      icon: faIndustry, 
      path: '/production' 
    },
    { 
      text: 'Consumption', 
      icon: faChartLine, 
      path: '/consumption' 
    },
    { 
      text: 'Reports', 
      icon: faFileAlt, 
      path: '/reports' 
    }
  ];

  const handleLogout = () => {
    // First call logout from context to clear user state
    logout();
    // Then navigate to login page
    window.location.href = '/login';
  };

  return (
    <Box
      sx={{
        width: 240,
        minHeight: '100vh',
        bgcolor: '#fff',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: '"Courier New", Courier, monospace',
            color: '#1976d2',
            fontWeight: 'bold'
          }}
        >
          STRIO ENERGY
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  borderRight: '3px solid #1976d2',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.12)',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon>
                <FontAwesomeIcon 
                  icon={item.icon} 
                  style={{ 
                    color: location.pathname === item.path ? '#1976d2' : '#666',
                    fontSize: '1.2rem'
                  }} 
                />
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiTypography-root': {
                    color: location.pathname === item.path ? '#1976d2' : '#666',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(244, 67, 54, 0.08)',
              },
            }}
          >
            <ListItemIcon>
              <FontAwesomeIcon 
                icon={faSignOutAlt} 
                style={{ color: '#f44336', fontSize: '1.2rem' }} 
              />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{
                '& .MuiTypography-root': {
                  color: '#f44336',
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
