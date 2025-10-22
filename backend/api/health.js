export default function handler(request, response) {
  response.status(200).json({ 
    status: 'OK', 
    message: 'Backend is running on Vercel',
    timestamp: new Date().toISOString()
  });
}