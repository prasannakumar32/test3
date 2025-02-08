import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
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
import productionService from '../services/productionService';

const formatMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const formatData = (historicalData, siteId, type) => {
  if (!historicalData) return [];

  const siteData = historicalData
    .filter(item => item.site_id === siteId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map(item => ({
      month: formatMonthYear(item.timestamp),
      c1: item.c1 || 0,
      c2: item.c2 || 0,
      c3: item.c3 || 0,
      c4: item.c4 || 0,
      c5: item.c5 || 0,
      total: type === 'production' ? item.total_generation : item.total_consumption || 0
    }));

  return siteData;
};

export default function HistoricalGraph({ site, type }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    // Initialize historical data if not present
    const storedData = localStorage.getItem('historicalProductionData');
    if (!storedData) {
      productionService.initializeHistoricalData();
    }
    
    // Load historical data
    const data = JSON.parse(localStorage.getItem('historicalProductionData') || '[]');
    setHistoricalData(formatData(data, site.id, type));
  }, [site.id, type]);

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Historical Data</Typography>
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
          >
            Bar Chart
          </Button>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 400, mb: 3 }}>
        <ResponsiveContainer>
          {chartType === 'line' ? (
            <LineChart
              data={historicalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
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
              data={historicalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
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
        </ResponsiveContainer>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Month</TableCell>
              <TableCell align="right">C1 (Non-Peak)</TableCell>
              <TableCell align="right">C2 (Non-Peak)</TableCell>
              <TableCell align="right">C3 (Peak)</TableCell>
              <TableCell align="right">C4 (Peak)</TableCell>
              <TableCell align="right">C5 (Non-Peak)</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historicalData.map((row) => (
              <TableRow 
                key={row.month}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  bgcolor: row.month === 'Jan 2025' ? '#e3f2fd' : 'inherit'
                }}
              >
                <TableCell component="th" scope="row">{row.month}</TableCell>
                <TableCell align="right">{row.c1.toFixed(2)}</TableCell>
                <TableCell align="right">{row.c2.toFixed(2)}</TableCell>
                <TableCell align="right">{row.c3.toFixed(2)}</TableCell>
                <TableCell align="right">{row.c4.toFixed(2)}</TableCell>
                <TableCell align="right">{row.c5.toFixed(2)}</TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    fontWeight: 'bold',
                    color: type === 'production' ? 'success.main' : 'primary.main'
                  }}
                >
                  {row.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
