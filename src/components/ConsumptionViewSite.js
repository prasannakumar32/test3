import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import productionService from '../services/productionService';

const ConsumptionViewSite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historicalData, setHistoricalData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    month: '',
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c5: ''
  });

  useEffect(() => {
    const loadData = () => {
      // Initialize historical data if not present
      const storedData = localStorage.getItem('historicalProductionData');
      if (!storedData) {
        productionService.initializeHistoricalData();
      }
      
      // Load historical data for this site
      const data = JSON.parse(localStorage.getItem('historicalProductionData') || '[]')
        .filter(item => item.site_id === 'CS2')  // Hardcode the site ID to match exactly
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      console.log('Loaded historical data:', data);  // Debug log
      setHistoricalData(data);
    };

    loadData();
  }, []);

  const handleOpenForm = () => {
    setFormData({
      month: '',
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      c5: ''
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSubmit = () => {
    // Add the new data to historical data
    const newEntry = {
      site_id: 'CS2',
      timestamp: new Date().toISOString(),
      month_year: formData.month,
      c1: parseFloat(formData.c1) || 0,
      c2: parseFloat(formData.c2) || 0,
      c3: parseFloat(formData.c3) || 0,
      c4: parseFloat(formData.c4) || 0,
      c5: parseFloat(formData.c5) || 0,
      total_consumption: parseFloat(formData.c1) + parseFloat(formData.c2) + parseFloat(formData.c3) + parseFloat(formData.c4) + parseFloat(formData.c5),
      type: 'consumption'
    };

    const updatedData = JSON.parse(localStorage.getItem('historicalProductionData') || '[]');
    updatedData.push(newEntry);
    localStorage.setItem('historicalProductionData', JSON.stringify(updatedData));

    setHistoricalData(prev => [...prev, newEntry].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    handleCloseForm();
  };

  const handleDelete = (month) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setHistoricalData(historicalData.filter(item => item.month_year !== month));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Historical Data</Typography>
          <Box>
            <Button 
              variant={chartType === 'line' ? 'contained' : 'outlined'} 
              onClick={() => setChartType('line')}
              sx={{ mr: 1 }}
            >
              Line Chart
            </Button>
            <Button 
              variant={chartType === 'bar' ? 'contained' : 'outlined'} 
              onClick={() => setChartType('bar')}
              sx={{ mr: 1 }}
            >
              Bar Chart
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpenForm}>
              + ENTER NEW DATA
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: 400 }}>
          {chartType === 'line' ? (
            <LineChart
              width={1000}
              height={400}
              data={historicalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month_year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="c1" stroke="#8884d8" name="C1" />
              <Line type="monotone" dataKey="c2" stroke="#82ca9d" name="C2" />
              <Line type="monotone" dataKey="c3" stroke="#ffc658" name="C3" />
              <Line type="monotone" dataKey="c4" stroke="#ff7300" name="C4" />
              <Line type="monotone" dataKey="c5" stroke="#ff0000" name="C5" />
            </LineChart>
          ) : (
            <BarChart
              width={1000}
              height={400}
              data={historicalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month_year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="c1" fill="#8884d8" name="C1" />
              <Bar dataKey="c2" fill="#82ca9d" name="C2" />
              <Bar dataKey="c3" fill="#ffc658" name="C3" />
              <Bar dataKey="c4" fill="#ff7300" name="C4" />
              <Bar dataKey="c5" fill="#ff0000" name="C5" />
            </BarChart>
          )}
        </Box>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>C1</TableCell>
                <TableCell>C2</TableCell>
                <TableCell>C3</TableCell>
                <TableCell>C4</TableCell>
                <TableCell>C5</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historicalData.map((row) => (
                <TableRow key={row.timestamp}>
                  <TableCell>{row.month_year}</TableCell>
                  <TableCell>{row.c1.toFixed(2)}</TableCell>
                  <TableCell>{row.c2.toFixed(2)}</TableCell>
                  <TableCell>{row.c3.toFixed(2)}</TableCell>
                  <TableCell>{row.c4.toFixed(2)}</TableCell>
                  <TableCell>{row.c5.toFixed(2)}</TableCell>
                  <TableCell>{row.total_consumption.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(row.month_year)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>Enter New Consumption Data</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField fullWidth label="Month" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C1 Consumption (Units)" type="number" value={formData.c1} onChange={(e) => setFormData({ ...formData, c1: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C2 Consumption (Units)" type="number" value={formData.c2} onChange={(e) => setFormData({ ...formData, c2: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C3 Consumption (Units)" type="number" value={formData.c3} onChange={(e) => setFormData({ ...formData, c3: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C4 Consumption (Units)" type="number" value={formData.c4} onChange={(e) => setFormData({ ...formData, c4: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C5 Consumption (Units)" type="number" value={formData.c5} onChange={(e) => setFormData({ ...formData, c5: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsumptionViewSite;
