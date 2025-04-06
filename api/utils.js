// Utility functions for Vercel Edge API handlers

// Helper function to handle CORS headers
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

// Helper function to handle OPTIONS requests (CORS preflight)
export function handleCorsPreflightRequest(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(200).end();
  }
  return false;
}

// Helper function to create a standardized API response
export function createApiResponse(res, data, statusCode = 200) {
  setCorsHeaders(res);
  return res.status(statusCode).json(data);
}

// Helper function to handle errors
export function handleApiError(res, error, message = 'An error occurred', statusCode = 400) {
  console.error(`API Error: ${message}`, error);
  setCorsHeaders(res);
  return res.status(statusCode).json({
    error: true,
    message: message
  });
}