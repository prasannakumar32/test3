const express = require('express');
const router = express.Router();

// Get production sites
router.get('/production', (req, res) => {
  const productionSites = [
    {
      id: 'PUDUKOTTAI',
      name: 'Pudukottai',
      location: 'Pudukottai',
      type: 'IS-CAPTIVE',
      category: 'IS-CAPTIVE',
      fullName: 'M/s.STRIO KAIZEN HITECH RESEARCH LABS (P) LTD',
      coordinates: '10.3833° N, 78.8001° E'
    },
    {
      id: 'TIRUNELVELI',
      name: 'Tirunelveli',
      location: 'Tirunelveli',
      type: 'IS-CAPTIVE',
      category: 'IS-CAPTIVE',
      fullName: 'M/S STRIO KAIZEN HITECH RESEARCH LABS PVT.LTD.',
      coordinates: '8.7139° N, 77.7567° E'
    }
  ];
  res.json(productionSites);
});

// Get consumption sites
router.get('/consumption', (req, res) => {
  const consumptionSites = [
    {
      id: 'polyspin-1',
      name: 'POLYSPIN EXPORTS LTD.,EXPANSION UNIT.',
      location: 'VIRUDUNAGAR',
      type: 'Consumer',
      consumption_ratio: 0.35,
      serviceNumber: '079094620335'
    },
    {
      id: 'pel-1',
      name: 'PEL TEXTILES',
      location: 'VIRUDUNAGAR',
      type: 'Consumer',
      consumption_ratio: 0.30,
      serviceNumber: '079094620348'
    },
    {
      id: 'ramar-2',
      name: 'M/S. A RAMAR AND SONS',
      location: 'MADURAI METRO',
      type: 'Consumer',
      consumption_ratio: 0.35,
      serviceNumber: '059094630184'
    }
  ];
  res.json(consumptionSites);
});

// Routes for sites data
router.get('/', (req, res) => {
  res.json({ message: 'Sites routes working' });
});

module.exports = router;
