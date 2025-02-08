const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for all routes with specific options
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Amz-Target', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token']
}));

// Configure proxy middleware
const proxyOptions = {
  target: 'http://localhost:8000',
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq, req) => {
    // Add required headers for DynamoDB
    proxyReq.setHeader('Content-Type', 'application/x-amz-json-1.0');
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    }
  },
  logLevel: 'error', // Reduce logging to improve performance
  timeout: 5000, // Set timeout to 5 seconds
  proxyTimeout: 5000,
  buffer: {
    pipe: true,
    timeout: 5000
  }
};

// Parse JSON bodies
app.use(express.json());

// Use proxy for all routes
app.use('/', createProxyMiddleware(proxyOptions));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
