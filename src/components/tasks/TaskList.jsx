import React from "react";
import TaskCard from "./TaskCard.jsx";
import { useInProgressTasks } from "../../hooks/useInProgressTasks.js";

function TaskList({ tasks, onEdit, onDelete, onComplete, users }) {
  const { inProgressTasks, toggleTask } = useInProgressTasks();
  if (!tasks || tasks.length === 0) {
    return <p className="text-muted">No tasks found.</p>;
  }

  return (
    <div className="list-group">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
          users={users}
          inProgressTasks={inProgressTasks}
          toggleTask={toggleTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
