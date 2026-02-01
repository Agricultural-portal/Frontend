import api from './api';

const walletService = {
  /**
   * Get wallet balance
   */
  getBalance: async () => {
    try {
      const response = await api.get('/wallet/balance');
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  },

  /**
   * Add money to wallet
   * @param {number} amount - Amount to add
   */
  addMoney: async (amount) => {
    try {
      const response = await api.post('/wallet/add', { amount });
      return response.data;
    } catch (error) {
      console.error('Error adding money to wallet:', error);
      throw error;
    }
  },

  /**
   * Get transaction history
   */
  getTransactions: async () => {
    try {
      const response = await api.get('/wallet/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Format currency
   * @param {number} amount
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }
};

export default walletService;
