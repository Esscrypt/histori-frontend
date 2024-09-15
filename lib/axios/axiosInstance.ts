// lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Using environment variable for base URL
    timeout: 5000, // 5 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'), // Attach token to all requests
        'Access-Control-Allow-Origin': '*' // Allow requests from any origin
    },
    withCredentials: true, // Send cookies with requests
    
});

// Optional: Set up interceptors for request/response handling
axiosInstance.interceptors.request.use(
  (config) => {
    // You can attach tokens to headers here if needed
    const token = localStorage.getItem('token'); // Or use cookies for SSR
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
