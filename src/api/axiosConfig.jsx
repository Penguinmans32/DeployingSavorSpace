import axios from 'axios';

const API_URL = 'https://penguinman-backend-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false,
  transformResponse: [...axios.defaults.transformResponse, (data) => {
    // If data is already an object, return it
    if (typeof data !== 'string') return data;
    
    try {
      // Clean the data before parsing
      const cleanData = data.trim().replace(/^\uFEFF/, '');
      return JSON.parse(cleanData);
    } catch (error) {
      console.error('Response transform error:', error);
      return data; // Return original data if parsing fails
    }
  }]
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 403 errors and token refresh
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
        localStorage.setItem('authToken', data.token);
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;