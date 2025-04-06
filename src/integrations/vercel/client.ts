// Vercel Edge Functions client

// Base URL for API calls - use absolute URL in development, relative in production
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8080' : '';

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API request failed with status ${response.status}`);
  }
  return response.json();
}

// Client for Vercel Edge Functions
export const vercelEdge = {
  // Health check function
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/api/health-check`);
    return handleResponse(response);
  },

  // Message echo function
  async messageEcho(message: string) {
    const response = await fetch(`${API_BASE_URL}/api/message-echo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    return handleResponse(response);
  },

  // Random joke function
  async randomJoke() {
    const response = await fetch(`${API_BASE_URL}/api/random-joke`);
    return handleResponse(response);
  },
  
  // URL shortener function
  async shortenUrl(url: string) {
    const response = await fetch(`${API_BASE_URL}/api/url-shortener`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    return handleResponse(response);
  },
  
  // Transform data function
  async transformData(data: any[], transformType: string, options: Record<string, any> = {}) {
    const response = await fetch(`${API_BASE_URL}/api/transform-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        transformType,
        ...options
      }),
    });
    return handleResponse(response);
  },
  
  // Weather function
  async getWeather(location: string) {
    const response = await fetch(`${API_BASE_URL}/api/weather?location=${encodeURIComponent(location)}`);
    return handleResponse(response);
  },

  // Counter function
  async getCounter() {
    const response = await fetch(`${API_BASE_URL}/api/counter`);
    return handleResponse(response);
  },

  // Text transform function
  async transformText(text: string, transformType: string = 'uppercase') {
    const response = await fetch(`${API_BASE_URL}/api/text-transform`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, transformType }),
    });
    return handleResponse(response);
  },

  // Calculator function
  async calculate(num1: number, num2: number, operation: string = 'add') {
    const response = await fetch(`${API_BASE_URL}/api/calculator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ num1, num2, operation }),
    });
    return handleResponse(response);
  }
};