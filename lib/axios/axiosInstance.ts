// lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Using environment variable for base URL
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(typeof window !== 'undefined' && { 'Origin': window.location.origin }), // Conditionally set the Origin header
  },
  withCredentials: true, // Send cookies with requests
});


// Optional: Set up interceptors for request/response handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token'); // Or use cookies for SSR

    // Only set the Authorization header if the token is valid
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No valid token found, skipping Authorization header');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    if (error.response) {
      // Check for specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized error (e.g., redirect to login)
        window.location.href = '/signin';
      } else if (error.response.status >= 500) {
        // Handle server errors
        alert('A server error occurred. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
