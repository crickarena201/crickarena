export default function handler(request, response) {
  response.status(200).json({ 
    status: 'success',
    message: 'Vercel API endpoint is working',
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url
  });
}