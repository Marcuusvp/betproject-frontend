import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy configurado no Vite
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logs (desenvolvimento)
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('[API Error]', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
      });
    } else if (error.request) {
      console.error('[API Error] No response received', error.request);
    } else {
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;