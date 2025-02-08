require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const storageApi = require('./storageApi');
// const connectDB = require('./config/db');

// Connect to MongoDB
// connectDB();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(bodyParser.json());

// Mock data for development
const mockData = {
  stats: {
    totalProduction: 1500,
    averageEfficiency: 85,
    activeTurbines: 8
  },
  trends: [
    { date: '2024-01-01', production: 150 },
    { date: '2024-01-02', production: 165 },
    { date: '2024-01-03', production: 145 }
  ],
  summary: {
    totalAllocation: 1200,
    efficiency: 80,
    availability: 95
  },
  allocations: []
};

// Middleware to check auth token
const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }
  // For development, we'll accept any token
  next();
};

// API Routes
app.use('/api/storage', storageApi);

app.get('/api/production/stats/:siteId', checkAuth, (req, res) => {
  res.json(mockData.stats);
});

app.get('/api/production/trends/:siteId', checkAuth, (req, res) => {
  const { startDate, endDate } = req.query;
  // In a real app, we would filter trends based on date range
  res.json(mockData.trends);
});

app.get('/api/production/summary/:siteId', checkAuth, (req, res) => {
  res.json(mockData.summary);
});

app.post('/api/production/:siteId/allocate', checkAuth, (req, res) => {
  const data = req.body;
  // Validate required fields
  const requiredFields = ['timeSlot', 'powerValue', 'fromWindMill', 'toWindMill', 'startDate', 'endDate'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // Validate dates
  if (new Date(data.startDate) > new Date(data.endDate)) {
    return res.status(400).json({ message: 'Start date cannot be after end date' });
  }

  mockData.allocations.push(data);
  res.json({ message: 'Production data updated successfully', id: Date.now() });
});

app.post('/api/allocation', checkAuth, (req, res) => {
  const allocation = req.body;
  mockData.allocations.push(allocation);
  res.json({ message: 'Allocation saved successfully', id: Date.now() });
});

// Add production sites endpoint
app.get('/api/production/sites', checkAuth, (req, res) => {
  const sites = [
    {
      id: '1',
      name: 'Coimbatore Wind Farm',
      type: 'Wind',
      location: 'Coimbatore',
      capacity: 5000,
      efficiency: 85,
      status: 'active'
    },
    {
      id: '2',
      name: 'Tirunelveli Solar Park',
      type: 'Solar',
      location: 'Tirunelveli',
      capacity: 10000,
      efficiency: 90,
      status: 'active'
    },
    {
      id: '3',
      name: 'Salem Wind Farm',
      type: 'Wind',
      location: 'Salem',
      capacity: 7500,
      efficiency: 88,
      status: 'active'
    },
    {
      id: '4',
      name: 'Madurai Solar Park',
      type: 'Solar',
      location: 'Madurai',
      capacity: 8000,
      efficiency: 92,
      status: 'active'
    }
  ];
  
  res.json({ success: true, data: sites });
});

// Add login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Mock authentication - replace with real authentication later
  if (username === 'testuser' && password === 'password') {
    res.json({
      success: true,
      data: {
        id: '1',
        username: username,
        name: 'Test User',
        token: 'mock-token-123'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
