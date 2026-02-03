import { API_BASE_URL } from './config.js';

const API_URL = API_BASE_URL;

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

export const govSchemeService = {
    getAllSchemes: async () => {
        const response = await fetch(`${API_URL}/gov-schemes/all`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch government schemes");
        return response.json();
    },

    getSchemeById: async (id) => {
        const response = await fetch(`${API_URL}/gov-schemes/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch scheme details");
        return response.json();
    },
};
