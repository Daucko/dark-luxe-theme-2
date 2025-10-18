import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
    // Set default authorization header for all future requests
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    delete apiClient.defaults.headers.common['Authorization'];
  },

  // Initialize token from localStorage on app start
  initializeToken: (): void => {
    const token = tokenManager.getToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
};

// Request interceptor to add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      tokenManager.removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth?action=login', {
        email,
        password,
      });

      const { user, token } = response.data;

      // Store token in localStorage
      if (token) {
        tokenManager.setToken(token);
      }

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (
    email: string,
    password: string,
    name: string,
    role: string
  ) => {
    try {
      const response = await apiClient.post('/auth?action=register', {
        email,
        password,
        name,
        role,
      });

      const { user, token } = response.data;

      // Store token in localStorage
      if (token) {
        tokenManager.setToken(token);
      }

      return { user, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth?action=me');
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  logout: () => {
    tokenManager.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  googleAuth: async (googleData: any) => {
    try {
      const response = await apiClient.post('/auth?action=google', googleData);

      const { user, token } = response.data;

      // Store token in localStorage
      if (token) {
        tokenManager.setToken(token);
      }

      return { user, token };
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  },
};

// Initialize token when the module loads
if (typeof window !== 'undefined') {
  tokenManager.initializeToken();
}

export default apiClient;
