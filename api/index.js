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
      query: req.query,
    });

    console.log('📤 Response status:', response.statusCode);

    // Set status code
    res.status(response.statusCode);

    // Set headers
    Object.keys(response.headers).forEach(key => {
      if (key.toLowerCase() !== 'content-length') {
        res.setHeader(key, response.headers[key]);
      }
    });

    // Send response
    res.end(response.payload);
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
      timestamp: new Date().toISOString(),
    });
  }
};