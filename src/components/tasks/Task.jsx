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
                  <TaskList
                    tasks={tasks}
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
