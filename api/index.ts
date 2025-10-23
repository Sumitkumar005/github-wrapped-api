import { buildApp } from '../src/app';

// Types for Vercel (will be available at runtime)
interface VercelRequest {
  method?: string;
  url?: string;
  headers: any;
  body?: any;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  setHeader(key: string, value: string): void;
  send(data: any): void;
  json(data: any): void;
}

let app: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize app only once
    if (!app) {
      app = await buildApp();
      await app.ready();
    }

    // Handle the request through Fastify's inject method
    const response = await app.inject({
      method: req.method,
      url: req.url || '/',
      headers: req.headers,
      payload: req.body,
    });

    // Set status code
    res.status(response.statusCode);

    // Set headers
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });

    // Send response
    res.send(response.payload);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  }
}