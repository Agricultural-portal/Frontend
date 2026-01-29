const API_URL = "http://localhost:8080/api/subtasks";

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

export const subtaskService = {
    getSubtasksByCropId: async (cropCycleId) => {
        const response = await fetch(`${API_URL}/crop-cycle/${cropCycleId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch subtasks");
        return response.json();
    },

    createSubtask: async (cropCycleId, subtaskData) => {
        const response = await fetch(`${API_URL}/crop-cycle/${cropCycleId}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(subtaskData),
        });
        if (!response.ok) throw new Error("Failed to create subtask");
        return response.json();
    },

    updateSubtask: async (id, subtaskData) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(subtaskData),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to update subtask");
        }
        return response.json();
    },

    updateSubtaskStatus: async (id, status) => {
        // Backend expects status as query param
        const response = await fetch(`${API_URL}/${id}/status?status=${status}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to update subtask status");
        return response.json();
    },

    deleteSubtask: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to delete subtask");
        return true;
    }
};
