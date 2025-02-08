const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      },
      logLevel: 'error',
      timeout: 5000,
      proxyTimeout: 5000,
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).send('Proxy Error');
      },
      headers: {
        Connection: 'keep-alive'
      },
      buffer: {
        pipe: true,
        timeout: 5000
      }
    })
  );
};
