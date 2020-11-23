const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use('/api/v1/user',createProxyMiddleware({ target: 'http://localhost:4000',changeOrigin: true,}));
    app.use('/api/v1/fleet',createProxyMiddleware({ target: 'http://localhost:5000',changeOrigin: true,}));
    app.use('/api/v1/car',createProxyMiddleware({ target: 'http://localhost:5000',changeOrigin: true,}));
};