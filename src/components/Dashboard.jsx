import { useEffect, useState, useMemo } from "react";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header.jsx";
import { taskService } from "../services/taskService.js";
import { userService } from "../services/userService.js";

import { useNavigate } from "react-router-dom";

import ConfirmModal from "../Components/ui/ConfirmModal.jsx";
import { toast } from "react-toastify";

import { useTasks } from "../hooks/useTasks.js";
import { useInProgressTasks } from "../hooks/useInProgressTasks.js";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Used to solve state not updating properly:
  const { deleteTask: hookDeleteTask, toggleComplete: hookToggleComplete } =
    useTasks();

  const handleToggleComplete = async (task) => {
    try {
      await hookToggleComplete(task);
      await fetchTasks();
      toast.success(`Task "${task.title}" marked as complete!`);
    } catch (err) {
      toast.error("Could not update task.");
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowConfirmModal(true);
  };

  const navigate = useNavigate();

  function handleEditTask(task) {
    navigate("/dashboard/tasks", { state: { task } });
  }

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { inProgressTasks, toggleTask } = useInProgressTasks();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError("Could not fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Could not fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const usersCount = users.length;

  const today = new Date();

  const calculateFrontendStatus = (task, inProgressTasks) => {
    const today = new Date();

    if (task.completed) {
      return "completed";
    }

    if (inProgressTasks.includes(task.id)) {
      return "in-progress";
    }

    if (!task.dueDate) {
      return "no duedate";
    }

    if (new Date(task.dueDate) < today) {
      return "overdue";
    }

    return "pending";
  };

  const tasksWithStatus = useMemo(() => {
    return tasks.map((task) => ({
      ...task,
      status: calculateFrontendStatus(task, inProgressTasks),
    }));
  }, [tasks, inProgressTasks]);

  const pendingCount = tasksWithStatus.filter(
    (task) => task.status === "pending"
  ).length;
  const inProgressCount = tasksWithStatus.filter(
    (task) => task.status === "in-progress"
  ).length;
  const completedCount = tasksWithStatus.filter(
    (task) => task.status === "completed"
  ).length;
  const overdueCount = tasksWithStatus.filter(
    (task) => task.status === "overdue"
  ).length;
  const userCount = 1;

  // Use Infinity for tasks with no duedates, to push them to the bottom of the list:
  const sortedTasks = [...tasksWithStatus].sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate) : Infinity;
    const dateB = b.dueDate ? new Date(b.dueDate) : Infinity;
    return dateA - dateB;
  });

  // Add tasks with no duedates to the list:
  const recentTasks = sortedTasks.filter(
    (task) => !task.dueDate || new Date(task.dueDate) >= today
  );

  // Tasks must have a duedate, to be able to be overdue:
  const overdueTasks = sortedTasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < today &&
      task.status !== "completed"
  );

  const TaskTable = ({ tasks, title, isOverdue }) => (
    <div className="tasks-section">
      <div className="section-header">
        <h2>
          <span className={isOverdue ? "text-danger" : ""}>{title}</span>
          {isOverdue && (
            <span className="badge bg-danger ms-2">{tasks.length}</span>
          )}
        </h2>
        <button className="btn btn-link text-decoration-none">
          View All
          <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" style={{ width: "40px" }}>
                #
              </th>
              <th scope="col">Task</th>
              <th scope="col">Team</th>
              <th scope="col">Due Date</th>
              <th scope="col" style={{ width: "120px" }}>
                Status
              </th>
              <th scope="col" style={{ width: "60px" }}></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="fw-medium">{task.title}</div>
                </td>
                <td>{task.team}</td>
                <td>
                  <div className={isOverdue ? "text-danger" : ""}>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date."}
                  </div>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                    {task.status
                      ? task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)
                      : "Unknown"}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-link btn-sm p-0"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => toggleTask(task.id)}
                        >
                          {inProgressTasks.includes(task.id)
                            ? "Stop Working"
                            : "Start Working"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEditTask(task)}
                        >
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleToggleComplete(task)}
                        >
                          Mark Complete
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDeleteClick(task)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "in-progress":
        return "bg-primary";
      case "completed":
        return "bg-success";
      case "overdue":
        return "bg-danger";
      case "no duedate":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="dashboard-main">
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's your tasks overview"
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon pending">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div className="stat-info">
                <h3>Pending</h3>
                <p className="stat-number">{pendingCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon in-progress">
                <i className="bi bi-arrow-clockwise"></i>
              </div>
              <div className="stat-info">
                <h3>In Progress</h3>
                <p className="stat-number">{inProgressCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon completed">
                <i className="bi bi-check2-circle"></i>
              </div>
              <div className="stat-info">
                <h3>Completed</h3>
                <p className="stat-number">{completedCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon overdue">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div className="stat-info">
                <h3>Overdue</h3>
                <p className="stat-number">{overdueCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon info">
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-info">
                <h3>Users</h3>
                <p className="stat-number">{usersCount}</p>
              </div>
            </div>
          </div>

          {/* Loading spinner */}
          {loading && (
            <div className="text-center my-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading tasks...</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="alert alert-danger my-4" role="alert">
              {error}
            </div>
          )}

          {/* Tasks grid */}
          {!loading && !error && (
            <div className="tasks-grid">
              <TaskTable
                tasks={recentTasks}
                title="Recent Tasks"
                isOverdue={false}
              />
              <TaskTable
                tasks={overdueTasks}
                title="Overdue Tasks"
                isOverdue={true}
              />
            </div>
          )}
        </div>
        <ConfirmModal
          show={showConfirmModal}
          title="Confirm Delete"
          message={`Are you sure you want to delete the task "${taskToDelete?.title}"?`}
          onConfirm={async () => {
            if (taskToDelete) {
              await hookDeleteTask(taskToDelete.id);
              await fetchTasks();
              setShowConfirmModal(false);
              setTaskToDelete(null);

              toast.success(`Task "${taskToDelete.title}" has been deleted!`);
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

export default Dashboard;
