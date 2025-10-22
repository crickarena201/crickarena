import app from '../api/handler.js';

export default async function handler(req, res) {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Pass the request and response to the Express app
    return app(req, res);
  } catch (error) {
    console.error('Vercel function error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};