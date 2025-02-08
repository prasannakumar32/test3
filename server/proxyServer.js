const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();
const port = 8080;

// Enable CORS for all origins
app.use(cors());

// Set up the proxy route
app.get('/*', (req, res) => {
  const url = req.originalUrl.slice(1); // Remove the initial '/'
  request(url).pipe(res); // Forward the request to the actual API
});

// Start the server
app.listen(port, () => {
  console.log(`CORS Proxy server running on http://localhost:${port}`);
});
