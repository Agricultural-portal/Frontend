const API_URL = "http://localhost:8080/api/orders";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

export const orderService = {
    getOrders: async () => {
        const response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch orders");
        return response.json();
    },

    getOrdersByProduct: async (productId) => {
        const response = await fetch(`${API_URL}/product/${productId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch product orders");
        return response.json();
    },

    getOrderById: async (orderId) => {
        const response = await fetch(`${API_URL}/${orderId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch order details");
        return response.json();
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await fetch(`${API_URL}/${orderId}/status?status=${status}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to update order status");
    },

    updatePaymentStatus: async (orderId, status) => {
        const response = await fetch(`${API_URL}/${orderId}/payment-status?status=${status}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to update payment status");
    },
};
