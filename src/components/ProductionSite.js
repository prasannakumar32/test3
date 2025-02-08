import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStorage } from '../context/StorageContext';
import { getProductionDataByMonth, updateProductionData, deleteProductionData, getProductionUnit } from '../services/dynamoDBService';

const ProductionSite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [monthlyData, setMonthlyData] = useState([]);
  const [siteDetails, setSiteDetails] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const { refreshData } = useStorage();
  
  const months = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ];

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        const site = await getProductionUnit(1, id); // Assuming CompanyId is 1
        setSiteDetails(site);
      } catch (err) {
        console.error('Error fetching site details:', err);
        setError('Failed to fetch site details');
      }
    };

    fetchSiteDetails();
  }, [id]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!siteDetails) return;
      
      try {
        const year = parseInt(selectedYear.split('-')[0]);
        const monthlyDataPromises = months.map(async (month) => {
          const data = await getProductionDataByMonth(siteDetails.CompanyId, siteDetails.ProductionId, month, year);
          return {
            month,
            c1: data?.C1 || 0,
            c2: data?.C2 || 0,
            c3: data?.C3 || 0,
            c4: data?.C4 || 0,
            c5: data?.C5 || 0,
            total: [
              data?.C1 || 0,
              data?.C2 || 0,
              data?.C3 || 0,
              data?.C4 || 0,
              data?.C5 || 0
            ].reduce((a, b) => a + b, 0)
          };
        });
        
        const data = await Promise.all(monthlyDataPromises);
        setMonthlyData(data);
      } catch (err) {
        console.error('Error fetching monthly data:', err);
        setError('Failed to fetch monthly data');
      }
    };

    fetchMonthlyData();
  }, [siteDetails, selectedYear]);

  const handleEdit = (monthData) => {
    setEditData({
      month: monthData.month,
      c1: monthData.c1,
      c2: monthData.c2,
      c3: monthData.c3,
      c4: monthData.c4,
      c5: monthData.c5
    });
    setEditDialogOpen(true);
  };

  const handleDelete = async (month) => {
    if (!siteDetails) return;
    
    try {
      const year = parseInt(selectedYear.split('-')[0]);
      await deleteProductionData(siteDetails.CompanyId, siteDetails.ProductionId, month, year);
      setSuccess('Data deleted successfully');
      refreshData();
      
      // Refresh monthly data
      const updatedData = monthlyData.map(data => 
        data.month === month ? {
          ...data,
          c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, total: 0
        } : data
      );
      setMonthlyData(updatedData);
    } catch (err) {
      console.error('Error deleting data:', err);
      setError('Failed to delete data');
    }
  };

  const handleSave = async () => {
    if (!siteDetails || !editData) return;
    
    try {
      const year = parseInt(selectedYear.split('-')[0]);
      await updateProductionData({
        CompanyId: siteDetails.CompanyId,
        ProductionId: siteDetails.ProductionId,
        Month: editData.month,
        Year: year,
        C1: editData.c1,
        C2: editData.c2,
        C3: editData.c3,
        C4: editData.c4,
        C5: editData.c5
      });
      
      setSuccess('Data updated successfully');
      setEditDialogOpen(false);
      setEditData(null);  
      refreshData();
      
      // Update local state
      const updatedData = monthlyData.map(data => 
        data.month === editData.month ? {
          ...data,
          c1: editData.c1,
          c2: editData.c2,
          c3: editData.c3,
          c4: editData.c4,
          c5: editData.c5,
          total: [editData.c1, editData.c2, editData.c3, editData.c4, editData.c5]
            .reduce((a, b) => a + b, 0)
        } : data
      );
      setMonthlyData(updatedData);
    } catch (err) {
      console.error('Error updating data:', err);
      setError('Failed to update data');
    }
  };

  if (!siteDetails) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <IconButton onClick={() => navigate('/production')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="span">
          Site: {siteDetails.Name}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Site Details
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography><strong>Location:</strong> {siteDetails.Location}</Typography>
          <Typography><strong>Type:</strong> {siteDetails.Type}</Typography>
          <Typography><strong>Capacity:</strong> {siteDetails.Capacity_MW} MW</Typography>
          <Typography><strong>Annual Production:</strong> {siteDetails.Annual_Production_L}L</Typography>
          <Typography><strong>HTSC No:</strong> {siteDetails.HTSC_No}</Typography>
          <Typography><strong>Status:</strong> {siteDetails.Status}</Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Historical Production Data
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Month"
            >
              <MenuItem value="All Months">All Months</MenuItem>
              {months.map(month => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Financial Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Financial Year"
            >
              <MenuItem value="2024-2025">2024-2025</MenuItem>
              <MenuItem value="2023-2024">2023-2024</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
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
              {monthlyData
                .filter(row => selectedMonth === 'All Months' || row.month === selectedMonth)
                .map((row) => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.c1}</TableCell>
                    <TableCell>{row.c2}</TableCell>
                    <TableCell>{row.c3}</TableCell>
                    <TableCell>{row.c4}</TableCell>
                    <TableCell>{row.c5}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(row.month)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Production Data</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography><strong>Month:</strong> {editData?.month}</Typography>
            <TextField
              label="C1"
              type="number"
              value={editData?.c1 || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, c1: parseFloat(e.target.value) || 0 }))}
            />
            <TextField
              label="C2"
              type="number"
              value={editData?.c2 || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, c2: parseFloat(e.target.value) || 0 }))}
            />
            <TextField
              label="C3"
              type="number"
              value={editData?.c3 || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, c3: parseFloat(e.target.value) || 0 }))}
            />
            <TextField
              label="C4"
              type="number"
              value={editData?.c4 || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, c4: parseFloat(e.target.value) || 0 }))}
            />
            <TextField
              label="C5"
              type="number"
              value={editData?.c5 || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, c5: parseFloat(e.target.value) || 0 }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductionSite;
