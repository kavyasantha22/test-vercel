// Vercel Edge Function for message echo
export const config = {
  runtime: 'edge',
};

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
    // Parse the request body
    const body = await req.json();
    const message = body?.message || 'No message provided';
    
    console.log("Received message:", message);

    // Return the echoed message
    return new Response(
      JSON.stringify({
        echo: message,
        timestamp: new Date().toISOString()
      }),
      { headers }
    );
  } catch (error) {
    console.error("Error in message-echo function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Invalid request format",
        message: "Please provide a JSON object with a 'message' field"
      }),
      { 
        status: 400,
        headers 
      }
    );
  }
}