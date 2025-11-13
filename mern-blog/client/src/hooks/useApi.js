import { useState } from 'react';
import axios from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const config = {
        method,
        url: `http://localhost:5000${url}`,
        data,
        timeout: 10000 // 10 second timeout
      };
      
      const response = await axios(config);
      return response.data;
    } catch (err) {
      let errorMessage = 'Something went wrong';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request made but no response received
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else {
        // Something else happened
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    clearError,
    get: (url) => makeRequest('get', url),
    post: (url, data) => makeRequest('post', url, data),
    put: (url, data) => makeRequest('put', url, data),
    delete: (url) => makeRequest('delete', url)
  };
};

export default useApi;