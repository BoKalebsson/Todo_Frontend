import { authService } from "./authService";

const API_URL = "http://localhost:9090/api/person";

export const userService = {
  getAllUsers: async () => {
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
        throw new Error(error.message || "Failed to fetch users.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in getAllUsers():", error.message);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch user.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in getUserById():", error.message);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend returned non-JSON error:", text);
        throw new Error("Failed to create user.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in createUser():", error.message);
      throw error;
    }
  },

  updateUser: async (id, updateData) => {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const txt = await response.text();
        console.error("Update failed:", txt);
        throw new Error("Failed to update user.");
      }

      return true;
    } catch (error) {
      console.error("Error in updateUser():", error.message);
      throw error;
    }
  },

  deleteUser: async (id) => {
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
        throw new Error("Failed to delete user.");
      }

      return true;
    } catch (error) {
      console.error("Error in deleteUser():", error.message);
      throw error;
    }
  },
};
