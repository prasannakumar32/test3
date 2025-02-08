const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample production sites data
const productionSites = [
  {
    id: 'PS1',
    name: 'PUDUKOTTAI',
    location: 'PUDUKOTTAI',
    type: 'ALLOCATION',
    total: 125000,
    status: 'Active',
    c1: 25000,
    c2: 18750,
    c3: 31250,
    c4: 31250,
    c5: 18750
  },
  {
    id: 'PW1',
    name: 'TIRUNELVELI WIND FARM',
    location: 'TIRUNELVELI',
    type: 'BANKING',
    total: 142807,
    status: 'Active',
    c1: 28561,
    c2: 21421,
    c3: 35702,
    c4: 35702,
    c5: 21421
  }
];

// Sample consumption sites data
const consumptionSites = [
  {
    id: 'CS1',
    name: 'POLYSPIN EXPORTS LTD.,EXPANSION UNIT.',
    location: 'VIRUDUNAGAR',
    type: 'ALLOCATION',
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
    type: 'ALLOCATION',
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
    type: 'BANKING',
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

// API Routes
app.get('/api/production-sites', (req, res) => {
  console.log('GET /api/production-sites called');
  res.json(productionSites);
});

app.get('/api/consumption-sites', (req, res) => {
  console.log('GET /api/consumption-sites called');
  res.json(consumptionSites);
});

// Auto allocation endpoint
app.post('/api/auto-allocate', (req, res) => {
  console.log('POST /api/auto-allocate called');
  
  // Create deep copies to work with
  const workingProdSites = JSON.parse(JSON.stringify(productionSites));
  const workingConsSites = JSON.parse(JSON.stringify(consumptionSites));
  
  // Calculate available capacity for each production site
  const prodCapacity = workingProdSites.map(site => ({
    ...site,
    available: {
      c1: site.c1,
      c2: site.c2,
      c3: site.c3,
      c4: site.c4,
      c5: site.c5
    }
  }));

  // Allocate consumption based on production capacity and type
  workingConsSites.forEach(cons => {
    // Match allocation type
    const prod = prodCapacity.find(p => 
      (p.location === 'PUDUKOTTAI' && cons.type === 'ALLOCATION') ||
      (p.location === 'TIRUNELVELI' && cons.type === 'BANKING')
    );
    
    if (prod) {
      // Calculate allocation
      const newC1 = Math.min(cons.c1, prod.available.c1);
      const newC2 = Math.min(cons.c2, prod.available.c2);
      const newC3 = Math.min(cons.c3, prod.available.c3);
      const newC4 = Math.min(cons.c4, prod.available.c4);
      const newC5 = Math.min(cons.c5, prod.available.c5);

      // Update consumption site values
      cons.c1 = newC1;
      cons.c2 = newC2;
      cons.c3 = newC3;
      cons.c4 = newC4;
      cons.c5 = newC5;
      cons.total = newC1 + newC2 + newC3 + newC4 + newC5;

      // Update production site available capacity
      prod.available.c1 -= newC1;
      prod.available.c2 -= newC2;
      prod.available.c3 -= newC3;
      prod.available.c4 -= newC4;
      prod.available.c5 -= newC5;

      // Update actual production site values
      prod.c1 = prod.available.c1;
      prod.c2 = prod.available.c2;
      prod.c3 = prod.available.c3;
      prod.c4 = prod.available.c4;
      prod.c5 = prod.available.c5;
      prod.total = prod.c1 + prod.c2 + prod.c3 + prod.c4 + prod.c5;
    }
  });

  // Persist changes back to the original arrays
  productionSites.length = 0;
  consumptionSites.length = 0;
  productionSites.push(...workingProdSites);
  consumptionSites.push(...workingConsSites);
  
  res.json({
    success: true,
    message: 'Auto allocation completed successfully',
    productionSites: workingProdSites,
    consumptionSites: workingConsSites
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET  /api/production-sites');
  console.log('- GET  /api/consumption-sites');
  console.log('- POST /api/auto-allocate');
});
