// Vercel API route to proxy requests to your HTTP backend
// This bypasses the mixed content (HTTPS -> HTTP) issue

import { BACKEND_CONFIG } from '../vercel-config.js';

const BACKEND_URL = BACKEND_CONFIG.BACKEND_URL;

export default async function handler(req, res) {
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  // Build the full URL
  const url = `${BACKEND_URL}/${apiPath}`;
  
  // Forward query parameters
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach(key => {
    if (key !== 'path') {
      queryParams.append(key, req.query[key]);
    }
  });
  
  const fullUrl = queryParams.toString() ? `${url}?${queryParams}` : url;
  
  try {
    // Prepare headers (exclude host and other problematic headers)
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization header if present
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    
    // Prepare request options
    const options = {
      method: req.method,
      headers,
    };
    
    // Add body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }
    }
    
    // Make request to backend
    const response = await fetch(fullUrl, options);
    
    // Get response data
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Forward response status and data
    res.status(response.status);
    
    // Forward important headers
    const headersToForward = ['content-type', 'cache-control', 'etag'];
    headersToForward.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    });
    
    // Send response
    if (typeof data === 'string') {
      res.send(data);
    } else {
      res.json(data);
    }
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy request failed',
      message: error.message 
    });
  }
}