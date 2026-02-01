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
        const response = await fetch(`http://localhost:8080/api/farmer/orders/${orderId}/status?status=${status}`, {
            method: "PUT",
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to update order status");
        }
        return response.json();
    },

    updatePaymentStatus: async (orderId, status) => {
        const response = await fetch(`${API_URL}/${orderId}/payment-status?status=${status}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to update payment status");
    },
};
