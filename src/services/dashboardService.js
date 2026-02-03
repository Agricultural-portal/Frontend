import { API_BASE_URL } from './config.js';

const API_URL = `${API_BASE_URL}/dashboard`;
const FINANCE_URL = `${API_BASE_URL}/finance`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    console.log("[dashboardService] Token from localStorage:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    } else {
        console.error("[dashboardService] NO TOKEN FOUND in localStorage!");
    }
    return headers;
};

export const dashboardService = {
    getStats: async () => {
        console.log("[dashboardService] Fetching stats from:", `${API_URL}/stats`);
        const headers = getAuthHeaders();
        console.log("[dashboardService] Request headers:", headers);
        
        const response = await fetch(`${API_URL}/stats`, {
            method: "GET",
            headers,
        });
        
        console.log("[dashboardService] Stats response status:", response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error("[dashboardService] Stats error response:", errorText);
            throw new Error(`Failed to fetch dashboard stats: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log("[dashboardService] Stats data received:", data);
        return data;
    },

    getRecentTasks: async () => {
        console.log("[dashboardService] Fetching recent tasks from:", `${API_URL}/recent-tasks`);
        const headers = getAuthHeaders();
        
        const response = await fetch(`${API_URL}/recent-tasks`, {
            method: "GET",
            headers,
        });
        
        console.log("[dashboardService] Recent tasks response status:", response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error("[dashboardService] Recent tasks error:", errorText);
            throw new Error(`Failed to fetch recent tasks: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log("[dashboardService] Recent tasks count:", data.length);
        return data;
    },

    getMonthlySales: async (year) => {
        const url = year ? `${FINANCE_URL}/trend?year=${year}` : `${FINANCE_URL}/trend`;
        console.log("[dashboardService] Fetching monthly sales from:", url);
        const headers = getAuthHeaders();
        
        const response = await fetch(url, {
            method: "GET",
            headers,
        });
        
        console.log("[dashboardService] Monthly sales response status:", response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error("[dashboardService] Monthly sales error:", errorText);
            throw new Error(`Failed to fetch monthly sales: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log("[dashboardService] Monthly sales data:", data);
        return data;
    }
};
