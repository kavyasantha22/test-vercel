// Vercel Edge Function for request counter
export const config = {
  runtime: 'edge',
};

// In-memory counter (note: this will reset when the function is redeployed)
let counter = 0;

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

  try {
    // Increment counter
    counter++;
    
    // Return the counter value
    return new Response(
      JSON.stringify({
        count: counter,
        message: `This endpoint has been called ${counter} times`,
        timestamp: new Date().toISOString()
      }),
      { headers }
    );
  } catch (error) {
    console.error('Error in counter function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers }
    );
  }
}