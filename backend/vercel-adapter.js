import app from './server.js';

export default function (req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Pass the request and response to the Express app
  return app(req, res);
}