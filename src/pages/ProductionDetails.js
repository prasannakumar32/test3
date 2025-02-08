import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  Speed,
  Power,
  Business,
  CheckCircle,
  AccountBalance,
  ArrowBack,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment,
  Business as BusinessIcon,
  Bolt,
  Category,
  ShowChart,
  Settings,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { 
  MOCK_SITE_DETAILS, 
  MOCK_HISTORICAL_DATA,
  deleteProductionData,
  productionService 
} from '../services/productionService';
import ProductionDataForm from '../components/forms/ProductionDataForm';

const ProductionDetails = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [siteDetails, setSiteDetails] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [activeTab, setActiveTab] = useState('production');
  const [chartType, setChartType] = useState('line');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    // Initialize historical data if not present
    const historicalData = localStorage.getItem('historicalProductionData');
    if (!historicalData) {
      productionService.initializeHistoricalData();
    }
    
    // Get site details
    const site = MOCK_SITE_DETAILS[siteId];
    setSiteDetails(site);

    // Get historical data
    const data = JSON.parse(localStorage.getItem('historicalProductionData') || '[]')
      .filter(item => item.site_id === siteId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setHistoricalData(data);
  }, [siteId]);

  const handleAddNew = () => {
    setSelectedData(null);
    setFormOpen(true);
  };

  const handleEdit = (data) => {
    setSelectedData(data);
    setFormOpen(true);
  };

  const handleDelete = async (month, year) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteProductionData(siteId, month, year);
        // Refresh data after deletion
        const newData = historicalData.filter(
          item => !(item.month === month && item.year === year)
        );
        setHistoricalData(newData);
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      await productionService.updateProductionData(siteId, formData.month, formData.year, formData);
      // Refresh data after update
      const newData = selectedData
        ? historicalData.map(item => 
            item.month === formData.month && item.year === formData.year
              ? formData
              : item
          )
        : [...historicalData, formData];
      setHistoricalData(newData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const renderChart = () => {
    if (chartType === 'line') {
      return (
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
          {activeTab === 'production' ? (
            // Production Metrics Lines
            <>
              <Line type="monotone" dataKey="c1" stroke="#8884d8" name="C1" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c2" stroke="#82ca9d" name="C2" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c3" stroke="#ffc658" name="C3" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c4" stroke="#ff7300" name="C4" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c5" stroke="#ff0000" name="C5" dot={{ r: 4 }} />
            </>
          ) : (
            // Charges Metrics Lines
            <>
              <Line type="monotone" dataKey="c001" stroke="#8884d8" name="C001" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c002" stroke="#82ca9d" name="C002" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c003" stroke="#ffc658" name="C003" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c004" stroke="#ff7300" name="C004" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c005" stroke="#ff0000" name="C005" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c006" stroke="#00ff00" name="C006" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c007" stroke="#0000ff" name="C007" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="c008" stroke="#purple" name="C008" dot={{ r: 4 }} />
            </>
          )}
        </LineChart>
      );
    } else {
      return (
        <BarChart
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
          {activeTab === 'production' ? (
            // Production Metrics Bars
            <>
              <Bar dataKey="c1" fill="#8884d8" name="C1" />
              <Bar dataKey="c2" fill="#82ca9d" name="C2" />
              <Bar dataKey="c3" fill="#ffc658" name="C3" />
              <Bar dataKey="c4" fill="#ff7300" name="C4" />
              <Bar dataKey="c5" fill="#ff0000" name="C5" />
            </>
          ) : (
            // Charges Metrics Bars
            <>
              <Bar dataKey="c001" fill="#8884d8" name="C001" />
              <Bar dataKey="c002" fill="#82ca9d" name="C002" />
              <Bar dataKey="c003" fill="#ffc658" name="C003" />
              <Bar dataKey="c004" fill="#ff7300" name="C004" />
              <Bar dataKey="c005" fill="#ff0000" name="C005" />
              <Bar dataKey="c006" fill="#00ff00" name="C006" />
              <Bar dataKey="c007" fill="#0000ff" name="C007" />
              <Bar dataKey="c008" fill="purple" name="C008" />
            </>
          )}
        </BarChart>
      );
    }
  };

  if (!siteDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Back Navigation */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        <Typography variant="h5" sx={{ ml: 2 }}>
          {siteDetails.name} - Production Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Site Information - Left Side */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Site Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Business />
                </ListItemIcon>
                <ListItemText
                  primary="Site"
                  secondary={siteDetails.name}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText
                  primary="Location"
                  secondary={siteDetails.location}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Power />
                </ListItemIcon>
                <ListItemText
                  primary="Capacity"
                  secondary={`${siteDetails.capacity} ${siteDetails.capacityUnit}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Speed />
                </ListItemIcon>
                <ListItemText
                  primary="Grid"
                  secondary="Tamil Nadu Grid"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText
                  primary="Status"
                  secondary={siteDetails.status}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccountBalance />
                </ListItemIcon>
                <ListItemText
                  primary="Banking"
                  secondary={siteDetails.banking ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Assignment />
                </ListItemIcon>
                <ListItemText
                  primary="Service Number/REC"
                  secondary={`${siteDetails.serviceNumber}${siteDetails.isRec ? '/REC' : '/NonREC'}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Company Name"
                  secondary={siteDetails.companyName}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Bolt />
                </ListItemIcon>
                <ListItemText
                  primary="Injection Voltage"
                  secondary={`${siteDetails.injectionVoltage} kV`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Category />
                </ListItemIcon>
                <ListItemText
                  primary="Category/Type of SS"
                  secondary={`${siteDetails.category}/${siteDetails.typeOfSS}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ShowChart />
                </ListItemIcon>
                <ListItemText
                  primary="Net Generation"
                  secondary={`${siteDetails.netGeneration} units`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText
                  primary="Machine Capacity"
                  secondary={`${siteDetails.machineCapacity} ${siteDetails.capacityUnit}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Historical Production Chart - Right Side */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNew}
            >
              + ENTER NEW DATA
            </Button>
          </Box>

          <Card>
            <CardContent>
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                >
                  <Tab label="PRODUCTION METRICS" value="production" />
                  <Tab label="CHARGES METRICS" value="charges" />
                </Tabs>
              </Box>

              {/* Chart Type Selection */}
              <Box sx={{ mb: 2 }}>
                <Button 
                  variant={chartType === 'line' ? 'contained' : 'outlined'}
                  onClick={() => setChartType('line')}
                  sx={{ mr: 1 }}
                >
                  LINE CHART
                </Button>
                <Button 
                  variant={chartType === 'bar' ? 'contained' : 'outlined'}
                  onClick={() => setChartType('bar')}
                >
                  BAR CHART
                </Button>
              </Box>

              {/* Chart */}
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                  {renderChart()}
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Production History Table */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Production History
            </Typography>
            <Paper sx={{ width: '100%', overflow: 'auto' }}>
              <Box sx={{ minWidth: 800 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Year</th>
                      <th>C1</th>
                      <th>C2</th>
                      <th>C3</th>
                      <th>C4</th>
                      <th>C5</th>
                      <th>C001</th>
                      <th>C002</th>
                      <th>C003</th>
                      <th>C004</th>
                      <th>C005</th>
                      <th>C006</th>
                      <th>C007</th>
                      <th>C008</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.month}</td>
                        <td>{row.year}</td>
                        <td>{row.c1}</td>
                        <td>{row.c2}</td>
                        <td>{row.c3}</td>
                        <td>{row.c4}</td>
                        <td>{row.c5}</td>
                        <td>{row.c001}</td>
                        <td>{row.c002}</td>
                        <td>{row.c003}</td>
                        <td>{row.c004}</td>
                        <td>{row.c005}</td>
                        <td>{row.c006}</td>
                        <td>{row.c007}</td>
                        <td>{row.c008}</td>
                        <td>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(row)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error"
                            onClick={() => handleDelete(row.month, row.year)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <ProductionDataForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedData}
      />
    </Box>
  );
};

export default ProductionDetails; 