const API_URL = "http://localhost:8080/api/dashboard";
const FINANCE_URL = "http://localhost:8080/api/finance";

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

export const dashboardService = {
    getStats: async () => {
        const response = await fetch(`${API_URL}/stats`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        return response.json();
    },

    getRecentTasks: async () => {
        const response = await fetch(`${API_URL}/recent-tasks`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch recent tasks");
        return response.json();
    },

    getMonthlySales: async (year) => {
        // year is optional, backend handles if null
        const url = year ? `${FINANCE_URL}/trend?year=${year}` : `${FINANCE_URL}/trend`;
        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch monthly sales");
        return response.json();
    }
};
