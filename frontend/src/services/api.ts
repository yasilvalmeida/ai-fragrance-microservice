import axios from 'axios';
import { FragranceRequest, FragranceResponse } from '@/types/fragrance';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Invalid request data.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error(
        'Request timeout. The AI is taking longer than expected.'
      );
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    throw error;
  }
);

export const fragranceApi = {
  async getRecommendations(
    request: FragranceRequest
  ): Promise<FragranceResponse> {
    try {
      const response = await api.post<FragranceResponse>(
        '/fragrance/match',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get fragrance recommendations:', error);
      throw error;
    }
  },

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

export default api;
