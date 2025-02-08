const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./api/routes');

const app = express();
const port = process.env.PORT || 3002;

// Allow all origins with simple CORS configuration
app.use(cors({ origin: '*' }));

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'CORS is working for all origins!' });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Start server
app.listen(port, () => {
  console.log('Server running on http://localhost:${port}');
});