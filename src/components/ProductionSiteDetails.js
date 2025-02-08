import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  ArrowBackIcon,
  AddIcon,
  EditIcon,
  DeleteIcon
} from '../utils/icons';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ProductionDataEntryForm from './ProductionDataEntryForm';
import { getProductionSiteById, updateHistoricalData } from '../utils/productionStorage';

const ProductionSiteDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productionData, setProductionData] = useState(null);
  const [siteName, setSiteName] = useState('');
  const [chartData, setChartData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('2024-2025');
  const [filteredData, setFilteredData] = useState({ units: [], charges: [] });
  const [isInitialized, setIsInitialized] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState('add');

  const months = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ];

  const financialYears = [
    '2024-2025', '2025-2026', '2026-2027', '2027-2028', '2028-2029'
  ];

  const getEmptyData = () => ({
    units: months.map(month => ({
      month,
      c1: 0,
      c2: 0,
      c3: 0,
      c4: 0,
      c5: 0
    })),
    charges: months.map(month => ({
      month,
      c001: 0,
      c002: 0,
      c003: 0,
      c004: 0,
      c005: 0,
      c006: 0,
      c007: 0,
      c008: 0
    }))
  });

  // Load site data
  useEffect(() => {
    const loadSiteData = async () => {
      try {
        const site = await getProductionSiteById(id);
        if (site) {
          setSiteName(site.name);
          // Initialize with empty data structure if no historical data exists
          const initialData = site.historicalData || getEmptyData();
          
          // Ensure all months have data with zeros for missing values
          const normalizedData = {
            units: months.map(month => {
              const existingData = (initialData.units || []).find(d => d.month === month);
              return existingData || {
                month,
                c1: 0,
                c2: 0,
                c3: 0,
                c4: 0,
                c5: 0
              };
            }),
            charges: months.map(month => {
              const existingData = (initialData.charges || []).find(d => d.month === month);
              return existingData || {
                month,
                c001: 0,
                c002: 0,
                c003: 0,
                c004: 0,
                c005: 0,
                c006: 0,
                c007: 0,
                c008: 0
              };
            })
          };
          
          setProductionData(normalizedData);
          setFilteredData(normalizedData);
          setChartData(selectedTab === 0 ? normalizedData.units : normalizedData.charges);
          setIsInitialized(true);
        } else {
          console.error('Site not found:', id);
          navigate('/production');
        }
      } catch (error) {
        console.error('Error loading site data:', error);
        // Initialize with empty data on error
        const emptyData = getEmptyData();
        setProductionData(emptyData);
        setFilteredData(emptyData);
        setChartData(selectedTab === 0 ? emptyData.units : emptyData.charges);
      }
    };

    loadSiteData();
  }, [id, navigate, selectedTab]);

  // Apply filters when data changes
  useEffect(() => {
    if (!productionData) {
      const emptyData = getEmptyData();
      setFilteredData(emptyData);
      return;
    }

    const filtered = {
      units: (productionData.units || []).filter(row => {
        if (selectedMonth === 'All') return true;
        return row.month === selectedMonth;
      }).map(row => ({
        ...row,
        c1: row.c1 || 0,
        c2: row.c2 || 0,
        c3: row.c3 || 0,
        c4: row.c4 || 0,
        c5: row.c5 || 0
      })),
      charges: (productionData.charges || []).filter(row => {
        if (selectedMonth === 'All') return true;
        return row.month === selectedMonth;
      }).map(row => ({
        ...row,
        c001: row.c001 || 0,
        c002: row.c002 || 0,
        c003: row.c003 || 0,
        c004: row.c004 || 0,
        c005: row.c005 || 0,
        c006: row.c006 || 0,
        c007: row.c007 || 0,
        c008: row.c008 || 0
      }))
    };
    setFilteredData(filtered);
  }, [selectedMonth, selectedFinancialYear, productionData]);

  // Update chart data when tab changes
  useEffect(() => {
    if (!productionData) {
      const emptyData = getEmptyData();
      setChartData(selectedTab === 0 ? emptyData.units : emptyData.charges);
      return;
    }
    setChartData(selectedTab === 0 ? productionData.units : productionData.charges);
  }, [selectedTab, productionData]);

  // Calculate totals for each row
  useEffect(() => {
    if (productionData) {
      const dataWithTotals = {
        units: productionData.units.map(row => ({
          ...row,
          total: ['c1', 'c2', 'c3', 'c4', 'c5'].reduce((sum, key) => sum + (Number(row[key]) || 0), 0)
        })),
        charges: productionData.charges.map(row => ({
          ...row,
          total: ['c001', 'c002', 'c003', 'c004', 'c005', 'c006', 'c007', 'c008']
            .reduce((sum, key) => sum + (Number(row[key]) || 0), 0)
        }))
      };
      setProductionData(dataWithTotals);
    }
  }, [productionData]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleYearChange = (event) => {
    setSelectedFinancialYear(event.target.value);
  };

  const handleBack = () => {
    navigate('/production');
  };

  const getDataKeys = () => {
    if (selectedTab === 0) {
      return ['c1', 'c2', 'c3', 'c4', 'c5'];
    }
    return ['c001', 'c002', 'c003', 'c004', 'c005', 'c006', 'c007', 'c008'];
  };

  const colors = ['#1a237e', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', '#0088FE', '#00C49F', '#FFBB28'];

  const renderChart = () => {
    if (!chartData || chartData.length === 0) return null;

    const dataKeys = selectedTab === 0 
      ? ['c1', 'c2', 'c3', 'c4', 'c5', 'total']
      : ['c001', 'c002', 'c003', 'c004', 'c005', 'c006', 'c007', 'c008', 'total'];

    const colors = [
      '#1a237e', '#303f9f', '#3f51b5', '#5c6bc0', '#7986cb',
      '#9fa8da', '#c5cae9', '#e8eaf6', '#ff4081'
    ];

    const maxValue = Math.max(
      ...chartData.map(item =>
        Math.max(...dataKeys.map(key => Number(item[key]) || 0))
      )
    );

    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, maxValue > 0 ? maxValue + 10 : 10]} />
          <Tooltip />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={key === 'total' ? '#ff4081' : colors[index]}
              strokeWidth={key === 'total' ? 2 : 1}
              dot={key === 'total' ? { r: 4, fill: '#ff4081' } : { r: 3 }}
              name={key === 'total' ? 'Total' : key.toUpperCase()}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const handleOpenForm = (mode = 'add', data = null) => {
    setFormMode(mode);
    setEditData(data);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditData(null);
    setFormMode('add');
  };

  const handleSaveData = async (formData) => {
    const updatedData = { ...productionData };
    const dataType = selectedTab === 0 ? 'units' : 'charges';
    
    if (formMode === 'add') {
      if (!updatedData[dataType]) {
        updatedData[dataType] = [];
      }
      updatedData[dataType].push(formData);
    } else if (formMode === 'edit' && editData) {
      updatedData[dataType] = updatedData[dataType].map(item =>
        item.month === editData.month ? formData : item
      );
    }
    
    try {
      // Update the production data state
      setProductionData(updatedData);
      
      // Update the historical data in storage
      await updateHistoricalData(id, updatedData);
      
      handleCloseForm();
    } catch (error) {
      console.error('Error saving production data:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleEdit = (month) => {
    const data = selectedTab === 0 
      ? productionData.units.find(row => row.month === month)
      : productionData.charges.find(row => row.month === month);
    handleOpenForm('edit', data);
  };

  const handleDelete = async (month) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedData = { ...productionData };
      const dataType = selectedTab === 0 ? 'units' : 'charges';
      updatedData[dataType] = updatedData[dataType].filter(item => item.month !== month);
      
      try {
        // Update the production data state
        setProductionData(updatedData);
        
        // Update the historical data in storage
        await updateHistoricalData(id, updatedData);
      } catch (error) {
        console.error('Error deleting production data:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Production Site
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#1a237e',
              fontWeight: 500,
              mr: 1
            }}
          >
            Site:
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#1a237e',
              fontWeight: 500
            }}
          >
            {siteName}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ color: '#1a237e' }}>
                  Historical Production Graph
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#1a237e' }}>
                  {selectedTab === 0 ? 'Unit Matrix Data' : 'Charges Matrix Data'}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenForm('add')}
                  sx={{
                    backgroundColor: '#1a237e',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#0d47a1'
                    }
                  }}
                >
                  Enter New Data
                </Button>
              </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Unit Matrix" />
                <Tab label="Charges Matrix" />
              </Tabs>
            </Box>

            <Box sx={{ height: 400, mb: 6 }}>
              {renderChart()}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" sx={{ mb: 3, color: '#1a237e', textAlign: 'left' }}>
              Historical Production Data
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              mb: 3,
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  size="small"
                  label="Month"
                >
                  <MenuItem value="All">All Months</MenuItem>
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Financial Year</InputLabel>
                <Select
                  value={selectedFinancialYear}
                  onChange={(e) => setSelectedFinancialYear(e.target.value)}
                  size="small"
                  label="Financial Year"
                >
                  {financialYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell align="center">Month</TableCell>
                    {selectedTab === 0 ? (
                      <>
                        <TableCell align="center">C1</TableCell>
                        <TableCell align="center">C2</TableCell>
                        <TableCell align="center">C3</TableCell>
                        <TableCell align="center">C4</TableCell>
                        <TableCell align="center">C5</TableCell>
                        <TableCell align="center">Total</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell align="center">C001</TableCell>
                        <TableCell align="center">C002</TableCell>
                        <TableCell align="center">C003</TableCell>
                        <TableCell align="center">C004</TableCell>
                        <TableCell align="center">C005</TableCell>
                        <TableCell align="center">C006</TableCell>
                        <TableCell align="center">C007</TableCell>
                        <TableCell align="center">C008</TableCell>
                        <TableCell align="center">Total</TableCell>
                      </>
                    )}
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(selectedTab === 0 ? filteredData.units : filteredData.charges).map((row) => {
                    const total = Object.keys(row)
                      .filter(key => key !== 'month')
                      .reduce((sum, key) => sum + (row[key] || 0), 0);
                    return (
                      <TableRow 
                        key={row.month}
                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        <TableCell align="center">{row.month}</TableCell>
                        {selectedTab === 0 ? (
                          <>
                            <TableCell align="center">{Math.round(row.c1) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c2) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c3) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c4) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c5) || 0}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell align="center">{Math.round(row.c001) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c002) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c003) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c004) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c005) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c006) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c007) || 0}</TableCell>
                            <TableCell align="center">{Math.round(row.c008) || 0}</TableCell>
                          </>
                        )}
                        <TableCell align="center">{Math.round(total) || 0}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row.month)}
                            sx={{ 
                              mr: 1,
                              color: '#1a237e',
                              '&:hover': {
                                backgroundColor: '#1a237e10'
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row.month)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1a237e', color: 'white' }}>
          {formMode === 'add' ? 'Add New Production Data' : 'Edit Production Data'}
        </DialogTitle>
        <DialogContent>
          <ProductionDataEntryForm
            type={selectedTab === 0 ? 'units' : 'charges'}
            onSave={handleSaveData}
            onCancel={handleCloseForm}
            initialData={editData}
            mode={formMode}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ProductionSiteDetails;
