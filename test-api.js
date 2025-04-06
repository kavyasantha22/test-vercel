// Simple script to test the API endpoints
import http from 'http';

// Test the health-check endpoint
function testHealthCheck() {
  console.log('Testing health-check endpoint...');
  const options = {
    hostname: 'localhost',
    port: 8082,
    path: '/api/health-check',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Health-check response status:', res.statusCode);
      console.log('Health-check response data:', data);
      // After health check completes, test the message-echo endpoint
      testMessageEcho();
    });
  });

  req.on('error', (e) => {
    console.error('Health-check error:', e.message);
  });

  req.end();
}

// Test the message-echo endpoint
function testMessageEcho() {
  console.log('\nTesting message-echo endpoint...');
  const data = JSON.stringify({
    message: 'Hello World'
  });

  const options = {
    hostname: 'localhost',
    port: 8082,
    path: '/api/message-echo',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      console.log('Message-echo response status:', res.statusCode);
      console.log('Message-echo response data:', responseData);
    });
  });

  req.on('error', (e) => {
    console.error('Message-echo error:', e.message);
  });

  req.write(data);
  req.end();
}

// Start testing
testHealthCheck();