import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  InputAdornment
} from '@mui/material';
import { useStorage } from '../context/StorageContext';

const AllocationEditForm = ({ open, onClose, site, type, updateType }) => {
  const { updateMonthlyData } = useStorage();
  const [formData, setFormData] = useState({
    C1: "0",
    C2: "0",
    C3: "0",
    C4: "0",
    C5: "0"
  });

  useEffect(() => {
    if (site && type === 'PRODUCTION') {
      const values = updateType === 'update' 
        ? site.unitValues?.fromBanking || {}
        : site.unitValues?.fromPowerplant || {};
      
      setFormData({
        C1: values.C1 || "0",
        C2: values.C2 || "0",
        C3: values.C3 || "0",
        C4: values.C4 || "0",
        C5: values.C5 || "0"
      });
    } else if (site && type === 'CONSUMPTION') {
      const values = site.unitValues || {};
      setFormData({
        C1: values.C1 || "0",
        C2: values.C2 || "0",
        C3: values.C3 || "0",
        C4: values.C4 || "0",
        C5: values.C5 || "0"
      });
    }
  }, [site, type, updateType]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) { // Only allow digits
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    const total = Object.values(formData).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    let newUnitValues;
    
    if (type === 'PRODUCTION') {
      newUnitValues = {
        ...site.unitValues,
        fromPowerplant: {
          ...formData,
          total
        }
      };
    } else if (type === 'banking') {
      newUnitValues = {
        ...site.unitValues,
        fromBanking: {
          ...formData,
          total
        }
      };
    } else {
      newUnitValues = {
        ...site.unitValues,
        ...formData,
        total
      };
    }

    try {
      await updateMonthlyData(site.id, newUnitValues);
      onClose(formData);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const getDialogTitle = () => {
    if (type === 'PRODUCTION') {
      return updateType === 'update' 
        ? `Update Banking: ${site?.name}`
        : `Edit Production: ${site?.name}`;
    }
    return `Edit Consumption: ${site?.name}`;
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>
        {getDialogTitle()}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {site?.location}
            </Typography>
          </Grid>
          {['C1', 'C2', 'C3', 'C4', 'C5'].map((slot, index) => (
            <Grid item xs={12} sm={6} key={slot}>
              <TextField
                fullWidth
                label={`${slot} ${index > 1 && index < 4 ? '(Peak)' : '(Non-Peak)'}`}
                value={formData[slot]}
                onChange={handleChange(slot)}
                type="text"
                InputProps={{
                  endAdornment: <InputAdornment position="end">Units</InputAdornment>,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          sx={{ 
            bgcolor: '#1a237e',
            '&:hover': { bgcolor: '#283593' }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllocationEditForm;
