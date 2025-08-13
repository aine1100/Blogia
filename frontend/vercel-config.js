// Configuration for Vercel deployment
// Update this file with your ECS backend IP

export const BACKEND_CONFIG = {
  // Your ECS backend URL (get from: get-ecs-ip.bat)
  BACKEND_URL: 'http://54.82.232.68:8000',
  
  // Alternative: Use environment variable
  // BACKEND_URL: process.env.BACKEND_URL || 'http://54.82.232.68:8000',
};

export default BACKEND_CONFIG;