// Backend API Configuration
export const API_CONFIG = {
  // Production backend URL (Render)
  BACKEND_URL: 'https://weather-dashboard-1bj3.onrender.com',
  
  // Local development backend URL (for testing)
  LOCAL_BACKEND_URL: 'http://localhost:8000',
  
  // Current backend URL to use
  CURRENT_BACKEND_URL: 'https://weather-dashboard-1bj3.onrender.com'
};

// API Endpoints
export const API_ENDPOINTS = {
  CURRENT_WEATHER: (query: string) => `${API_CONFIG.CURRENT_BACKEND_URL}/api/weather/current/${query}`,
  FORECAST: (query: string) => `${API_CONFIG.CURRENT_BACKEND_URL}/api/weather/forecast/${query}`,
  HEALTH_CHECK: `${API_CONFIG.CURRENT_BACKEND_URL}/`
};
