import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useTasks } from "../../hooks/useTasks.js";
import { useUsers } from "../../hooks/useUsers.js";

import { sortTasks } from "../../utils/taskSorting.js";
import { filterTasks } from "../../utils/taskFiltering.js";

import TaskList from "./TaskList.jsx";
import TaskForm from "./TaskForm.jsx";
import TaskControls from "./TaskControls.jsx";
import Sidebar from "../Sidebar.jsx";
import Header from "../Header.jsx";

import { useLocation } from "react-router-dom";

import ConfirmModal from "../ui/ConfirmModal.jsx";
import { toast } from "react-toastify";

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

  const { users, loadUsers } = useUsers();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);

  const fileInputRef = React.useRef(null);

  const [sortMode, setSortMode] = useState("title");
  const [filterMode, setFilterMode] = useState("all");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadTasks();
    loadUsers();
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

  function handleDeleteClick(task) {
    setTaskToDelete(task);
    setShowConfirmModal(true);
  }

  // Reroute from Dashboard, when editing a task:
  const location = useLocation();

  useEffect(() => {
    if (location.state?.task) {
      startEdit(location.state.task);
    }
  }, [location.state]);

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
                      if (editingTask) {
                        toast.info(
                          `Task "${data.title}" updated successfully!`
                        );
                      } else {
                        toast.success(
                          `Task "${data.title}" created successfully!`
                        );
                      }
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
                    users={users}
                  />
                </div>
              </div>

              <div className="card shadow-sm tasks-list mt-4">
                <TaskControls
                  sortMode={sortMode}
                  setSortMode={setSortMode}
                  filterMode={filterMode}
                  setFilterMode={setFilterMode}
                />

                <div className="card-body">
                  <TaskList
                    tasks={sortTasks(filterTasks(tasks, filterMode), sortMode)}
                    onEdit={startEdit}
                    onDelete={handleDeleteClick}
                    onComplete={toggleComplete}
                    users={users}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ConfirmModal */}
        <ConfirmModal
          show={showConfirmModal}
          title="Confirm Delete"
          message={`Are you sure you want to delete the task "${taskToDelete?.title}"?`}
          onConfirm={async () => {
            if (taskToDelete) {
              await deleteTask(taskToDelete.id);
              toast.success(`Task "${taskToDelete.title}" has been deleted`);
              setShowConfirmModal(false);
              setTaskToDelete(null);
            }
          }}
          onCancel={() => {
            setShowConfirmModal(false);
            setTaskToDelete(null);
          }}
        />
      </main>
    </div>
  );
};

export default Task;
