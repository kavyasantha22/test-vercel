// Vercel Edge Function for text transformation
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
    const text = body?.text || '';
    const transformType = body?.transformType || 'uppercase';
    
    let transformedText = text;
    
    // Apply transformation based on type
    switch (transformType) {
      case 'uppercase':
        transformedText = text.toUpperCase();
        break;
      case 'lowercase':
        transformedText = text.toLowerCase();
        break;
      case 'reverse':
        transformedText = text.split('').reverse().join('');
        break;
      case 'capitalize':
        transformedText = text.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        break;
      default:
        transformedText = text;
    }
    
    // Return the transformed text
    return new Response(
      JSON.stringify({
        original: text,
        transformed: transformedText,
        transformType,
        timestamp: new Date().toISOString()
      }),
      { headers }
    );
  } catch (error) {
    console.error('Error in text transform function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers }
    );
  }
}