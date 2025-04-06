// Vercel Edge Function for data transformation
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
    
    // Check if data is provided
    if (!body.data || !Array.isArray(body.data)) {
      throw new Error('Invalid data format. Please provide an array of objects in the "data" field');
    }
    
    console.log("Received data for transformation:", body.data.length, "items");
    
    // Apply transformations based on the transformation type
    const transformType = body.transformType || 'default';
    let transformedData;
    
    switch (transformType) {
      case 'filter':
        // Filter data based on criteria
        const filterField = body.filterField || 'id';
        const filterValue = body.filterValue;
        transformedData = body.data.filter(item => item[filterField] === filterValue);
        break;
        
      case 'sort':
        // Sort data based on field
        const sortField = body.sortField || 'id';
        const sortOrder = body.sortOrder || 'asc';
        transformedData = [...body.data].sort((a, b) => {
          if (sortOrder === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
          } else {
            return a[sortField] < b[sortField] ? 1 : -1;
          }
        });
        break;
        
      case 'aggregate':
        // Aggregate data (e.g., sum, count)
        const aggregateField = body.aggregateField || 'value';
        const aggregateType = body.aggregateType || 'sum';
        
        if (aggregateType === 'sum') {
          const sum = body.data.reduce((acc, item) => acc + (Number(item[aggregateField]) || 0), 0);
          transformedData = { result: sum, type: 'sum', field: aggregateField };
        } else if (aggregateType === 'average') {
          const sum = body.data.reduce((acc, item) => acc + (Number(item[aggregateField]) || 0), 0);
          const avg = sum / body.data.length;
          transformedData = { result: avg, type: 'average', field: aggregateField };
        } else if (aggregateType === 'count') {
          transformedData = { result: body.data.length, type: 'count' };
        }
        break;
        
      case 'map':
        // Map/transform each item
        const mapFields = body.mapFields || [];
        transformedData = body.data.map(item => {
          if (mapFields.length === 0) return item;
          
          const newItem = {};
          mapFields.forEach(field => {
            if (item[field] !== undefined) {
              newItem[field] = item[field];
            }
          });
          return newItem;
        });
        break;
        
      default:
        // Default transformation (pass-through with metadata)
        transformedData = body.data;
        break;
    }
    
    // Return the transformed data
    return new Response(
      JSON.stringify({
        transformed: true,
        transformType,
        originalCount: body.data.length,
        resultCount: Array.isArray(transformedData) ? transformedData.length : 1,
        data: transformedData,
        timestamp: new Date().toISOString()
      }),
      { headers }
    );
  } catch (error) {
    console.error("Error in transform-data function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to transform data",
        message: error.message || "Unknown error occurred"
      }),
      { 
        status: 400,
        headers 
      }
    );
  }
}