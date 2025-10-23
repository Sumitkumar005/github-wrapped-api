import { buildApp } from '../src/app';

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await buildApp();
    await app.ready();
  }
  
  app.server.emit('request', req, res);
}