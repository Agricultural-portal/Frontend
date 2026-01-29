const API_URL = "http://localhost:8080/api/task";

const getAuthHeaders = () => {
  const currentUserStr = localStorage.getItem("currentUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const token = currentUser?.token;

  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("Using auth token for user:", currentUser?.email);
  } else {
    console.warn("No auth token found in localStorage (checked 'currentUser')");
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

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
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
