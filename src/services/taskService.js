import { authService } from "./authService";

const API_URL = "http://localhost:9090/api/todo";

export const taskService = {
  getAllTasks: async () => {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_URL}/todo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

  create: async (todo, files) => {
    // Will be implemented here.
  },

  update: async (id, todo, files) => {
    // Will be implemented here.
  },

  remove: async (id) => {
    // Will be implemented here.
  },

  getByPerson: async (personId) => {
    // Will be implemented here.
  },

  getByStatus: async (completedStatus) => {
    // Will be implemented here.
  },
};
