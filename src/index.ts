import { buildApp } from './app';
import { config } from './config';

async function start() {
  try {
    const fastify = await buildApp();
    
    await fastify.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    console.log(`🚀 GitHub Wrapped API is running on port ${config.port}`);
    console.log(`📖 API Documentation: http://localhost:${config.port}`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

start();