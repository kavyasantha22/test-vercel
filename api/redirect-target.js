
export default function handler(req, res) {
  // This is a target endpoint for redirects
  console.log('Redirect target reached at:', new Date().toISOString());
  console.log('Original request method:', req.method);
  
  res.status(200).json({ 
    success: true, 
    message: 'Redirect target reached',
    originalMethod: req.method,
    timestamp: new Date().toISOString()
  });
}
