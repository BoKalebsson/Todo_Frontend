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

  updateTask: async (id, todo, files) => {
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

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const txt = await response.text();
        console.error("Update failed:", txt);
        throw new Error("Failed to update task.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in updateTask()", error);
      throw error;
    }
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

        if (text.includes("Access Denied")) {
          throw new Error("You are not allowed to delete this task.");
        }

        throw new Error("Failed to delete task.");
      }

      return true;
    } catch (error) {
      console.error("Error in remove()", error);
      throw error;
    }
  },

  getByPerson: async (personId) => {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_URL}/user/${personId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend returned non-JSON error:", text);

        if (text.includes("Access Denied")) {
          throw new Error("You are not allowed to view tasks for this user.");
        }

        throw new Error("Failed to fetch tasks for user.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in getByPerson()", error);
      throw error;
    }
  },

  getByStatus: async (completedStatus) => {
    try {
      const token = authService.getToken();

      const response = await fetch(
        `${API_URL}/status?completed=${completedStatus}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend returned non-JSON error:", text);

        if (text.includes("Access Denied")) {
          throw new Error("You are not allowed to view these tasks.");
        }

        throw new Error("Failed to fetch tasks by status.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in getByStatus()", error);
      throw error;
    }
  },
};
