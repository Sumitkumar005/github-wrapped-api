import { buildApp } from '../src/app';

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await buildApp();
    await app.ready();
  }
  
  // Handle the request
  app.server.emit('request', req, res);
}