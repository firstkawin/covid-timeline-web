// !!! to avoid Cross-Origin
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
// for API (NestJs) Route
app.use('/api', createProxyMiddleware({ target: 'http://localhost:8881', changeOrigin: true }));
// for static Web (NextJs) Route 
app.use('/', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));

app.listen(3000);
console.log('started proxy-server on http://localhost:3000', 'route(default) /* -> web:3001', 'route /api -> api:8881');
