import { API_BASE_URL } from './config.js';

const API_URL = `${API_BASE_URL}/products`;

const getAuthHeaders = (isMultipart = false) => {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (!isMultipart) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
};

export const productService = {
    getProducts: async () => {
        const response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
    },

    updateOrder: async (orderId, updateData) => {
        // Check if we are updating status or payment status
        if (updateData.paymentStatus) {
            const response = await fetch(`${API_URL}/orders/${orderId}/payment-status?status=${updateData.paymentStatus}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
            });
            if (!response.ok) throw new Error('Failed to update payment status');
            return true; // Endpoint returns void
        }

        // Default to status update
        const response = await fetch(`${API_URL}/orders/${orderId}/status?status=${updateData.status}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to update order status');
        return true;
    },

    addProduct: async (formData) => {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: getAuthHeaders(true), // Content-Type is handled by browser for FormData
            body: formData,
        });
        if (!response.ok) throw new Error("Failed to create product");
        return response.json();
    },

    updateProduct: async (id, formData) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(true),
            body: formData,
        });
        if (!response.ok) throw new Error("Failed to update product");
        return response.json();
    },

    deleteProduct: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to delete product");
        return true;
    }
};
