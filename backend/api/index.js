import app from '../server.js';

export default async function handler(request, response) {
  // Convert Vercel's request/response to Express's request/response
  return app(request, response);
}