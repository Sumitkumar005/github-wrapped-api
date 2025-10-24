const { buildApp } = require('../dist/app');

let app = null;

module.exports = async function handler(req, res) {
  console.log('🚀 Serverless function called:', req.method, req.url);
  
  try {
    // Initialize app only once
    if (!app) {
      console.log('📦 Initializing Fastify app...');
      app = await buildApp();
      await app.ready();
      console.log('✅ Fastify app ready');
    }

    // Handle the request through Fastify's inject method
    const response = await app.inject({
      method: req.method,
      url: req.url || '/',
      headers: req.headers,
      payload: req.body,
    });

    console.log('📤 Response status:', response.statusCode);

    // Set status code
    res.status(response.statusCode);

    // Set headers
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });

    // Send response
    res.send(response.payload);
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};