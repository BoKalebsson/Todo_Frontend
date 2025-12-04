import TaskList from "./TaskList.jsx";
import TaskForm from "./TaskForm.jsx";
import React, { useState, useEffect } from "react";
import "./Task.css";
import Sidebar from "../Sidebar.jsx";
import Header from "../Header.jsx";
import { taskService } from "../../services/taskService.js";
import { useForm } from "react-hook-form";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [originalTasks, setOriginalTasks] = useState([]);

  const [editingTask, setEditingTask] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);

  const fileInputRef = React.useRef(null);

  const [sortMode, setSortMode] = useState("title");
  const [filterMode, setFilterMode] = useState("all");

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
      setOriginalTasks(data);
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

  function handleCancelEdit() {
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
  }

  function getSortedTasks() {
    if (sortMode === "none") {
      return getFilteredTasks();
    }

    const filtered = getFilteredTasks();
    const sorted = [...filtered];

    switch (sortMode) {
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "date":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;

      case "completed":
        sorted.sort((a, b) => Number(b.completed) - Number(a.completed));
        break;

      default:
        break;
    }

    return sorted;
  }

  function getSortLabel() {
    switch (sortMode) {
      case "none":
        return "None";
      case "title":
        return "Title";
      case "date":
        return "Created (Newest)";
      case "completed":
        return "Completed First";
      default:
        return "";
    }
  }

  function getFilterLabel() {
    switch (filterMode) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "withAttachments":
        return "With attachments";
      case "withoutAttachments":
        return "Without attachments";
      case "all":
      default:
        return "None";
    }
  }

  function getFilteredTasks() {
    switch (filterMode) {
      case "completed":
        return tasks.filter((task) => task.completed === true);

      case "pending":
        return tasks.filter((task) => task.completed === false);

      case "withAttachments":
        return tasks.filter((task) => task.numberOfAttachments > 0);

      case "withoutAttachments":
        return tasks.filter((task) => task.numberOfAttachments === 0);

      case "all":
      default:
        return tasks;
    }
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
                  <TaskForm
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    errors={errors}
                    editingTask={editingTask}
                    reset={reset}
                    getValues={getValues}
                    setSelectedFiles={setSelectedFiles}
                    filePreview={filePreview}
                    setFilePreview={setFilePreview}
                    fileInputRef={fileInputRef}
                    onCancelEdit={handleCancelEdit}
                  />
                </div>
              </div>

              <div className="card shadow-sm tasks-list mt-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <h5 className="card-title mb-0">Tasks</h5>
                      <small className="text-muted">
                        — Sorted by: {getSortLabel()}
                      </small>
                    </div>
                    <small className="text-muted">
                      — Filter: {getFilterLabel()}
                    </small>
                  </div>
                  <div className="btn-group">
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-secondary btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="bi bi-funnel"></i> Filter
                      </button>

                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setFilterMode("all")}
                          >
                            {filterMode === "all" ? "✔ " : ""} Show All
                          </button>
                        </li>

                        <li>
                          <hr className="dropdown-divider" />
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setFilterMode("completed")}
                          >
                            {filterMode === "completed" ? "✔ " : ""} Completed
                          </button>
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setFilterMode("pending")}
                          >
                            {filterMode === "pending" ? "✔ " : ""} Pending
                          </button>
                        </li>

                        <li>
                          <hr className="dropdown-divider" />
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setFilterMode("withAttachments")}
                          >
                            {filterMode === "withAttachments" ? "✔ " : ""} With
                            attachments
                          </button>
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setFilterMode("withoutAttachments")}
                          >
                            {filterMode === "withoutAttachments" ? "✔ " : ""}{" "}
                            Without attachments
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-secondary btn-sm dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="bi bi-sort-down"></i> Sort
                      </button>

                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setSortMode("none")}
                          >
                            {sortMode === "none" ? "✔ " : ""} No Sorting
                          </button>
                        </li>

                        <li>
                          <hr className="dropdown-divider" />
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setSortMode("title")}
                          >
                            {sortMode === "title" ? "✔ " : ""} Title (A–Z)
                          </button>
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setSortMode("date")}
                          >
                            {sortMode === "date" ? "✔ " : ""} Created (Newest)
                          </button>
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setSortMode("completed")}
                          >
                            {sortMode === "completed" ? "✔ " : ""} Completed
                            First
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <TaskList
                    tasks={getSortedTasks()}
                    onEdit={startEdit}
                    onDelete={handleDelete}
                    onComplete={handleComplete}
                  />
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
