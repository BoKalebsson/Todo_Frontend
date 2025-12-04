import React from "react";
import TaskCard from "./TaskCard.jsx";

function TaskList({ tasks, onEdit, onDelete, onComplete }) {
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
        />
      ))}
    </div>
  );
}

export default TaskList;
