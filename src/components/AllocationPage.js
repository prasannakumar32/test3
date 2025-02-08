import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AllocationPage = () => {
  const [productionData, setProductionData] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);

  const handleCalculateAllocation = () => {
    // Handle calculation logic
  };

  const handleAddProduction = () => {
    // Handle adding production allocation
  };

  const handleAddConsumption = () => {
    // Handle adding consumption allocation
  };

  const tableHeaders = ['Month', 'Site', 'Quantity', 'Category', 'Status', 'Actions'];

  useEffect(() => {
    // Logic to fetch data from the consumption site data in local storage
    const storedConsumptionData = localStorage.getItem('consumptionSiteData');
    console.log('Stored Consumption Data:', storedConsumptionData); // Log the stored data
    if (storedConsumptionData) {
      const parsedData = JSON.parse(storedConsumptionData);
      console.log('Parsed Consumption Data:', parsedData); // Log the parsed data
      setConsumptionData(parsedData);
    }
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: '2rem', fontWeight: 'normal' }}>
        Resource Allocation
      </Typography>

      {/* Production Allocations */}
      <Box sx={{ mb: 4, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'normal' }}>
            Production Allocations
          </Typography>
          <IconButton 
            sx={{ 
              ml: 2, 
              bgcolor: '#1a237e', 
              color: 'white',
              '&:hover': { bgcolor: '#1a237e' }
            }}
            onClick={handleAddProduction}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productionData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.site}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button size="small" variant="text">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Consumption Allocations */}
      <Box sx={{ mb: 4, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'normal' }}>
            Consumption Allocations
          </Typography>
          <IconButton 
            sx={{ 
              ml: 2, 
              bgcolor: '#1a237e', 
              color: 'white',
              '&:hover': { bgcolor: '#1a237e' }
            }}
            onClick={handleAddConsumption}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {consumptionData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.site}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button size="small" variant="text">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Calculate Allocation Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleCalculateAllocation}
          sx={{
            bgcolor: '#e0e0e0',
            color: 'black',
            '&:hover': { bgcolor: '#d5d5d5' },
            px: 4,
            py: 1
          }}
        >
          CALCULATE ALLOCATION
        </Button>
      </Box>
    </Box>
  );
};

export default AllocationPage;
