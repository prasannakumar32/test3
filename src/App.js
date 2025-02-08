import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Production from './components/Production';
import Consumption from './components/Consumption';
import Allocation from './components/Allocation';
import Layout from './components/Layout';
import ProductionSiteDetails from './components/ProductionSiteDetails';
import ConsumptionSiteDetails from './components/ConsumptionSiteDetails';
import SiteDetails from './components/SiteDetails';
import ErrorBoundary from './components/ErrorBoundary';
import { SiteProvider } from './context/SiteContext';
import { useInitializeStorage } from './hooks/useInitializeStorage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4
        }
      }
    }
  }
});

const PrivateRoute = ({ children }) => {
  const isAuthenticated = () => localStorage.getItem('token') !== null;
  return isAuthenticated() ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" />
  );
};

const AuthRoute = ({ children }) => {
  const isAuthenticated = () => localStorage.getItem('token') !== null;
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthRoute><Login /></AuthRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/",
    element: <PrivateRoute><Layout /></PrivateRoute>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "production",
        children: [
          {
            path: "",
            element: <Production />
          },
          {
            path: ":id",
            element: <ProductionSiteDetails />,
            errorElement: <ErrorBoundary />
          }
        ]
      },
      {
        path: "consumption",
        children: [
          {
            path: "",
            element: <Consumption />
          },
          {
            path: ":id",
            element: <ConsumptionSiteDetails />,
            errorElement: <ErrorBoundary />
          }
        ]
      },
      {
        path: "allocation",
        element: <Allocation />
      }
    ]
  }
]);

function AppContent() {
  // Initialize storage with default values
  useInitializeStorage();
  return (
    <SiteProvider>
      <RouterProvider router={router} />
    </SiteProvider>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
      <div id="modal-root" />
    </ThemeProvider>
  );
}

export default App;