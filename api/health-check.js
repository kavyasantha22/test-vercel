
export default function handler(req, res) {
  // This endpoint will be called every 30 minutes by Vercel Cron
  console.log('Running health check at:', new Date().toISOString());
  
  // Check if a redirect parameter is present
  const shouldRedirect = req.query.redirect === 'true';
  
  if (shouldRedirect) {
    // Implement a 307 Temporary Redirect
    // This preserves the HTTP method used in the original request
    const redirectUrl = req.query.url || '/api/redirect-target';
    console.log(`Performing 307 redirect to: ${redirectUrl}`);
    return res.redirect(307, redirectUrl);
  }
  
  // Regular health check response
  res.status(200).json({ 
    success: true, 
    message: 'Health check completed',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
