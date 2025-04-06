// Vercel Edge Function for basic calculator operations
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
    const num1 = parseFloat(body?.num1) || 0;
    const num2 = parseFloat(body?.num2) || 0;
    const operation = body?.operation || 'add';
    
    let result;
    let operationSymbol;
    
    // Perform calculation based on operation type
    switch (operation) {
      case 'add':
        result = num1 + num2;
        operationSymbol = '+';
        break;
      case 'subtract':
        result = num1 - num2;
        operationSymbol = '-';
        break;
      case 'multiply':
        result = num1 * num2;
        operationSymbol = '*';
        break;
      case 'divide':
        if (num2 === 0) {
          return new Response(
            JSON.stringify({
              error: 'Division by zero is not allowed',
              timestamp: new Date().toISOString()
            }),
            { status: 400, headers }
          );
        }
        result = num1 / num2;
        operationSymbol = '/';
        break;
      default:
        return new Response(
          JSON.stringify({
            error: 'Invalid operation. Supported operations: add, subtract, multiply, divide',
            timestamp: new Date().toISOString()
          }),
          { status: 400, headers }
        );
    }
    
    // Return the calculation result
    return new Response(
      JSON.stringify({
        num1,
        num2,
        operation,
        expression: `${num1} ${operationSymbol} ${num2}`,
        result,
        timestamp: new Date().toISOString()
      }),
      { headers }
    );
  } catch (error) {
    console.error('Error in calculator function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers }
    );
  }
}