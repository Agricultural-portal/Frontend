// Central API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('📡 API Configuration loaded:', API_BASE_URL);
