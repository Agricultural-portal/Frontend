const API_URL = "http://localhost:8080/api/finance";

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

export const financeService = {
    addTransaction: async (transactionData) => {
        const response = await fetch(`${API_URL}/add`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(transactionData),
        });
        if (!response.ok) throw new Error("Failed to add transaction");
        return response.json();
    },

    getTransactionsByUser: async () => {
        const response = await fetch(`${API_URL}/my-transactions`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch user transactions");
        return response.json();
    },

    getTransactionsByCropCycle: async (cropCycleId) => {
        const response = await fetch(`${API_URL}/crop-cycle/${cropCycleId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch crop cycle transactions");
        return response.json();
    },

    getTransactionsByOrder: async (orderId) => {
        const response = await fetch(`${API_URL}/order/${orderId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch order transactions");
        return response.json();
    },

    getFinancialSummary: async () => {
        const response = await fetch(`${API_URL}/summary`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch financial summary");
        return response.json();
    },

    getMonthlyTrend: async (year = 0) => {
        const response = await fetch(`${API_URL}/trend?year=${year}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch monthly trend");
        return response.json();
    },

    getMonthlySummary: async (month, year) => {
        const response = await fetch(`${API_URL}/summary/monthly?month=${month}&year=${year}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch monthly summary");
        return response.json();
    },

    getRecentTransactions: async (type = "all", limit = 5) => {
        const response = await fetch(`${API_URL}/recent?type=${type}&limit=${limit}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch recent transactions");
        return response.json();
    },
};
