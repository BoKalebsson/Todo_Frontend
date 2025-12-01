import { authService } from "./authService";

const API_URL = "http://localhost:9090/api/todo";

export const taskService = {
  getAllTasks: async () => {
    try {
      const token = authService.getToken();

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch tasks.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in getAllTasks():", error.message);
      throw error;
    }
  },

  createTask: async (todo, files) => {
    try {
      const token = authService.getToken();
      const formData = new FormData();

      formData.append(
        "todo",
        new Blob([JSON.stringify(todo)], { type: "application/json" })
      );

      if (files && files.length > 0) {
        for (let file of files) {
          formData.append("files", file);
        }
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend returned non-JSON error:", text);
        throw new Error("Failed to create task.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in createTask()", error);
      throw error;
    }
  },

  update: async (id, todo, files) => {
    // Will be implemented here.
  },

  removeTask: async (id) => {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend returned non-JSON error:", text);
        throw new Error("Failed to delete task.");
      }

      return true;
    } catch (error) {
      console.error("Error in remove()", error);
      throw error;
    }
  },

  getByPerson: async (personId) => {
    // Will be implemented here.
  },

  getByStatus: async (completedStatus) => {
    // Will be implemented here.
  },
};
