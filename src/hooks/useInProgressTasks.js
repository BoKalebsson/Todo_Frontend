import { useState, useEffect } from "react";

export const useInProgressTasks = () => {
  // Initialize inProgressTasks from localStorage, or use an empty array:
  const [inProgressTasks, setInProgressTasks] = useState(() => {
    const stored = localStorage.getItem("inProgressTasks");
    return stored ? JSON.parse(stored) : [];
  });

  // Save changes to localStorage, if state changes:
  useEffect(() => {
    localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));
  }, [inProgressTasks]);

  // Adds the task to the list of tasks in progress:
  const startTask = (taskId) => {
    if (!inProgressTasks.includes(taskId)) {
      setInProgressTasks([...inProgressTasks, taskId]);
    }
  };

  // Removes the task from the list of tasks in progress:
  const stopTask = (taskId) => {
    setInProgressTasks(inProgressTasks.filter((id) => id !== taskId));
  };

  // Toggles between stopTask and startTask:
  const toggleTask = (taskId) => {
    if (inProgressTasks.includes(taskId)) {
      stopTask(taskId);
    } else {
      startTask(taskId);
    }
  };

  return { inProgressTasks, startTask, stopTask, toggleTask };
};
