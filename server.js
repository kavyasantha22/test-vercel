// Simple Express server to handle API requests locally
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// __dirname is already available in CommonJS

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
        this.headers = new Map();
        this.statusCode = 200;
        this.body = null;
      }
      
      json(data) {
        this.body = JSON.stringify(data);
        this.headers.set('Content-Type', 'application/json');
        return this;
      }
      
      status(code) {
        this.statusCode = code;
        return this;
      }
      
      setHeader(name, value) {
        this.headers.set(name, value);
        return this;
      }
      
      end() {
        return this;
      }
    }
    
    // Execute the function
    const module = { exports: {} };
    const func = new Function('module', 'require', 'res', 'req', fileContent);
    func(module, require, new MockResponse(), req);
    
    // Get the handler function
    const handler = module.exports.default || module.exports;
    
    // Execute the handler
    const result = await handler(req);
    
    // If result is a Response object (from Edge function)
    if (result && result.headers && result.body) {
      // Set headers
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value);
      }
      
      // Set status and send body
      res.status(result.status || 200).send(result.body);
    } else {
      // Fallback
      res.json(result || { error: 'No response from function' });
    }
  } catch (error) {
    console.error(`Error executing edge function: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

// Map API routes to their respective files
const apiRoutes = [
  { path: '/api/health-check', file: 'api/health-check.js' },
  { path: '/api/message-echo', file: 'api/message-echo.js' },
  { path: '/api/random-joke', file: 'api/random-joke.js' },
  { path: '/api/url-shortener', file: 'api/url-shortener.js' },
  { path: '/api/transform-data', file: 'api/transform-data.js' },
  { path: '/api/weather', file: 'api/weather.js' }
];

// Register routes
apiRoutes.forEach(({ path, file }) => {
  const filePath = join(__dirname, file);
  
  app.all(path, async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      return res.status(200).end();
    }
    
    // Execute the edge function
    await executeEdgeFunction(filePath, req, res);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});