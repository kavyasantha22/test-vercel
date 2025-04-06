// Vercel Edge Function for URL shortening
export const config = {
  runtime: 'edge',
};

// In-memory storage for shortened URLs (in production, use a database)
const urlMap = new Map();

// Generate a random short code
function generateShortCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default async function handler(req) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  };
  
  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // Get the URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/url-shortener', '').replace(/^\//, '');
  
  // If there's a path, try to redirect to the original URL
  if (path) {
    console.log(`Looking up URL for short code: ${path}`);
    const originalUrl = urlMap.get(path);
    
    if (originalUrl) {
      // Redirect to the original URL
      return new Response(null, {
        status: 302,
        headers: {
          'Location': originalUrl,
          ...headers
        }
      });
    } else {
      // Short URL not found
      return new Response(
        JSON.stringify({
          error: 'Short URL not found',
          message: `No URL found for code: ${path}`
        }),
        { status: 404, headers }
      );
    }
  }
  
  // If no path, create a new short URL
  try {
    if (req.method === 'POST') {
      const body = await req.json();
      const originalUrl = body?.url;
      
      if (!originalUrl) {
        throw new Error('URL is required');
      }
      
      // Validate URL format
      try {
        new URL(originalUrl);
      } catch (e) {
        throw new Error('Invalid URL format');
      }
      
      // Generate a unique short code
      let shortCode = generateShortCode();
      while (urlMap.has(shortCode)) {
        shortCode = generateShortCode();
      }
      
      // Store the mapping
      urlMap.set(shortCode, originalUrl);
      
      console.log(`Created short URL: ${shortCode} -> ${originalUrl}`);
      
      // Construct the full short URL
      const host = req.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const shortUrl = `${protocol}://${host}/api/url-shortener/${shortCode}`;
      
      return new Response(
        JSON.stringify({
          originalUrl,
          shortCode,
          shortUrl,
          created: new Date().toISOString()
        }),
        { headers }
      );
    } else {
      // Method not allowed
      return new Response(
        JSON.stringify({
          error: 'Method not allowed',
          message: 'Only POST requests are supported for URL shortening'
        }),
        { status: 405, headers }
      );
    }
  } catch (error) {
    console.error("Error in url-shortener function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to create short URL",
        message: error.message || "Unknown error occurred"
      }),
      { 
        status: 400,
        headers 
      }
    );
  }
}