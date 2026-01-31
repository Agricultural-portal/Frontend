import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
  /**
   * Register a new farmer
   * @param {Object} data - Farmer registration data
   * @returns {Promise}
   */
  registerFarmer: async (data) => {
    try {
      const farmerData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        addresss: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        password: data.password,
        farmSize: data.farmSize,
        farmType: data.farmType,
      };

      const response = await api.post('/auth/signup/farmer', farmerData);
      return { success: true, message: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Registration failed';
      throw new Error(message);
    }
  },

  /**
   * Register a new buyer
   * @param {Object} data - Buyer registration data
   * @returns {Promise}
   */
  registerBuyer: async (data) => {
    try {
      const buyerData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        addresss: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        password: data.password,
      };

      const response = await api.post('/auth/signup/buyer', buyerData);
      return { success: true, message: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Registration failed';
      throw new Error(message);
    }
  },

  /**
   * Register a new admin
   * @param {Object} data - Admin registration data
   * @returns {Promise}
   */
  registerAdmin: async (data) => {
    try {
      const adminData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        addresss: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        password: data.password,
      };

      const response = await api.post('/auth/signup/admin', adminData);
      return { success: true, message: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Registration failed';
      throw new Error(message);
    }
  },

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} - Returns user data and token
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Decode token to get user info
      const decodedToken = jwtDecode(token);
      
      // Extract role from token (handle different formats)
      let role = decodedToken.role;
      if (!role && decodedToken.authorities) {
        // If authorities is an array of objects with authority property
        if (Array.isArray(decodedToken.authorities)) {
          role = decodedToken.authorities[0]?.authority?.replace('ROLE_', '') || 
                 decodedToken.authorities[0]?.replace('ROLE_', '');
        }
      }
      
      const user = {
        email: decodedToken.sub, // Subject is usually the email/username
        userId: decodedToken.userId,
        role: role,
        exp: decodedToken.exp,
      };
      
      console.log('Decoded user from JWT:', user); // Debug log

      // Store user info
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, token, user };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Login failed';
      throw new Error(message);
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;

      const user = JSON.parse(userStr);
      
      // Check if token is expired
      if (user.exp && Date.now() >= user.exp * 1000) {
        authService.logout();
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  /**
   * Get token from localStorage
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;
