import React, { useState, useEffect } from "react";
import "./Task.css";
import Sidebar from "../Sidebar.jsx";
import Header from "../Header.jsx";
import { taskService } from "../../services/taskService.js";
import { useForm } from "react-hook-form";

const Task = () => {
  const [tasks, setTasks] = useState([]);

  const [editingTask, setEditingTask] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);

  const fileInputRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  async function loadTasks() {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error.message);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function onSubmit(data) {
    try {
      const todo = {
        id: editingTask?.id || null,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate || null,
        personId: data.personId || null,
        completed: editingTask?.completed || false,
        numberOfAttachments: editingTask?.numberOfAttachments || 0,
        attachments: editingTask?.attachments || [],
      };

      const files = selectedFiles;

      if (editingTask) {
        await taskService.updateTask(editingTask.id, todo, files);
      } else {
        await taskService.createTask(todo, files);
      }

      await loadTasks();

      reset({
        title: "",
        description: "",
        dueDate: "",
        personId: "",
        attachments: null,
      });

      setSelectedFiles([]);
      setFilePreview([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setEditingTask(null);
    } catch (error) {
      console.error("Failed to submit form:", error.message);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Are you sure you want to delete this task?");
    if (!ok) return;

    try {
      await taskService.removeTask(id);
      await loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error.message);
    }
  }

  async function handleComplete(task) {
    const updatedTodo = {
      ...task,
      completed: !task.completed,
    };

    try {
      await taskService.updateTask(task.id, updatedTodo, []);
      await loadTasks();
    } catch (error) {
      console.error("Failed to update task:", error.message);
    }
  }

  function startEdit(task) {
    setEditingTask(task);

    reset({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
      personId: task.personId || "",
    });
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={false} onClose={() => {}} />
      <main className="dashboard-main">
        <Header
          title="Tasks"
          subtitle="Manage and organize your tasks"
          onToggleSidebar={() => {}}
        />

        <div className="dashboard-content">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <div className="card shadow-sm task-form-section">
                <div className="card-body">
                  <h2 className="card-title mb-4">Add New Task</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Title */}
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("title", {
                          required: "Title is required",
                        })}
                      />
                      {errors.title && (
                        <small className="text-danger">
                          {errors.title.message}
                        </small>
                      )}
                    </div>
                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        {...register("description", {
                          required: "Description is required",
                        })}
                      />
                      {errors.description && (
                        <small className="text-danger">
                          {errors.description.message}
                        </small>
                      )}
                    </div>
                    {/* Due Date */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Due Date</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          {...register("dueDate", {
                            validate: (value) => {
                              // Date is optional-validation:
                              if (!value) return true;

                              const picked = new Date(value);
                              const now = new Date();

                              // No dates in the past-validation:
                              return (
                                picked >= now ||
                                "Due date cannot be in the past."
                              );
                            },
                          })}
                        />
                        {errors.dueDate && (
                          <small className="text-danger">
                            {errors.dueDate.message}
                          </small>
                        )}
                      </div>
                      {/* Person */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Assign to Person</label>
                        <select
                          className="form-select"
                          {...register("personId")}
                        >
                          <option value="">
                            -- Select Person (Optional) --
                          </option>
                          <option value="1">Mehrdad Javan</option>
                          <option value="2">Simon Elbrink</option>
                        </select>
                      </div>
                    </div>
                    {/* Attachments */}
                    <div className="mb-3">
                      <label className="form-label">Attachments</label>
                      <div className="input-group mb-3">
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          {...register("attachments")}
                          ref={fileInputRef}
                          onChange={(e) => {
                            const newFiles = Array.from(e.target.files);

                            setSelectedFiles((prev) => {
                              const filtered = newFiles.filter(
                                (file) =>
                                  !prev.some((pf) => pf.name === file.name)
                              );
                              return [...prev, ...filtered];
                            });

                            setFilePreview((prev) => {
                              const filtered = newFiles
                                .map((f) => f.name)
                                .filter((name) => !prev.includes(name));
                              return [...prev, ...filtered];
                            });
                          }}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => {
                            reset({
                              ...getValues(),
                              attachments: null,
                            });

                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }

                            setSelectedFiles([]);
                            setFilePreview([]);
                          }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>

                      <div className="file-list mt-2">
                        {filePreview.length > 0 &&
                          filePreview.map((name, i) => (
                            <div key={i} className="small text-muted">
                              📎 {name}
                            </div>
                          ))}
                      </div>
                    </div>
                    {/* AddTask-Button */}
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button type="submit" className="btn btn-primary">
                        {editingTask ? (
                          <>
                            <i className="bi bi-save me-2"></i> Save Changes
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-lg me-2"></i> Add Task
                          </>
                        )}
                      </button>

                      {editingTask && (
                        <button
                          type="button"
                          className="btn btn-secondary ms-2"
                          onClick={() => {
                            reset({
                              title: "",
                              description: "",
                              dueDate: "",
                              personId: "",
                              attachments: null,
                            });

                            setSelectedFiles([]);
                            setFilePreview([]);

                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }

                            setEditingTask(null);
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              <div className="card shadow-sm tasks-list mt-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Tasks</h5>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      title="Filter"
                    >
                      <i className="bi bi-funnel"></i>
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      title="Sort"
                    >
                      <i className="bi bi-sort-down"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {tasks.length === 0 && (
                      <p className="text-muted">No tasks found.</p>
                    )}

                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="list-group-item list-group-item-action"
                      >
                        <div className="d-flex w-100 justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <h6 className="mb-1">{task.title}</h6>
                              <small className="text-muted ms-2">
                                Created:{" "}
                                {task.createdAt ? task.createdAt : "N/A"}
                              </small>
                            </div>

                            <p className="mb-1 text-muted small">
                              {task.description || "No description"}
                            </p>

                            <div className="d-flex align-items-center flex-wrap">
                              <small className="text-muted me-2">
                                <i className="bi bi-calendar-event"></i> Due:{" "}
                                {task.dueDate || "N/A"}
                              </small>

                              {task.personId && (
                                <span className="badge bg-info me-2">
                                  <i className="bi bi-person"></i> Person #
                                  {task.personId}
                                </span>
                              )}

                              {/* Attachment Badge */}
                              {task.numberOfAttachments > 0 && (
                                <span className="badge bg-secondary me-2">
                                  <i className="bi bi-paperclip me-1"></i>
                                  {task.numberOfAttachments} Attachments
                                </span>
                              )}
                              {/* Badge Completed or Pending */}
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

                          <div className="btn-group ms-3">
                            {/* Complete Task-Button */}
                            <button
                              className="btn btn-outline-success btn-sm"
                              title="Complete"
                              onClick={() => handleComplete(task)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                            {/* Edit Task-Button */}
                            <button
                              className="btn btn-outline-primary btn-sm"
                              title="Edit"
                              onClick={() => startEdit(task)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            {/* Delete Task-Button */}
                            <button
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => handleDelete(task.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Task;
