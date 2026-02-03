import { API_BASE_URL } from './config.js';

const API_URL = `${API_BASE_URL}/admin`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const adminService = {
    // Get all farmers
    getAllFarmers: async () => {
        const response = await fetch(`${API_URL}/farmers`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to fetch farmers');
        }
        return response.json();
    },

    // Get all buyers
    getAllBuyers: async () => {
        const response = await fetch(`${API_URL}/buyers`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to fetch buyers');
        }
        return response.json();
    },

    // Get all orders
    getAllOrders: async () => {
        const response = await fetch(`${API_URL}/orders`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        return response.json();
    },

    // Get order statistics
    getOrderStats: async () => {
        const response = await fetch(`${API_URL}/orders/stats`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to fetch order stats');
        }
        return response.json();
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to update order status');
        }
        return response.text();
    },

    // Update user status
    toggleUserStatus: async (userId) => {
        const response = await fetch(`${API_URL}/users/${userId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to update user status');
        }
        return response.json();
    },

    // Delete user (soft delete)
    deleteUser: async (userId) => {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        return response.json();
    },

    // Update user details
    updateUser: async (userId, userData) => {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        return response.json();
    },

    // Get statistics
    getStatistics: async () => {
        const [totalFarmers, activeFarmers, totalBuyers, activeBuyers, totalOrders, revenue] = await Promise.all([
            fetch(`${API_URL}/count/total-farmers`, { headers: getAuthHeaders() }).then(r => r.json()),
            fetch(`${API_URL}/count/active-farmers`, { headers: getAuthHeaders() }).then(r => r.json()),
            fetch(`${API_URL}/count/total-buyers`, { headers: getAuthHeaders() }).then(r => r.json()),
            fetch(`${API_URL}/count/active-buyers`, { headers: getAuthHeaders() }).then(r => r.json()),
            fetch(`${API_URL}/count/total-orders`, { headers: getAuthHeaders() }).then(r => r.json()),
            fetch(`${API_URL}/revenue`, { headers: getAuthHeaders() }).then(r => r.json())
        ]);

        return {
            totalFarmers,
            activeFarmers,
            totalBuyers,
            activeBuyers,
            totalOrders,
            revenue
        };
    },

    // Get all schemes
    getAllSchemes: async () => {
        const response = await fetch(`${API_URL}/schemes`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to fetch schemes');
        }
        return response.json();
    },

    // Get scheme statistics
    getSchemeStats: async () => {
        const response = await fetch(`${API_URL}/schemes/stats`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to fetch scheme stats');
        }
        return response.json();
    },

    // Create new scheme
    createScheme: async (schemeData) => {
        const response = await fetch(`${API_URL}/schemes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(schemeData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to create scheme');
        }
        return response.json();
    },

    // Update scheme
    updateScheme: async (schemeId, schemeData) => {
        const response = await fetch(`${API_URL}/schemes/${schemeId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(schemeData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to update scheme');
        }
        return response.json();
    },

    // Delete scheme
    deleteScheme: async (schemeId) => {
        const response = await fetch(`${API_URL}/schemes/${schemeId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to delete scheme');
        }
        return response.text();
    }
};

export default adminService;
