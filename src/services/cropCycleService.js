import { API_BASE_URL } from './config.js';

const API_URL = `${API_BASE_URL}/crop-cycles`;

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

export const cropCycleService = {
    getAllCropCycles: async () => {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch crop cycles");
        return response.json();
    },

    getCropCycleById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch crop cycle");
        return response.json();
    },

    createCropCycle: async (cropCycleData) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(cropCycleData),
        });
        if (!response.ok) throw new Error("Failed to create crop cycle");
        return response.json();
    },

    updateCropCycle: async (id, cropCycleData) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(cropCycleData),
        });
        if (!response.ok) throw new Error("Failed to update crop cycle");
        return response.json();
    },

    deleteCropCycle: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to delete crop cycle");
        // Returns 204 No Content usually
        return true;
    }
};
