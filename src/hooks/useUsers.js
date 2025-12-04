import { useEffect, useState } from "react";
import { userService } from "../services/userService.js";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [formShouldReset, setFormShouldReset] = useState(false);

  const loadUsers = async () => {
    try {
      const result = await userService.getAllUsers();
      setUsers(result);
    } catch (err) {
      console.error("Failed to load users:", err.message);
    }
  };

  const submitUser = async (userData) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
      } else {
        await userService.createUser(userData);
      }

      await loadUsers();

      setFormShouldReset(true);

      setEditingUser(null);
    } catch (err) {
      console.error("Failed to submit user:", err.message);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error("Failed to delete user:", err.message);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormShouldReset(true);
  };

  const acknowledgeFormResetHandled = () => {
    setFormShouldReset(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    editingUser,
    loadUsers,
    submitUser,
    deleteUser,
    startEdit,
    cancelEdit,
    formShouldReset,
    acknowledgeFormResetHandled,
  };
};
