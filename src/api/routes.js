const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

// Initialize production sites
const productionSites = [
  { id: 'pudukottai_site', name: 'Pudukottai Site', type: 'wind' },
  { id: 'tirunelveli_site', name: 'Tirunelveli Site', type: 'wind' }
];

// Initialize production history
let productionHistory = {
  pudukottai_site: [],
  tirunelveli_site: []
};

// Initialize consumption sites data with realistic values
const consumptionSites = [
  {
    id: 'CS1',
    name: 'POLYSPIN EXPORTS LTD.,EXPANSION UNIT.',
    location: 'VIRUDUNAGAR',
    type: 'Consumer',
    serviceNumber: '079094620335',
    status: 'Active',
    consumption_ratio: 0.25,
    c1: 5254,
    c2: 4327,
    c3: 3890,
    c4: 30566,
    c5: 2845,
    total: 46882
  },
  {
    id: 'CS2',
    name: 'PEL TEXTILES',
    location: 'VIRUDUNAGAR',
    type: 'Consumer',
    serviceNumber: '079094620348',
    status: 'Active',
    consumption_ratio: 0.25,
    c1: 4127,
    c2: 3654,
    c3: 2987,
    c4: 8039,
    c5: 1543,
    total: 20350
  },
  {
    id: 'CS3',
    name: 'M/S. A RAMAR AND SONS',
    location: 'MADURAI METRO',
    type: 'Consumer',
    serviceNumber: '079094620351',
    status: 'Active',
    consumption_ratio: 0.50,
    c1: 6543,
    c2: 5432,
    c3: 4321,
    c4: 12543,
    c5: 3210,
    total: 32049
  }
];

// Initialize consumption history with the current data
let consumptionHistory = {};
consumptionSites.forEach(site => {
  consumptionHistory[site.id] = [{
    id: Date.now().toString(),
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    siteId: site.id,
    siteName: site.name,
    type: site.type,
    c1: site.c1,
    c2: site.c2,
    c3: site.c3,
    c4: site.c4,
    c5: site.c5,
    total: site.total,
    timestamp: new Date().toISOString()
  }];
});

// Get all production sites
router.get('/production-sites', (req, res) => {
  try {
    console.log('Sending production sites:', productionSites);
    res.json(productionSites);
  } catch (error) {
    console.error('Error sending production sites:', error);
    res.status(500).json({ error: 'Failed to fetch production sites' });
  }
});

// Get history for specific site
router.get('/production-sites/:siteId/history', (req, res) => {
  const { siteId } = req.params;
  console.log(`Getting history for site: ${siteId}`);
  const siteHistory = productionHistory[siteId] || [];
  console.log('Site history:', siteHistory);
  res.json(siteHistory);
});

// Add production data for a site
router.post('/production-sites/:siteId/history', upload.none(), (req, res) => {
  try {
    const { siteId } = req.params;
    const newData = req.body;
    console.log(`Adding production data for site ${siteId}:`, newData);

    const site = productionSites.find(s => s.id === siteId);
    if (!site) {
      console.error(`Site not found: ${siteId}`);
      return res.status(404).json({ error: 'Site not found' });
    }

    const formattedData = {
      id: Date.now().toString(),
      month: newData.month,
      siteId: siteId,
      siteName: site.name,
      type: site.type,
      c1: parseFloat(newData.c1) || 0,
      c2: parseFloat(newData.c2) || 0,
      c3: parseFloat(newData.c3) || 0,
      c4: parseFloat(newData.c4) || 0,
      c5: parseFloat(newData.c5) || 0,
      createdAt: new Date().toISOString()
    };

    if (!productionHistory[siteId]) {
      productionHistory[siteId] = [];
    }

    // Check for existing entry for the same month
    const existingIndex = productionHistory[siteId].findIndex(item => item.month === newData.month);
    
    if (existingIndex !== -1) {
      // Update existing entry
      productionHistory[siteId][existingIndex] = {
        ...productionHistory[siteId][existingIndex],
        ...formattedData,
        updatedAt: new Date().toISOString()
      };
      console.log('Updated existing entry:', productionHistory[siteId][existingIndex]);
    } else {
      // Add new entry
      productionHistory[siteId].push(formattedData);
      console.log('Added new entry:', formattedData);
    }

    res.status(201).json(formattedData);
  } catch (error) {
    console.error('Error adding production data:', error);
    res.status(500).json({ error: 'Failed to add production data', details: error.message });
  }
});

// Delete production data
router.delete('/production-sites/:siteId/history/:id', (req, res) => {
  try {
    const { siteId, id } = req.params;
    console.log(`Deleting production data for site ${siteId}, id: ${id}`);
    
    if (!productionHistory[siteId]) {
      console.error(`Site not found: ${siteId}`);
      return res.status(404).json({ error: 'Site not found' });
    }

    const index = productionHistory[siteId].findIndex(item => item.id === id);
    if (index === -1) {
      console.error(`Record not found: ${id}`);
      return res.status(404).json({ error: 'Record not found' });
    }

    productionHistory[siteId].splice(index, 1);
    console.log(`Deleted record ${id} from site ${siteId}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting production data:', error);
    res.status(500).json({ error: 'Failed to delete production data', details: error.message });
  }
});

// Get all consumption sites
router.get('/consumption-sites', (req, res) => {
  try {
    console.log('Sending consumption sites:', consumptionSites);
    res.json(consumptionSites.map(site => ({
      ...site,
      historicalData: consumptionHistory[site.id] || []
    })));
  } catch (error) {
    console.error('Error sending consumption sites:', error);
    res.status(500).json({ error: 'Failed to fetch consumption sites' });
  }
});

// Get history for specific consumption site
router.get('/consumption-sites/:siteId/history', (req, res) => {
  try {
    const { siteId } = req.params;
    console.log(`Getting history for consumption site: ${siteId}`);
    const siteHistory = consumptionHistory[siteId] || [];
    console.log('Site history:', siteHistory);
    res.json(siteHistory);
  } catch (error) {
    console.error('Error fetching site history:', error);
    res.status(500).json({ error: 'Failed to fetch site history' });
  }
});

// Add consumption data for a site
router.post('/consumption-sites/:siteId/history', upload.none(), (req, res) => {
  try {
    const { siteId } = req.params;
    const newData = req.body;
    console.log(`Adding consumption data for site ${siteId}:`, newData);

    const site = consumptionSites.find(s => s.id === siteId);
    if (!site) {
      console.error(`Site not found: ${siteId}`);
      return res.status(404).json({ error: 'Site not found' });
    }

    const formattedData = {
      id: Date.now().toString(),
      month: newData.month,
      siteId: siteId,
      siteName: site.name,
      type: site.type,
      c1: parseFloat(newData.c1) || 0,
      c2: parseFloat(newData.c2) || 0,
      c3: parseFloat(newData.c3) || 0,
      c4: parseFloat(newData.c4) || 0,
      c5: parseFloat(newData.c5) || 0,
      total: parseFloat(newData.total) || 0,
      timestamp: new Date().toISOString()
    };

    if (!consumptionHistory[siteId]) {
      consumptionHistory[siteId] = [];
    }
    consumptionHistory[siteId].push(formattedData);

    console.log(`Successfully added consumption data for ${siteId}`);
    res.json(formattedData);
  } catch (error) {
    console.error('Error adding consumption data:', error);
    res.status(500).json({ error: 'Failed to add consumption data' });
  }
});

module.exports = router;
