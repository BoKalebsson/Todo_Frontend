import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { useTasks } from "../../hooks/useTasks.js";

import { sortTasks, getSortLabel } from "../../utils/taskSorting.js";
import { filterTasks, getFilterLabel } from "../../utils/taskFiltering.js";

import TaskList from "./TaskList.jsx";
import TaskForm from "./TaskForm.jsx";
import Sidebar from "../Sidebar.jsx";
import Header from "../Header.jsx";

import "./Task.css";

const Task = () => {
  const {
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
  } = useTasks();

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

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 16) : "",
        personId: editingTask.personId || "",
        attachments: null,
      });

      setFilePreview(editingTask.attachments?.map((a) => a.fileName) || []);

      setSelectedFiles(editingTask.attachments || []);
    }
  }, [editingTask]);

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
                    onSubmit={(data) => {
                      submitTask(data, selectedFiles);
                      cancelEdit();
                    }}
                    errors={errors}
                    editingTask={editingTask}
                    reset={reset}
                    getValues={getValues}
                    setSelectedFiles={setSelectedFiles}
                    filePreview={filePreview}
                    setFilePreview={setFilePreview}
                    fileInputRef={fileInputRef}
                    onCancelEdit={cancelEdit}
                    formShouldReset={formShouldReset}
                    acknowledgeFormResetHandled={acknowledgeFormResetHandled}
                  />
                </div>
              </div>

              <div className="card shadow-sm tasks-list mt-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <h5 className="card-title mb-0">Tasks</h5>
                      <small className="text-muted">
                        — Sorted by: {getSortLabel(sortMode)}
                      </small>
                    </div>
                    <small className="text-muted">
                      — Filter: {getFilterLabel(filterMode)}
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
                    tasks={sortTasks(filterTasks(tasks, filterMode), sortMode)}
                    onEdit={startEdit}
                    onDelete={deleteTask}
                    onComplete={toggleComplete}
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
