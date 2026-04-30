import axios from 'axios';

const defaultBaseURL = import.meta.env.DEV ? 'http://localhost:8000' : '/_/backend';

const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
const RETRY_ATTEMPTS = Number(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3;
const RETRY_DELAY = 1000;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseURL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryRequest(config, attemptsRemaining) {
  try {
    return await apiClient(config);
  } catch (error) {
    if (attemptsRemaining <= 1) {
      throw error;
    }
    if (error.code === 'ECONN_ABORTED' || error.response?.status >= 500) {
      await delay(RETRY_DELAY * (RETRY_ATTEMPTS - attemptsRemaining + 1));
      return retryRequest(config, attemptsRemaining - 1);
    }
    throw error;
  }
}

apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Request-Time'] = new Date().toISOString();
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const requestTime = response.config.headers['X-Request-Time'];
    if (requestTime && import.meta.env.DEV) {
      const elapsed = Date.now() - new Date(requestTime).getTime();
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url} completed in ${elapsed}ms`);
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    
    if (!config || error.code === 'ECONN_ABORTED') {
      return Promise.reject(new Error(`Request timeout after ${API_TIMEOUT}ms`));
    }
    
    if (error.response?.status >= 500 && !config._retry) {
      config._retry = true;
      try {
        await delay(RETRY_DELAY);
        const response = await apiClient(config);
        return response;
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    
    const errorMessage = error.response?.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
