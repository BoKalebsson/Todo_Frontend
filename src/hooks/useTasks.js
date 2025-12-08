import { useState } from "react";
import { taskService } from "../services/taskService.js";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [formShouldReset, setFormShouldReset] = useState(false);

  async function loadTasks() {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error.message);
    }
  }

  async function submitTask(todo, files) {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, todo, files);
      } else {
        await taskService.createTask(todo, files);
      }

      await loadTasks();
      setEditingTask(null);

      triggerFormReset();
    } catch (error) {
      console.error("Failed to submit task:", error.message);
    }
  }

  async function deleteTask(id) {
    try {
      await taskService.removeTask(id);
      await loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error.message);
    }
  }

  async function toggleComplete(task) {
    try {
      const updated = { ...task, completed: !task.completed };
      await taskService.updateTask(task.id, updated, []);
      await loadTasks();
    } catch (error) {
      console.error("Failed to update task:", error.message);
    }
  }

  function startEdit(task) {
    setEditingTask(task);
  }

  function cancelEdit() {
    setEditingTask(null);
  }

  function triggerFormReset() {
    setFormShouldReset(true);
  }

  function acknowledgeFormResetHandled() {
    setFormShouldReset(false);
  }

  return {
    tasks,
    editingTask,
    loadTasks,
    submitTask,
    deleteTask,
    toggleComplete,
    startEdit,
    cancelEdit,
    formShouldReset,
    acknowledgeFormResetHandled,
  };
}
