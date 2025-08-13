// Special handler for login endpoint that uses FormData
import { BACKEND_CONFIG } from '../../vercel-config.js';

const BACKEND_URL = BACKEND_CONFIG.BACKEND_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { username, password } = req.body;
    
    // Create FormData for the backend
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Login proxy error:', error);
    res.status(500).json({ 
      error: 'Login request failed',
      message: error.message 
    });
  }
}