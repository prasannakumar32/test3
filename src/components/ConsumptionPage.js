import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import productionApi, { consumptionApi } from '../services/productionApi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ConsumptionPage = () => {
  const [consumptionData, setConsumptionData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    month: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  const fetchConsumptionData = async () => {
    try {
      const response = await productionApi.getConsumptionData();
      if (response.success) {
        setConsumptionData(response.data);
      }
    } catch (error) {
      console.error('Error fetching consumption data:', error);
    }
  };

  const handleOpenForm = (data = null) => {
    if (data) {
      setEditData(data);
      setFormData({
        c1: data.c1,
        c2: data.c2,
        c3: data.c3,
        c4: data.c4,
        month: data.month,
        year: data.year
      });
    } else {
      setEditData(null);
      setFormData({
        c1: '',
        c2: '',
        c3: '',
        c4: '',
        month: '',
        year: new Date().getFullYear()
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditData(null);
    setFormData({
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      month: '',
      year: new Date().getFullYear()
    });
  };

  const handleSubmit = async () => {
    try {
      // Calculate total consumption and other metrics
      const total = parseFloat(formData.c1) + parseFloat(formData.c2) + 
                    parseFloat(formData.c3) + parseFloat(formData.c4);
      const dailyAverage = (total / 30).toFixed(2);
      const peakDemand = Math.max(
        parseFloat(formData.c1),
        parseFloat(formData.c2),
        parseFloat(formData.c3),
        parseFloat(formData.c4)
      );

      const newData = {
        ...formData,
        totalConsumption: total + ' units',
        dailyAverage: dailyAverage + ' units',
        peakDemand: peakDemand + ' units',
        c1: formData.c1 + ' units',
        c2: formData.c2 + ' units',
        c3: formData.c3 + ' units',
        c4: formData.c4 + ' units'
      };

      if (editData) {
        // Update existing record
        const updatedData = consumptionData.map(item =>
          item.month === editData.month && item.year === editData.year ? newData : item
        );
        setConsumptionData(updatedData);
      } else {
        // Add new record
        setConsumptionData([...consumptionData, newData]);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving consumption data:', error);
    }
  };

  const handleDelete = (data) => {
    const updatedData = consumptionData.filter(
      item => !(item.month === data.month && item.year === data.year)
    );
    setConsumptionData(updatedData);
  };

  const chartData = {
    labels: consumptionData.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'C1',
        data: consumptionData.map(item => parseFloat(item.c1)),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'C2',
        data: consumptionData.map(item => parseFloat(item.c2)),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      },
      {
        label: 'C3',
        data: consumptionData.map(item => parseFloat(item.c3)),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'C4',
        data: consumptionData.map(item => parseFloat(item.c4)),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Consumption Data
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenForm()}
        sx={{ mb: 3 }}
      >
        Enter New Data
      </Button>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month/Year</TableCell>
              <TableCell>C1 (units)</TableCell>
              <TableCell>C2 (units)</TableCell>
              <TableCell>C3 (units)</TableCell>
              <TableCell>C4 (units)</TableCell>
              <TableCell>Total Consumption (units)</TableCell>
              <TableCell>Daily Average (units)</TableCell>
              <TableCell>Peak Demand (units)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consumptionData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{`${row.month} ${row.year}`}</TableCell>
                <TableCell>{row.c1}</TableCell>
                <TableCell>{row.c2}</TableCell>
                <TableCell>{row.c3}</TableCell>
                <TableCell>{row.c4}</TableCell>
                <TableCell>{row.totalConsumption}</TableCell>
                <TableCell>{row.dailyAverage}</TableCell>
                <TableCell>{row.peakDemand}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(row)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{editData ? 'Edit Consumption Data' : 'Add New Consumption Data'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              fullWidth
            />
            <TextField
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              fullWidth
            />
            <TextField
              label="C1 (units)"
              type="number"
              value={formData.c1}
              onChange={(e) => setFormData({ ...formData, c1: e.target.value })}
              fullWidth
            />
            <TextField
              label="C2 (units)"
              type="number"
              value={formData.c2}
              onChange={(e) => setFormData({ ...formData, c2: e.target.value })}
              fullWidth
            />
            <TextField
              label="C3 (units)"
              type="number"
              value={formData.c3}
              onChange={(e) => setFormData({ ...formData, c3: e.target.value })}
              fullWidth
            />
            <TextField
              label="C4 (units)"
              type="number"
              value={formData.c4}
              onChange={(e) => setFormData({ ...formData, c4: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editData ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Consumption Trends
      </Typography>
      <Box sx={{ height: 400 }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Consumption (units)'
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Monthly Consumption Trends'
              },
              legend: {
                position: 'bottom'
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default ConsumptionPage;
