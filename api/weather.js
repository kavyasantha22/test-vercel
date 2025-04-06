// Vercel Edge Function for weather data
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
    // Get location from query params or default to London
    const url = new URL(req.url);
    const location = url.searchParams.get('location') || 'London';
    
    console.log(`Fetching weather data for: ${location}`);
    
    // Fetch weather data from public API
    const weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY || 'demo_key'}&q=${encodeURIComponent(location)}&aqi=no`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API responded with status: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();
    
    // Format the response
    const formattedData = {
      location: weatherData.location.name,
      country: weatherData.location.country,
      temperature: {
        celsius: weatherData.current.temp_c,
        fahrenheit: weatherData.current.temp_f
      },
      condition: weatherData.current.condition.text,
      humidity: weatherData.current.humidity,
      wind: {
        kph: weatherData.current.wind_kph,
        mph: weatherData.current.wind_mph,
        direction: weatherData.current.wind_dir
      },
      last_updated: weatherData.current.last_updated,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(formattedData),
      { headers }
    );
  } catch (error) {
    console.error("Error in weather function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch weather data",
        message: error.message || "Unknown error occurred"
      }),
      { 
        status: 500,
        headers 
      }
    );
  }
}