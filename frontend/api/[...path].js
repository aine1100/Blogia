// api/[...path].js - Catch-all proxy for your backend API

const BACKEND_URL = 'http://54.82.232.68:8000';

export default async function handler(req, res) {
  const { path } = req.query;
  
  // Reconstruct the full path
  const apiPath = Array.isArray(path) ? path.join('/') : path || '';
  const targetUrl = `${BACKEND_URL}/${apiPath}`;
  
  // Add query parameters if they exist
  const url = new URL(targetUrl);
  Object.keys(req.query).forEach(key => {
    if (key !== 'path') {
      url.searchParams.append(key, req.query[key]);
    }
  });

  try {
    // Prepare headers (exclude host and connection headers)
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.connection;
    delete headers['x-forwarded-for'];
    delete headers['x-forwarded-proto'];
    delete headers['x-vercel-id'];
    
    // Make request to your backend
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? 
        (req.body ? JSON.stringify(req.body) : undefined) : undefined,
    });

    // Get response data
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Set response headers
    res.status(response.status);
    
    // Copy important headers from backend response
    const headersToProxy = ['content-type', 'cache-control', 'etag'];
    headersToProxy.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    });

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Send response
    if (typeof data === 'string') {
      res.send(data);
    } else {
      res.json(data);
    }

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      detail: 'Failed to connect to backend API'
    });
  }
}