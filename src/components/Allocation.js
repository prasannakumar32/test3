import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate } from 'react-router-dom';

const Allocation = () => {
  const navigate = useNavigate();
  const [productionSites, setProductionSites] = useState([]);
  const [consumptionSites, setConsumptionSites] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bankingDialogOpen, setBankingDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [editValues, setEditValues] = useState({
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0,
    c5: 0
  });
  const [bankingValues, setBankingValues] = useState({
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0,
    c5: 0
  });
  const [allocationSummary, setAllocationSummary] = useState([]);

  // Fetch production sites
  useEffect(() => {
    const fetchProductionSites = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/production-sites');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductionSites(data);
      } catch (error) {
        console.error('Error fetching production sites:', error);
        setProductionSites([]);
      }
    };
    fetchProductionSites();
  }, []);

  // Fetch consumption sites
  useEffect(() => {
    const fetchConsumptionSites = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/consumption-sites');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConsumptionSites(data);
      } catch (error) {
        console.error('Error fetching consumption sites:', error);
        setConsumptionSites([]);
      }
    };
    fetchConsumptionSites();
  }, []);

  const getTypeColor = (type) => {
    return type === 'ALLOCATION' ? '#2e7d32' : '#ed6c02';
  };

  const getSiteName = (site) => {
    if (!site) return '';
    return site.location?.toLowerCase().includes('tirunelveli') ? 
      'Tirunelveli Wind Farm' : 'Pudukottai Solar Park';
  };

  const getConsumptionSiteName = (site) => {
    if (!site) return '';
    const nameMap = {
      'SITE1': 'Consumption Site 1',
      'SITE2': 'Consumption Site 2',
      'SITE3': 'Consumption Site 3'
    };
    return nameMap[site.name] || site.name;
  };

  const getSiteType = (site) => {
    if (!site) return 'Allocation';
    return site.location?.toLowerCase().includes('tirunelveli') ? 'Banking' : 'Allocation';
  };

  const handleEdit = (site) => {
    setSelectedSite(site);
    setEditValues({
      c1: site.c1 || 0,
      c2: site.c2 || 0,
      c3: site.c3 || 0,
      c4: site.c4 || 0,
      c5: site.c5 || 0
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSite(null);
    setEditValues({
      c1: 0,
      c2: 0,
      c3: 0,
      c4: 0,
      c5: 0
    });
  };

  const handleSave = async () => {
    if (selectedSite) {
      try {
        const total = Object.values(editValues).reduce((sum, val) => sum + Number(val), 0);
        const updatedSite = {
          ...selectedSite,
          ...editValues,
          total
        };

        // Update the site in the appropriate list
        if (selectedSite.type === 'PRODUCTION') {
          setProductionSites(sites =>
            sites.map(site => site.id === selectedSite.id ? updatedSite : site)
          );
        } else {
          setConsumptionSites(sites =>
            sites.map(site => site.id === selectedSite.id ? updatedSite : site)
          );
        }
        handleDialogClose();
      } catch (error) {
        console.error('Error updating site:', error);
      }
    }
  };

  const handleViewDetails = (siteId, type) => {
    if (type === 'PRODUCTION') {
      navigate(`/production/${siteId}`);
    } else {
      navigate(`/consumption/${siteId}`);
    }
  };

  const handleAutoAllocate = async () => {
    try {
      // First, handle the banking allocations for Tirunelveli sites (old logic)
      const tirunelveliSites = productionSites.filter(site => 
        site.location?.toLowerCase().includes('tirunelveli')
      );
      
      const bankingSummary = [];
      tirunelveliSites.forEach(site => {
        if (site.c1 > 0 || site.c2 > 0 || site.c3 > 0 || site.c4 > 0 || site.c5 > 0) {
          bankingSummary.push({
            month: 'Dec',
            productionSite: getSiteName(site),
            consumptionSite: 'Banking',
            c1: site.c1,
            c2: site.c2,
            c3: site.c3,
            c4: site.c4,
            c5: site.c5,
            type: 'Banking'
          });
        }
      });

      // Then handle regular allocation for remaining sites
      const response = await fetch('http://localhost:3001/api/auto-allocate', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to auto allocate');
      
      const result = await response.json();
      
      if (result.success) {
        // Update state with the returned data
        setProductionSites(result.productionSites.map(site => ({
          ...site,
          total: site.c1 + site.c2 + site.c3 + site.c4 + site.c5
        })));
        
        setConsumptionSites(result.consumptionSites.map(site => ({
          ...site,
          total: site.c1 + site.c2 + site.c3 + site.c4 + site.c5
        })));

        // Generate allocation summary
        const summary = [];
        result.consumptionSites.forEach(cons => {
          const prod = result.productionSites.find(p => 
            (p.location === 'PUDUKOTTAI' && cons.type === 'ALLOCATION') ||
            (p.location === 'TIRUNELVELI' && cons.type === 'BANKING')
          );
          
          if (prod) {
            const allocation = {
              month: 'Dec',
              productionSite: getSiteName(prod),
              consumptionSite: getConsumptionSiteName(cons),
              c1: cons.c1,
              c2: cons.c2,
              c3: cons.c3,
              c4: cons.c4,
              c5: cons.c5,
              type: cons.type === 'BANKING' ? 'Banking' : 'Allocation'
            };
            
            if (Object.values(allocation).slice(3, 8).some(v => v > 0)) {
              summary.push(allocation);
            }
          }
        });

        // Update allocation summary with both banking and regular allocations
        setAllocationSummary(prev => [...prev, ...bankingSummary, ...summary]);
      }
    } catch (error) {
      console.error('Error in auto allocation:', error);
    }
  };

  const handleBankingOpen = (site) => {
    setSelectedSite(site);
    setBankingValues({
      c1: site.c1 || 0,
      c2: site.c2 || 0,
      c3: site.c3 || 0,
      c4: site.c4 || 0,
      c5: site.c5 || 0
    });
    setBankingDialogOpen(true);
  };

  const handleBankingClose = () => {
    setBankingDialogOpen(false);
    setBankingValues({
      c1: 0,
      c2: 0,
      c3: 0,
      c4: 0,
      c5: 0
    });
  };

  const handleBankingValueChange = (field, value) => {
    const numValue = Number(value) || 0;
    setBankingValues(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleBankingSave = async () => {
    try {
      const newAllocation = {
        month: 'Dec',
        productionSite: getSiteName(selectedSite),
        consumptionSite: getConsumptionSiteName(selectedSite),
        c1: bankingValues.c1,
        c2: bankingValues.c2,
        c3: bankingValues.c3,
        c4: bankingValues.c4,
        c5: bankingValues.c5,
        type: getSiteType(selectedSite)
      };

      // Update allocation summary with new banking entry
      setAllocationSummary(prev => [...prev, newAllocation]);

      const newTotal = Object.values(bankingValues).reduce((sum, val) => sum + Number(val), 0);

      // Update production sites with remaining capacity
      setProductionSites(prev => prev.map(site => {
        if (site.id === selectedSite.id) {
          const updatedSite = {
            ...site,
            c1: Math.max(0, site.c1 - bankingValues.c1),
            c2: Math.max(0, site.c2 - bankingValues.c2),
            c3: Math.max(0, site.c3 - bankingValues.c3),
            c4: Math.max(0, site.c4 - bankingValues.c4),
            c5: Math.max(0, site.c5 - bankingValues.c5)
          };
          updatedSite.total = updatedSite.c1 + updatedSite.c2 + updatedSite.c3 + 
                             updatedSite.c4 + updatedSite.c5;
          return updatedSite;
        }
        return site;
      }));

      handleBankingClose();
    } catch (error) {
      console.error('Error saving banking:', error);
    }
  };

  const renderSiteTable = (sites, siteType) => (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead sx={{ bgcolor: '#1a237e' }}>
          <TableRow>
            <TableCell sx={{ color: 'white' }}>Site Name</TableCell>
            <TableCell sx={{ color: 'white' }}>Location</TableCell>
            <TableCell sx={{ color: 'white' }} align="right">C1 (Non-Peak)</TableCell>
            <TableCell sx={{ color: 'white' }} align="right">C2 (Non-Peak)</TableCell>
            <TableCell sx={{ color: 'white' }} align="right">C3 (Peak)</TableCell>
            <TableCell sx={{ color: 'white' }} align="right">C4 (Peak)</TableCell>
            <TableCell sx={{ color: 'white' }} align="right">C5 (Non-Peak)</TableCell>
            <TableCell sx={{ color: 'white' }} align="right">Total</TableCell>
            <TableCell sx={{ color: 'white' }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sites.map((site) => (
            <TableRow key={site.id}>
              <TableCell>{siteType === 'PRODUCTION' ? getSiteName(site) : getConsumptionSiteName(site)}</TableCell>
              <TableCell>{site.location}</TableCell>
              <TableCell align="right">{site.c1}</TableCell>
              <TableCell align="right">{site.c2}</TableCell>
              <TableCell align="right">{site.c3}</TableCell>
              <TableCell align="right">{site.c4}</TableCell>
              <TableCell align="right">{site.c5}</TableCell>
              <TableCell align="right">{site.total}</TableCell>
              <TableCell align="center">
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEdit(site)} size="small" sx={{ color: '#1976d2' }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Details">
                  <IconButton onClick={() => handleViewDetails(site.id, siteType)} size="small" sx={{ color: '#2e7d32' }}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {site.location === 'TIRUNELVELI' && (
                  <Tooltip title="Banking">
                    <IconButton onClick={() => handleBankingOpen(site)} size="small" sx={{ color: '#ed6c02' }}>
                      <AccountBalanceIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Calculate totals for allocation results
  const totalProduction = productionSites.reduce((sum, site) => sum + (site.total || 0), 0);
  const totalAllocated = consumptionSites.reduce((sum, site) => sum + (site.total || 0), 0);
  const totalBanking = Math.max(0, totalProduction - totalAllocated);
  const lapse = Math.max(0, totalAllocated - totalProduction);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#1a237e' }}>
        Production Sites
      </Typography>
      {renderSiteTable(productionSites, 'PRODUCTION')}

      <Typography variant="h5" gutterBottom sx={{ color: '#1a237e' }}>
        Consumption Sites
      </Typography>
      {renderSiteTable(consumptionSites, 'CONSUMPTION')}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AutorenewIcon />}
          onClick={handleAutoAllocate}
          sx={{ bgcolor: '#1a237e' }}
        >
          Auto Allocate
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ color: '#1a237e' }}>
        Allocation Results
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, bgcolor: '#1a237e', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Total Production</Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>{totalProduction}</Typography>
            <Typography variant="subtitle2">Units</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, bgcolor: '#2e7d32', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Total Allocated</Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>{totalAllocated}</Typography>
            <Typography variant="subtitle2">Units</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, bgcolor: '#ed6c02', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Total Banking</Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>{totalBanking}</Typography>
            <Typography variant="subtitle2">Units</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, bgcolor: '#d32f2f', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Total Lapse</Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>{lapse}</Typography>
            <Typography variant="subtitle2">Units</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mt: 4, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        Site Allocation Details
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#2e7d32', mr: 0.5 }}/>
            <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>ALLOCATION</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ed6c02', mr: 0.5 }}/>
            <Typography variant="caption" sx={{ color: '#ed6c02', fontWeight: 'bold' }}>BANKING</Typography>
          </Box>
        </Box>
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Month</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>From Site</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>To Site</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C1 (Non-Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C2 (Non-Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C3 (Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C4 (Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C5 (Non-Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Total</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocationSummary.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  bgcolor: row.type === 'Banking' ? '#fff3e0' : 'inherit',
                  '&:hover': {
                    bgcolor: row.type === 'Banking' ? '#ffe0b2' : '#f5f5f5'
                  }
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{row.month}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{row.productionSite}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{row.consumptionSite}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>{row.c1}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>{row.c2}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>{row.c3}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>{row.c4}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>{row.c5}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {row.c1 + row.c2 + row.c3 + row.c4 + row.c5}
                </TableCell>
                <TableCell sx={{ 
                  color: row.type === 'Banking' ? '#ed6c02' : '#2e7d32',
                  fontWeight: 600
                }}>
                  {row.type}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={bankingDialogOpen} 
        onClose={handleBankingClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>
          Banking - {getSiteName(selectedSite)}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedSite?.location.toLowerCase().includes('tirunelveli') ? 'Banking' : 'Allocation'}
                  disabled
                  label="Type"
                >
                  <MenuItem value="Allocation">Allocation</MenuItem>
                  <MenuItem value="Banking">Banking</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="C1 (Non-Peak)"
                type="number"
                fullWidth
                value={bankingValues.c1}
                onChange={(e) => handleBankingValueChange('c1', e.target.value)}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="C2 (Non-Peak)"
                type="number"
                fullWidth
                value={bankingValues.c2}
                onChange={(e) => handleBankingValueChange('c2', e.target.value)}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="C3 (Peak)"
                type="number"
                fullWidth
                value={bankingValues.c3}
                onChange={(e) => handleBankingValueChange('c3', e.target.value)}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="C4 (Peak)"
                type="number"
                fullWidth
                value={bankingValues.c4}
                onChange={(e) => handleBankingValueChange('c4', e.target.value)}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="C5 (Non-Peak)"
                type="number"
                fullWidth
                value={bankingValues.c5}
                onChange={(e) => handleBankingValueChange('c5', e.target.value)}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Total"
                type="number"
                fullWidth
                value={Object.values(bankingValues).reduce((sum, val) => sum + Number(val), 0)}
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBankingClose}>Cancel</Button>
          <Button 
            onClick={handleBankingSave} 
            variant="contained" 
            sx={{ bgcolor: '#1a237e' }}
            disabled={!Object.values(bankingValues).some(v => Number(v) > 0)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit {selectedSite?.type} Site</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="C1 (Non-Peak)"
                type="number"
                fullWidth
                value={editValues.c1}
                onChange={(e) => setEditValues({ ...editValues, c1: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="C2 (Non-Peak)"
                type="number"
                fullWidth
                value={editValues.c2}
                onChange={(e) => setEditValues({ ...editValues, c2: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="C3 (Peak)"
                type="number"
                fullWidth
                value={editValues.c3}
                onChange={(e) => setEditValues({ ...editValues, c3: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="C4 (Peak)"
                type="number"
                fullWidth
                value={editValues.c4}
                onChange={(e) => setEditValues({ ...editValues, c4: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="C5 (Non-Peak)"
                type="number"
                fullWidth
                value={editValues.c5}
                onChange={(e) => setEditValues({ ...editValues, c5: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#1a237e' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Allocation;