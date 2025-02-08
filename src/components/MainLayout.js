import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faUserCircle, 
  faWind,
  faBolt,
  faCog,
  faSignOutAlt,
  faUser,
  faChevronRight,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../context/UserContext.js';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

const MainLayout = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, setUsername } = useContext(UserContext);
  const [activeButton, setActiveButton] = useState(location.pathname.substring(1) || 'dashboard');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setShowSettings(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setUsername('');
    setShowDropdown(false);
    navigate('/login');
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const sidebarItems = [
    {
      title: '1 - Production',
      icon: faWind,
      path: '/production'
    },
    {
      title: '2 - Consumption',
      icon: faBolt,
      path: '/consumption'
    }
  ];

  const handleNavigation = (path) => {
    setActiveButton(path.toLowerCase());
    navigate(path);
    setShowDropdown(false);
    setShowSettings(false);
  };

  const getButtonStyle = (path) => ({
    width: '100%',
    padding: '12px 15px',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.3s ease',
    background: activeButton === path.toLowerCase()
      ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
      : 'transparent',
    '&:hover': {
      background: activeButton === path.toLowerCase()
        ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
        : 'linear-gradient(135deg, #2d3436 0%, #444444 100%)'
    }
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      {/* Sidebar */}
      <div style={{
        width: isSidebarOpen ? '250px' : '80px',
        backgroundColor: '#2d2d2d',
        color: 'white',
        transition: 'width 0.3s ease',
        overflowX: 'hidden'
      }}>
        {/* Sidebar Header */}
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {isSidebarOpen && <h2 style={{ margin: 0 }}>Dashboard</h2>}
          <FontAwesomeIcon
            icon={faBars}
            style={{ fontSize: '24px', cursor: 'pointer', color: '#fff' }}
            onClick={toggleSidebar}
          />
        </div>

        {/* Sidebar Menu */}
        <div style={{ padding: '20px 0' }}>
          {sidebarItems.map((item, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <button
                onClick={() => handleNavigation(item.path)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  background: activeButton === item.path.substring(1).toLowerCase()
                    ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
                    : 'transparent',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2d3436 0%, #444444 100%)'
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  style={{ 
                    marginRight: '10px',
                    color: '#4CAF50',
                    width: '20px',
                    height: '20px' 
                  }}
                />
                {isSidebarOpen && (
                  <span>{item.title}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', position: 'relative' }}>
        {/* Top Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '10px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ position: 'relative' }}>
            <div
              onClick={toggleDropdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '24px', marginRight: '8px' }} />
              <span>{username}</span>
            </div>

            {/* User Dropdown */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                padding: '10px 0',
                minWidth: '200px',
                zIndex: 1000
              }}>
                <button
                  onClick={handleSettingsClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 20px',
                    width: '100%',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={faCog} style={{ marginRight: '10px' }} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 20px',
                    width: '100%',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#dc3545'
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
