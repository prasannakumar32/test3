import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  IconButton
} from '@mui/material';
import {
  siteIcons,
  actionIcons,
  dataIcons
} from '../utils/icons';

const ProductionSiteForm = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'WIND',
    grid: '',
    status: 'Active',
    capacity: '',
    serviceNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setFormData({
      name: '',
      location: '',
      type: 'WIND',
      grid: '',
      status: 'Active',
      capacity: '',
      serviceNumber: ''
    });
  };

  const getTypeIcon = (type) => {
    const IconComponent = siteIcons[type];
    return IconComponent ? <IconComponent sx={{ mr: 1, color: type === 'WIND' ? '#1a237e' : '#ff9800' }} /> : null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        backgroundColor: '#1a237e', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {React.createElement(actionIcons.add, { sx: { mr: 1 } })}
          Add New Production Site
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          {React.createElement(actionIcons.close)}
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Site Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: 'text.secondary' }}>
                    {getTypeIcon(formData.type)}
                  </Box>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: 'text.secondary' }}>
                    {React.createElement(dataIcons.location)}
                  </Box>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type"
                startAdornment={getTypeIcon(formData.type)}
              >
                <MenuItem value="WIND">
                  {React.createElement(siteIcons.WIND, { sx: { mr: 1 } })}
                  Wind
                </MenuItem>
                <MenuItem value="SOLAR">
                  {React.createElement(siteIcons.SOLAR, { sx: { mr: 1 } })}
                  Solar
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Grid"
              name="grid"
              value={formData.grid}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: 'text.secondary' }}>
                    {React.createElement(dataIcons.factory)}
                  </Box>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              placeholder="e.g., 1000 kW"
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: 'text.secondary' }}>
                    {React.createElement(dataIcons.capacity)}
                  </Box>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Number"
              name="serviceNumber"
              value={formData.serviceNumber}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: 'text.secondary' }}>
                    {React.createElement(dataIcons.serviceNumber)}
                  </Box>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          startIcon={React.createElement(actionIcons.close)}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          startIcon={React.createElement(actionIcons.save)}
          sx={{ 
            backgroundColor: '#1a237e',
            '&:hover': {
              backgroundColor: '#0d47a1'
            }
          }}
        >
          Add Site
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductionSiteForm;
