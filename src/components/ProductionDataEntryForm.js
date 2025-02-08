import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';

function ProductionDataEntryForm({ type, onSave, onCancel, initialData, mode }) {
  const months = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ];

  const getEmptyData = () => {
    if (type === 'units') {
      return {
        month: '',
        c1: '',
        c2: '',
        c3: '',
        c4: '',
        c5: ''
      };
    }
    return {
      month: '',
      c001: '',
      c002: '',
      c003: '',
      c004: '',
      c005: '',
      c006: '',
      c007: '',
      c008: ''
    };
  };

  const [formData, setFormData] = useState(initialData || getEmptyData());

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(getEmptyData());
    }
  }, [initialData, type]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'month' ? value : value === '' ? '' : parseInt(value) || 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert empty strings to 0 before saving
    const dataToSave = { ...formData };
    Object.keys(dataToSave).forEach(key => {
      if (key !== 'month' && dataToSave[key] === '') {
        dataToSave[key] = 0;
      }
    });
    onSave(dataToSave);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, color: '#1a237e' }}>
        {type === 'units' ? 'Unit Matrix Data' : 'Charges Matrix Data'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={formData.month}
              onChange={(e) => handleChange('month', e.target.value)}
              required
              disabled={mode === 'edit'}
              label="Month"
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {type === 'units' ? (
          <>
            {[1, 2, 3, 4, 5].map((num) => (
              <Grid item xs={12} sm={6} md={4} key={num}>
                <TextField
                  fullWidth
                  label={`C${num}`}
                  type="number"
                  value={formData[`c${num}`]}
                  onChange={(e) => handleChange(`c${num}`, e.target.value)}
                  InputProps={{ 
                    inputProps: { min: 0 },
                    sx: { '& input': { textAlign: 'center' } }
                  }}
                  placeholder="Enter value"
                />
              </Grid>
            ))}
          </>
        ) : (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <Grid item xs={12} sm={6} md={4} key={num}>
                <TextField
                  fullWidth
                  label={`C00${num}`}
                  type="number"
                  value={formData[`c00${num}`]}
                  onChange={(e) => handleChange(`c00${num}`, e.target.value)}
                  InputProps={{ 
                    inputProps: { min: 0 },
                    sx: { '& input': { textAlign: 'center' } }
                  }}
                  placeholder="Enter value"
                />
              </Grid>
            ))}
          </>
        )}

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button 
            onClick={onCancel} 
            variant="outlined"
            sx={{ color: '#1a237e', borderColor: '#1a237e' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{ 
              backgroundColor: '#1a237e',
              '&:hover': {
                backgroundColor: '#0d47a1'
              }
            }}
          >
            {mode === 'edit' ? 'Update' : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductionDataEntryForm;
