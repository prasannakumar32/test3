import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Speed as SpeedIcon,
  Numbers as ServiceNumberIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GridOn as GridIcon,
  CheckCircle as StatusIcon,
  Percent as PercentIcon
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
  Bar
} from 'recharts';
import {
  getConsumptionSiteById,
  getConsumptionHistory
} from '../utils/consumptionStorage';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function ConsumptionSiteDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [openDialog, setOpenDialog] = useState(false);
  const [newData, setNewData] = useState({
    month: '',
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c5: ''
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSite = async () => {
      setLoading(true);
      try {
        console.log('Site ID:', id);
        const siteData = await getConsumptionSiteById(id);
        const historicalData = await getConsumptionHistory(id);
        if (siteData) {
          setSite({
            ...siteData,
            historicalData: historicalData
          });
        } else {
          setError('Site not found');
        }
      } catch (error) {
        setError('Error loading site data');
      } finally {
        setLoading(false);
      }
    };
    loadSite();
  }, [id]);

  const getDataKeys = () => ['c1', 'c2', 'c3', 'c4', 'c5', 'total'];

  const calculateTotal = (row) => {
    const sum = ['c1', 'c2', 'c3', 'c4', 'c5'].reduce((acc, key) => acc + (row[key] || 0), 0);
    return Math.round(sum * 100) / 100; // Round to 2 decimal places
  };

  const getData = () => {
    if (!site.historicalData) return [];
    return site.historicalData.map(row => ({
      ...row,
      total: calculateTotal(row)
    }));
  };

  // Calculate overall totals for the summary
  const getOverallTotals = () => {
    const data = getData();
    const totals = {
      c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, total: 0
    };
    
    data.forEach(row => {
      ['c1', 'c2', 'c3', 'c4', 'c5'].forEach(key => {
        totals[key] += row[key] || 0;
      });
    });
    
    totals.total = calculateTotal(totals);
    return totals;
  };

  const handleOpenDialog = () => {
    setNewData({
      month: '',
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      c5: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (field) => (event) => {
    setNewData({
      ...newData,
      [field]: event.target.value
    });
  };

  const handleSubmit = () => {
    const newEntry = {
      month: newData.month,
      c1: Number(newData.c1) || 0,
      c2: Number(newData.c2) || 0,
      c3: Number(newData.c3) || 0,
      c4: Number(newData.c4) || 0,
      c5: Number(newData.c5) || 0
    };

    setSite({
      ...site,
      historicalData: [...site.historicalData, newEntry]
    });

    handleCloseDialog();
  };

  const handleEditClick = (data) => {
    setSelectedData(data);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setSelectedData(null);
    setEditDialogOpen(false);
  };

  const handleEditSave = async (editedData) => {
    try {
      const updatedHistory = site.historicalData.map(row => 
        row.month === selectedData.month ? {
          ...row,
          ...editedData,
          c1: parseInt(editedData.c1) || 0,
          c2: parseInt(editedData.c2) || 0,
          c3: parseInt(editedData.c3) || 0,
          c4: parseInt(editedData.c4) || 0,
          c5: parseInt(editedData.c5) || 0
        } : row
      );
      
      setSite({
        ...site,
        historicalData: updatedHistory
      });
      
      handleEditClose();
    } catch (error) {
      console.error('Error updating historical data:', error);
    }
  };

  const handleDeleteClick = (data) => {
    setSelectedData(data);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteClose = () => {
    setSelectedData(null);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const updatedHistory = site.historicalData.filter(row => row.month !== selectedData.month);
      setSite({
        ...site,
        historicalData: updatedHistory
      });
      handleDeleteClose();
    } catch (error) {
      console.error('Error deleting historical data:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!site) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/consumption')}
              sx={{ mb: 2 }}
            >
              Back to Consumption Sites
            </Button>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {site.name}
            </Typography>
          </Grid>

          {/* Main Content Area */}
          <Grid container item xs={12} spacing={3}>
            {/* Left Side - Site Information */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Site Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon sx={{ color: '#1976d2' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Name"
                      secondary={site.name}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon sx={{ color: '#2e7d32' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Location"
                      secondary={site.location}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <SpeedIcon sx={{ color: '#ed6c02' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Type"
                      secondary={site.type}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <GridIcon sx={{ color: '#d32f2f' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Grid"
                      secondary="TANGEDCO"
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <StatusIcon sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Status"
                      secondary={site.status}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <PercentIcon sx={{ color: '#0288d1' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Consumption Ratio"
                      secondary={site.consumption_ratio === 0.5 ? '2' : '1'}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <ServiceNumberIcon sx={{ color: '#9c27b0' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Service Number"
                      secondary={site.serviceNumber}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Right Side - Graph */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Typography variant="h6">
                    Historical Consumption Graph
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    sx={{ 
                      bgcolor: 'primary.dark', 
                      '&:hover': { 
                        bgcolor: 'primary.main' 
                      }
                    }}
                  >
                    ENTER NEW DATA
                  </Button>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  mb: 2 
                }}>
                  <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={(e, value) => value && setChartType(value)}
                    size="small"
                  >
                    <ToggleButton value="line">LINE</ToggleButton>
                    <ToggleButton value="bar">BAR</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Box sx={{ height: 400, width: '100%' }}>
                  <ResponsiveContainer>
                    {chartType === 'line' ? (
                      <LineChart data={getData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {getDataKeys().map((key, index) => (
                          <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            name={key.toUpperCase()}
                            stroke={key === 'total' ? '#000' : getRandomColor(index)}
                            strokeWidth={key === 'total' ? 2 : 1}
                            dot={{ r: key === 'total' ? 6 : 4 }}
                          />
                        ))}
                      </LineChart>
                    ) : (
                      <BarChart data={getData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {getDataKeys().map((key, index) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            name={key.toUpperCase()}
                            fill={key === 'total' ? '#000' : getRandomColor(index)}
                            opacity={key === 'total' ? 1 : 0.8}
                          />
                        ))}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Historical Data Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Historical Consumption Data</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ bgcolor: 'primary.dark', '&:hover': { bgcolor: 'primary.main' } }}
                >
                  ENTER NEW DATA
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      {getDataKeys().map((key) => (
                        <TableCell 
                          key={key} 
                          align="right"
                        >
                          {key.toUpperCase()}
                        </TableCell>
                      ))}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getData().map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.month}</TableCell>
                        {getDataKeys().map((key) => (
                          <TableCell 
                            key={key} 
                            align="right"
                          >
                            {row[key]?.toLocaleString() || '0'}
                          </TableCell>
                        ))}
                        <TableCell>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: '#2196f3',
                              '&:hover': {
                                backgroundColor: 'rgba(33, 150, 243, 0.08)'
                              }
                            }}
                            onClick={() => handleEditClick(row)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small"
                            sx={{ 
                              color: '#f44336',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.08)'
                              }
                            }}
                            onClick={() => handleDeleteClick(row)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

        </Grid>

        {/* Data Entry Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Enter New Data</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                select
                label="Month"
                value={newData.month}
                onChange={handleInputChange('month')}
                fullWidth
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: 2 
              }}>
                {['c1', 'c2', 'c3', 'c4', 'c5'].map((field) => (
                  <TextField
                    key={field}
                    label={field.toUpperCase()}
                    type="number"
                    value={newData[field]}
                    onChange={handleInputChange(field)}
                    fullWidth
                  />
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={!newData.month}
              sx={{ bgcolor: 'primary.dark', '&:hover': { bgcolor: 'primary.main' } }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Historical Data</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                label="Month"
                fullWidth
                value={selectedData?.month || ''}
                margin="normal"
                name="month"
                onChange={(e) => {
                  setSelectedData({
                    ...selectedData,
                    month: e.target.value
                  });
                }}
              />
              {['c1', 'c2', 'c3', 'c4', 'c5'].map((field) => (
                <TextField
                  key={field}
                  label={`${field.toUpperCase()} ${field === 'c3' || field === 'c4' ? '(Peak)' : '(Non-Peak)'}`}
                  fullWidth
                  type="number"
                  value={selectedData?.[field] || ''}
                  margin="normal"
                  name={field}
                  onChange={(e) => {
                    setSelectedData({
                      ...selectedData,
                      [field]: e.target.value
                    });
                  }}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button 
              onClick={() => handleEditSave(selectedData)} 
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this historical data entry? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

const getRandomColor = (index) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];
  return colors[index];
};

export default ConsumptionSiteDetails;
