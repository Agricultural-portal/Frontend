import { API_BASE_URL } from './config.js';

const API_URL = `${API_BASE_URL}/farmer`;

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

export const updateProfileImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${API_URL}/profile/image`, {
        method: "POST",
        headers: getAuthHeaders(true), // Don't set Content-Type for FormData
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload profile image");
    }

    return response.json();
};

export const getFarmerProfile = async () => {
    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch farmer profile");
    }

    return response.json();
};

export const updateFarmerProfile = async (data) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update farmer profile");
    }

    return response.json();
};
