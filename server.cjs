// Simple Express server to handle API requests locally
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8082;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to execute edge function code
async function executeEdgeFunction(filePath, req, res) {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Create a mock Response object that Edge functions expect
    class MockResponse {
      constructor() {
        this.headers = {};
        this.statusCode = 200;
        this.body = null;
      }
      
      json(data) {
        this.body = JSON.stringify(data);
        this.headers['Content-Type'] = 'application/json';
        return this;
      }
      
      status(code) {
        this.statusCode = code;
        return this;
      }
      
      setHeader(name, value) {
        this.headers[name] = value;
        return this;
      }
      
      end() {
        return this;
      }
    }
    
    // Create a mock Request object
    const mockReq = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      json: async () => req.body
    };
    
    // Create a mock Response constructor
    global.Response = class Response {
      constructor(body, options = {}) {
        this.body = body;
        this.status = options.status || 200;
        this.headers = options.headers || {};
        return this;
      }
    };
    
    // Dynamically import the edge function
    // We need to delete it from cache first to ensure we get the latest version
    const modulePath = require.resolve(filePath);
    if (require.cache[modulePath]) {
      delete require.cache[modulePath];
    }
    
    // Execute the function in a new context
    const handler = require(filePath).default;
    
    // Execute the handler with our mock request
    const result = await handler(mockReq);
    
    // Process the response
    if (result instanceof global.Response) {
      // Set headers
      Object.entries(result.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      
      // Set status and send body
      let responseBody = result.body;
      if (typeof responseBody === 'string') {
        try {
          // Try to parse as JSON
          responseBody = JSON.parse(responseBody);
        } catch (e) {
          // Not JSON, send as is
        }
      }
      
      res.status(result.status).send(responseBody);
    } else {
      // Fallback
      res.json(result || { error: 'No response from function' });
    }
  } catch (error) {
    console.error(`Error executing edge function: ${error.message}`);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}

// Map API routes to their respective files
const apiRoutes = [
  { path: '/api/health-check', file: 'api/health-check.js' },
  { path: '/api/message-echo', file: 'api/message-echo.js' },
  { path: '/api/random-joke', file: 'api/random-joke.js' },
  { path: '/api/url-shortener', file: 'api/url-shortener.js' },
  { path: '/api/transform-data', file: 'api/transform-data.js' },
  { path: '/api/weather', file: 'api/weather.js' },
  // New simple edge functions
  { path: '/api/counter', file: 'api/counter.js' },
  { path: '/api/text-transform', file: 'api/text-transform.js' },
  { path: '/api/calculator', file: 'api/calculator.js' }
];

// Register routes
apiRoutes.forEach(({ path: routePath, file }) => {
  const filePath = path.join(__dirname, file);
  
  app.all(routePath, async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      return res.status(200).end();
    }
    
    console.log(`Handling request to ${routePath}`);
    
    // Execute the edge function
    await executeEdgeFunction(filePath, req, res);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});