import api from './api';

const adminService = {
  /**
   * Get all farmers
   * @returns {Promise<Array>}
   */
  getAllFarmers: async () => {
    try {
      const response = await api.get('/admin/farmers');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to fetch farmers';
      throw new Error(message);
    }
  },

  /**
   * Get all buyers
   * @returns {Promise<Array>}
   */
  getAllBuyers: async () => {
    try {
      const response = await api.get('/admin/buyers');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to fetch buyers';
      throw new Error(message);
    }
  },

  /**
   * Create a new farmer (uses existing signup endpoint)
   * @param {Object} data - Farmer data
   * @returns {Promise}
   */
  createFarmer: async (data) => {
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
      const message = error.response?.data?.message || error.response?.data || 'Failed to create farmer';
      throw new Error(message);
    }
  },

  /**
   * Create a new buyer (uses existing signup endpoint)
   * @param {Object} data - Buyer data
   * @returns {Promise}
   */
  createBuyer: async (data) => {
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
      const message = error.response?.data?.message || error.response?.data || 'Failed to create buyer';
      throw new Error(message);
    }
  },

  /**
   * Update user details
   * @param {number} userId - User ID
   * @param {Object} data - Updated user data
   * @returns {Promise}
   */
  updateUser: async (userId, data) => {
    try {
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        addresss: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      };

      // Add farmer-specific fields if present
      if (data.farmSize) updateData.farmSize = data.farmSize;
      if (data.farmType) updateData.farmType = data.farmType;

      const response = await api.put(`/admin/users/${userId}`, updateData);
      return { success: true, message: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to update user';
      throw new Error(message);
    }
  },

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return { success: true, message: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to delete user';
      throw new Error(message);
    }
  },

  /**
   * Toggle user status (activate/suspend)
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  toggleUserStatus: async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`);
      return { success: true, message: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to update status';
      throw new Error(message);
    }
  },

  /**
   * Approve pending user
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  approveUser: async (userId) => {
    try {
      const response = await api.put(`/admin/approve/${userId}`);
      return { success: true, message: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to approve user';
      throw new Error(message);
    }
  },

  /**
   * Get total farmers count
   * @returns {Promise<number>}
   */
  getTotalFarmersCount: async () => {
    try {
      const response = await api.get('/admin/count/total-farmers');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch farmers count');
    }
  },

  /**
   * Get total buyers count
   * @returns {Promise<number>}
   */
  getTotalBuyersCount: async () => {
    try {
      const response = await api.get('/admin/count/total-buyers');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch buyers count');
    }
  },

  /**
   * Get total orders count
   * @returns {Promise<number>}
   */
  getTotalOrdersCount: async () => {
    try {
      const response = await api.get('/admin/count/total-orders');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch orders count');
    }
  },

  /**
   * Get total revenue
   * @returns {Promise<number>}
   */
  getTotalRevenue: async () => {
    try {
      const response = await api.get('/admin/revenue');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch revenue');
    }
  },

  /**
   * Get all orders
   * @returns {Promise<Array>}
   */
  getAllOrders: async () => {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to fetch orders';
      throw new Error(message);
    }
  },

  /**
   * Update order status
   * @param {number} orderId - Order ID
   * @param {string} status - New status (PENDING, APPROVED, REJECTED, DELIVERED, CANCELLED)
   * @returns {Promise}
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      return { success: true, message: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to update order status';
      throw new Error(message);
    }
  },

  /**
   * Get order statistics by status
   * @returns {Promise<Object>}
   */
  getOrderStats: async () => {
    try {
      const response = await api.get('/admin/orders/stats');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch order statistics');
    }
  },

  /**
   * Get order by ID
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>}
   */
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to fetch order';
      throw new Error(message);
    }
  },

  // ==================== Government Schemes Management ====================

  /**
   * Get all government schemes
   * @param {boolean} isActive - Filter by active status (optional)
   * @returns {Promise<Array>}
   */
  getAllSchemes: async (isActive = null) => {
    try {
      const params = isActive !== null ? { isActive } : {};
      const response = await api.get('/admin/schemes', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to fetch schemes';
      throw new Error(message);
    }
  },

  /**
   * Get scheme statistics
   * @returns {Promise<Object>}
   */
  getSchemeStats: async () => {
    try {
      const response = await api.get('/admin/schemes/stats');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch scheme statistics');
    }
  },

  /**
   * Get scheme by ID
   * @param {number} schemeId - Scheme ID
   * @returns {Promise<Object>}
   */
  getSchemeById: async (schemeId) => {
    try {
      const response = await api.get(`/admin/schemes/${schemeId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to fetch scheme';
      throw new Error(message);
    }
  },

  /**
   * Create a new government scheme
   * @param {Object} schemeData - Scheme data
   * @returns {Promise<Object>}
   */
  createScheme: async (schemeData) => {
    try {
      const response = await api.post('/admin/schemes', schemeData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to create scheme';
      throw new Error(message);
    }
  },

  /**
   * Update a government scheme
   * @param {number} schemeId - Scheme ID
   * @param {Object} schemeData - Updated scheme data
   * @returns {Promise<Object>}
   */
  updateScheme: async (schemeId, schemeData) => {
    try {
      const response = await api.put(`/admin/schemes/${schemeId}`, schemeData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to update scheme';
      throw new Error(message);
    }
  },

  /**
   * Delete a government scheme
   * @param {number} schemeId - Scheme ID
   * @returns {Promise}
   */
  deleteScheme: async (schemeId) => {
    try {
      const response = await api.delete(`/admin/schemes/${schemeId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to delete scheme';
      throw new Error(message);
    }
  },};

export default adminService;