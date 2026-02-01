const API_URL = "http://localhost:8080/api/task";

const getAuthHeaders = () => {
  const currentUserStr = localStorage.getItem("currentUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const token = currentUser?.token;
  
  // Also check standalone token as fallback
  const standaloneToken = localStorage.getItem("token");
  const finalToken = token || standaloneToken;

  console.log("[taskService] currentUser from localStorage:", currentUser ? currentUser.email : "NO USER");
  console.log("[taskService] Token from currentUser:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
  console.log("[taskService] Standalone token:", standaloneToken ? `${standaloneToken.substring(0, 20)}...` : "NO TOKEN");
  console.log("[taskService] Final token used:", finalToken ? `${finalToken.substring(0, 20)}...` : "NO TOKEN");

  const headers = {
    "Content-Type": "application/json",
  };
  if (finalToken) {
    headers["Authorization"] = `Bearer ${finalToken}`;
    console.log("[taskService] Using auth token for user:", currentUser?.email || "unknown");
  } else {
    console.error("[taskService] NO AUTH TOKEN FOUND in localStorage!");
  }
  return headers;
};

export const taskService = {
  getAllTasks: async (category, status) => {
    let url = `${API_URL}/alltask`;
    const params = new URLSearchParams();
    if (category && category !== "All Tasks") params.append("category", category);
    if (status && status !== "All Tasks") params.append("status", status);

    if (params.toString()) url += `?${params.toString()}`;

    console.log("[taskService] Fetching all tasks from:", url);
    const headers = getAuthHeaders();
    console.log("[taskService] Request headers:", headers);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    
    console.log("[taskService] getAllTasks response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[taskService] getAllTasks error response:", errorText);
      throw new Error(`Failed to fetch tasks: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log("[taskService] Tasks fetched, count:", data.length);
    return data;
  },

  createTask: async (taskData) => {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  updateTask: async (taskId, taskData) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  completeTask: async (taskId) => {
    const response = await fetch(`${API_URL}/${taskId}/complete`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to complete task");
    // Returns void/200 OK
    return true;
  },

  deleteTask: async (taskId) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return true;
  }
};
