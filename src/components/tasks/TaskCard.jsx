import React from "react";
import { formatDate } from "../../utils/dateUtils";

function TaskCard({
  task,
  onEdit,
  onDelete,
  onComplete,
  users,
  inProgressTasks,
  toggleTask,
}) {
  const assignedPerson = users.find((user) => user.id === task.personId);
  return (
    <div
      className={`list-group-item list-group-item-action ${
        inProgressTasks.includes(task.id) ? "bg-primary bg-opacity-10" : ""
      } ${task.completed ? "bg-success bg-opacity-10" : ""}`}
      onClick={() => toggleTask(task.id)}
    >
      <div className="d-flex w-100 justify-content-between align-items-start">
        {/* Left side: Text + badges */}
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between">
            <h6 className="mb-1">{task.title}</h6>
            <small className="text-muted ms-2">
              Created: {formatDate(task.createdAt)}
            </small>
          </div>

          <p className="mb-1 text-muted small">
            {task.description || "No description"}
          </p>

          <div className="d-flex align-items-center flex-wrap">
            {/* Due date */}
            <small className="text-muted me-2">
              <i className="bi bi-calendar-event"></i> Due:{" "}
              {formatDate(task.dueDate)}
            </small>

            {/* Person */}
            {assignedPerson && (
              <span className="badge bg-info me-2">
                <i className="bi bi-person"></i> {assignedPerson.name}
              </span>
            )}

            {/* Attachments */}
            {task.numberOfAttachments > 0 && (
              <span className="badge bg-secondary me-2">
                <i className="bi bi-paperclip me-1"></i>
                {task.numberOfAttachments} Attachments
              </span>
            )}

            {/* In Progress-badge */}
            {inProgressTasks.includes(task.id) && (
              <span className="badge bg-primary me-2">In Progress</span>
            )}

            {/* Status */}
            <span
              className={
                task.completed
                  ? "badge bg-success me-2"
                  : "badge bg-warning text-dark me-2"
              }
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>
        </div>

        {/* Right side: Buttons */}
        <div className="btn-group ms-3">
          <button
            className="btn btn-outline-success btn-sm"
            title="Complete"
            onClick={(event) => {
              event.stopPropagation();
              onComplete(task);
            }}
          >
            <i className="bi bi-check-lg"></i>
          </button>

          <button
            className="btn btn-outline-primary btn-sm"
            title="Edit"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(task);
            }}
          >
            <i className="bi bi-pencil"></i>
          </button>

          <button
            className="btn btn-outline-danger btn-sm"
            title="Delete"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(task);
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
