import React, { useState } from 'react';
import Layout from './Layout.js';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import productionApi from '../services/productionApi.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GenerateReport = () => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [windMill, setWindMill] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const windMills = [
    { id: 'WM001', name: 'Wind Mill 1' },
    { id: 'WM002', name: 'Wind Mill 2' },
    { id: 'WM003', name: 'Wind Mill 3' },
    { id: 'WM004', name: 'Wind Mill 4' }
  ];

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await productionApi.generateReport({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        windMill
      });
      setReportData(data);
    } catch (err) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Power Generation and Consumption Report',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Power (units)'
        }
      }
    }
  };

  const getChartData = () => {
    if (!reportData) return null;

    const labels = reportData.timeSlots || [];
    return {
      labels,
      datasets: [
        {
          label: 'Production',
          data: reportData.production || [],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Consumption',
          data: reportData.consumption || [],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Banking',
          data: reportData.banking || [],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Generate Report
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleGenerateReport}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Wind Mill</InputLabel>
                  <Select
                    value={windMill}
                    onChange={(e) => setWindMill(e.target.value)}
                    label="Wind Mill"
                  >
                    {windMills.map((wm) => (
                      <MenuItem key={wm.id} value={wm.id}>{wm.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {reportData && (
          <>
            {/* Bar Chart */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Power Generation and Consumption Chart
              </Typography>
              <Box sx={{ height: 400 }}>
                <Bar options={chartOptions} data={getChartData()} />
              </Box>
            </Paper>

            {/* Tabular Report */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detailed Report
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time Slot</TableCell>
                      <TableCell align="right">Production (units)</TableCell>
                      <TableCell align="right">Consumption (units)</TableCell>
                      <TableCell align="right">Lapse (units)</TableCell>
                      <TableCell align="right">Allocation (units)</TableCell>
                      <TableCell align="right">Banking (units)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(reportData.timeSlots || []).map((timeSlot, index) => (
                      <TableRow key={timeSlot}>
                        <TableCell>{timeSlot}</TableCell>
                        <TableCell align="right">
                          {reportData.production?.[index]?.toFixed(2) || 0}
                        </TableCell>
                        <TableCell align="right">
                          {reportData.consumption?.[index]?.toFixed(2) || 0}
                        </TableCell>
                        <TableCell align="right">
                          {reportData.lapse?.[index]?.toFixed(2) || 0}
                        </TableCell>
                        <TableCell align="right">
                          {reportData.allocation?.[index]?.toFixed(2) || 0}
                        </TableCell>
                        <TableCell align="right">
                          {reportData.banking?.[index]?.toFixed(2) || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Summary Row */}
                    <TableRow>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell align="right"><strong>
                        {reportData.production?.reduce((a, b) => a + b, 0).toFixed(2) || 0}
                      </strong></TableCell>
                      <TableCell align="right"><strong>
                        {reportData.consumption?.reduce((a, b) => a + b, 0).toFixed(2) || 0}
                      </strong></TableCell>
                      <TableCell align="right"><strong>
                        {reportData.lapse?.reduce((a, b) => a + b, 0).toFixed(2) || 0}
                      </strong></TableCell>
                      <TableCell align="right"><strong>
                        {reportData.allocation?.reduce((a, b) => a + b, 0).toFixed(2) || 0}
                      </strong></TableCell>
                      <TableCell align="right"><strong>
                        {reportData.banking?.reduce((a, b) => a + b, 0).toFixed(2) || 0}
                      </strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default GenerateReport;
