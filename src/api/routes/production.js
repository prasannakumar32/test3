const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer();

// Initialize production sites
const productionSites = [
  { id: 'pudukottai_site', name: 'Pudukottai Site', type: 'wind' },
  { id: 'tirunelveli_site', name: 'Tirunelveli Site', type: 'wind' }
];

// Initialize production history with sample data
let productionHistory = {
  pudukottai_site: [
    {
      id: '1',
      month: 'Jan',
      siteId: 'pudukottai_site',
      siteName: 'Pudukottai Site',
      c1: 100,
      c2: 200,
      c3: 300,
      c4: 400,
      c5: 500
    },
    {
      id: '2',
      month: 'Feb',
      siteId: 'pudukottai_site',
      siteName: 'Pudukottai Site',
      c1: 150,
      c2: 250,
      c3: 350,
      c4: 450,
      c5: 550
    }
  ],
  tirunelveli_site: [
    {
      id: '3',
      month: 'Jan',
      siteId: 'tirunelveli_site',
      siteName: 'Tirunelveli Site',
      c1: 120,
      c2: 220,
      c3: 320,
      c4: 420,
      c5: 520
    }
  ]
};

// Get all sites
router.get('/sites', (req, res) => {
  res.json(productionSites);
});

// Get history for specific site
router.get('/:siteId/history', (req, res) => {
  const { siteId } = req.params;
  console.log(`Getting history for site: ${siteId}`);
  const siteHistory = productionHistory[siteId] || [];
  console.log('Site history:', siteHistory);
  res.json(siteHistory);
});

// Add production data for a site
router.post('/:siteId/history', upload.none(), (req, res) => {
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
      c1: parseFloat(newData.c1) || 0,
      c2: parseFloat(newData.c2) || 0,
      c3: parseFloat(newData.c3) || 0,
      c4: parseFloat(newData.c4) || 0,
      c5: parseFloat(newData.c5) || 0
    };

    if (!productionHistory[siteId]) {
      productionHistory[siteId] = [];
    }
    productionHistory[siteId].push(formattedData);

    console.log('Updated site history:', productionHistory[siteId]);
    res.status(201).json(formattedData);
  } catch (error) {
    console.error('Error adding production data:', error);
    res.status(500).json({ error: 'Failed to add production data' });
  }
});

// Add allocation for a site
router.post('/:siteId/allocation', upload.none(), (req, res) => {
  try {
    const { siteId } = req.params;
    const newData = req.body;
    console.log(`Adding allocation for site ${siteId}:`, newData);

    const site = productionSites.find(s => s.id === siteId);
    if (!site) {
      console.error(`Site not found: ${siteId}`);
      return res.status(404).json({ error: 'Site not found' });
    }

    // Ensure production history exists for the site
    if (!productionHistory[siteId]) {
      return res.status(404).json({ error: 'Production history not found for site' });
    }

    // Find the original production data
    const productionData = productionHistory[siteId].find(p => p.id === newData.productionDataId);
    if (!productionData) {
      return res.status(404).json({ error: 'Production data not found' });
    }

    const formattedData = {
      id: Date.now().toString(),
      month: newData.month,
      siteId: siteId,
      siteName: site.name,
      c1: parseFloat(newData.c1) || 0,
      c2: parseFloat(newData.c2) || 0,
      c3: parseFloat(newData.c3) || 0,
      c4: parseFloat(newData.c4) || 0,
      c5: parseFloat(newData.c5) || 0,
      productionDataId: productionData.id
    };

    // Add to allocations (we could create a separate allocations object if needed)
    if (!productionHistory[siteId].allocations) {
      productionHistory[siteId].allocations = [];
    }
    productionHistory[siteId].allocations.push(formattedData);

    console.log('Updated allocations:', productionHistory[siteId].allocations);
    res.status(201).json(formattedData);
  } catch (error) {
    console.error('Error adding allocation:', error);
    res.status(500).json({ error: 'Failed to add allocation' });
  }
});

// Update production data
router.put('/:siteId/history/:id', upload.none(), (req, res) => {
  try {
    const { siteId, id } = req.params;
    const updatedData = req.body;
    console.log(`Updating production data for site ${siteId}, id ${id}:`, updatedData);

    const site = productionSites.find(s => s.id === siteId);
    if (!site) {
      console.error(`Site not found: ${siteId}`);
      return res.status(404).json({ error: 'Site not found' });
    }

    const productionData = productionHistory[siteId].find(p => p.id === id);
    if (!productionData) {
      return res.status(404).json({ error: 'Production data not found' });
    }

    productionData.month = updatedData.month || productionData.month;
    productionData.c1 = parseFloat(updatedData.c1) || productionData.c1;
    productionData.c2 = parseFloat(updatedData.c2) || productionData.c2;
    productionData.c3 = parseFloat(updatedData.c3) || productionData.c3;
    productionData.c4 = parseFloat(updatedData.c4) || productionData.c4;
    productionData.c5 = parseFloat(updatedData.c5) || productionData.c5;

    console.log('Updated production data:', productionData);
    res.status(200).json(productionData);
  } catch (error) {
    console.error('Error updating production data:', error);
    res.status(500).json({ error: 'Failed to update production data' });
  }
});

// Update consumption data
router.put('/:siteId/consumption/:id', upload.none(), (req, res) => {
  try {
    const { siteId, id } = req.params;
    const updatedData = req.body;
    console.log(`Updating consumption data for site ${siteId}, id ${id}:`, updatedData);

    const site = productionSites.find(s => s.id === siteId);
    if (!site) {
      console.error(`Site not found: ${siteId}`);
      return res.status(404).json({ error: 'Site not found' });
    }

    const consumptionData = productionHistory[siteId].find(p => p.id === id);
    if (!consumptionData) {
      return res.status(404).json({ error: 'Consumption data not found' });
    }

    consumptionData.month = updatedData.month || consumptionData.month;
    consumptionData.c1 = parseFloat(updatedData.c1) || consumptionData.c1;
    consumptionData.c2 = parseFloat(updatedData.c2) || consumptionData.c2;
    consumptionData.c3 = parseFloat(updatedData.c3) || consumptionData.c3;
    consumptionData.c4 = parseFloat(updatedData.c4) || consumptionData.c4;
    consumptionData.c5 = parseFloat(updatedData.c5) || consumptionData.c5;

    console.log('Updated consumption data:', consumptionData);
    res.status(200).json(consumptionData);
  } catch (error) {
    console.error('Error updating consumption data:', error);
    res.status(500).json({ error: 'Failed to update consumption data' });
  }
});

// Store data in local storage
router.post('/local-storage', upload.none(), (req, res) => {
  try {
    const { key, data } = req.body;
    console.log(`Storing data in local storage: key=${key}, data=${JSON.stringify(data)}`);

    // Simulate local storage using a simple object
    global.localStorage = global.localStorage || {};
    global.localStorage[key] = data;

    console.log('Data stored in local storage:', global.localStorage);
    res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error('Error storing data in local storage:', error);
    res.status(500).json({ error: 'Failed to store data in local storage' });
  }
});

// Retrieve data from local storage
router.get('/local-storage/:key', (req, res) => {
  try {
    const { key } = req.params;
    console.log(`Retrieving data from local storage: key=${key}`);

    const data = global.localStorage ? global.localStorage[key] : null;
    if (!data) {
      return res.status(404).json({ error: 'Data not found in local storage' });
    }

    console.log('Data retrieved from local storage:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data from local storage:', error);
    res.status(500).json({ error: 'Failed to retrieve data from local storage' });
  }
});

// Delete production data
router.delete('/:siteId/history/:id', (req, res) => {
  const { siteId, id } = req.params;
  console.log(`Deleting production data for site ${siteId}, id ${id}`);

  productionHistory[siteId] = productionHistory[siteId].filter(item => item.id !== id);

  console.log('Updated site history after deletion:', productionHistory[siteId]);
  res.status(200).json({ message: 'Production data deleted successfully' });
});

module.exports = router;
