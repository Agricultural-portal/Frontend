import api from './api';

const notificationService = {
  /**
   * Get all notifications for a user
   * @param {number} userId - User ID
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} Notification response
   */
  getNotifications: async (userId, page = 0, size = 20) => {
    try {
      const response = await api.get('/notifications', {
        params: { userId, page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Get unread notifications
   * @param {number} userId - User ID
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} Notification response
   */
  getUnreadNotifications: async (userId, page = 0, size = 20) => {
    try {
      const response = await api.get('/notifications/unread', {
        params: { userId, page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  /**
   * Get unread notification count
   * @param {number} userId - User ID
   * @returns {Promise} Unread count
   */
  getUnreadCount: async (userId) => {
    try {
      const response = await api.get('/notifications/unread-count', {
        params: { userId }
      });
      return response.data.unreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   * @param {number} id - Notification ID
   * @param {number} userId - User ID
   * @returns {Promise} Updated notification
   */
  markAsRead: async (id, userId) => {
    try {
      const response = await api.put(`/notifications/${id}/read`, null, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @param {number} userId - User ID
   * @returns {Promise} Success message
   */
  markAllAsRead: async (userId) => {
    try {
      const response = await api.put('/notifications/read-all', null, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },

  /**
   * Delete a notification
   * @param {number} id - Notification ID
   * @param {number} userId - User ID
   * @returns {Promise} Success message
   */
  deleteNotification: async (id, userId) => {
    try {
      const response = await api.delete(`/notifications/${id}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Get user notification preferences
   * @param {number} userId - User ID
   * @returns {Promise} User preferences
   */
  getPreferences: async (userId) => {
    try {
      const response = await api.get('/notifications/preferences', {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  },

  /**
   * Update notification preference
   * @param {number} userId - User ID
   * @param {string} type - Notification type
   * @param {object} preferenceData - Preference data
   * @returns {Promise} Updated preference
   */
  updatePreference: async (userId, type, preferenceData) => {
    try {
      const response = await api.put(`/notifications/preferences/${type}`, preferenceData, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating preference:', error);
      throw error;
    }
  },

  /**
   * Create default preferences
   * @param {number} userId - User ID
   * @returns {Promise} Success message
   */
  createDefaultPreferences: async (userId) => {
    try {
      const response = await api.post('/notifications/preferences/defaults', null, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating default preferences:', error);
      throw error;
    }
  },

  /**
   * Create a new notification (admin/system use)
   * @param {object} notificationData - Notification data
   * @returns {Promise} Created notification
   */
  createNotification: async (notificationData) => {
    try {
      const response = await api.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  /**
   * Format timestamp for display
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Formatted time
   */
  formatTimestamp: (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
};

export default notificationService;
