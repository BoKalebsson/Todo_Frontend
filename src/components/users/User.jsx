import React, { useEffect } from "react";
import Sidebar from "../Sidebar.jsx";
import Header from "../Header.jsx";

import { useUsers } from "../../hooks/useUsers.js";
import UserList from "./UserList.jsx";

const User = () => {
  const {
    users,
    editingUser,
    loadUsers,
    startEdit,
    deleteUser,
    createUser,
    updateUser,
    setEditingUser,
  } = useUsers();

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={false} onClose={() => {}} />

      <main className="dashboard-main">
        <Header
          title="Users"
          subtitle="Manage system users and roles"
          onToggleSidebar={() => {}}
        />

        <div className="dashboard-content">
          <div className="row">
            <div className="col-md-8 mx-auto">
              {/* Placeholder for User Form */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h2 className="card-title mb-4">
                    {editingUser ? "Edit User" : "Add New User"}
                  </h2>

                  <div className="text-muted text-center py-4">
                    <i className="bi bi-person-plus fs-1 text-secondary"></i>
                    <p className="mt-3 mb-0">
                      User creation/editing form will appear here.
                    </p>
                  </div>
                </div>
              </div>

              {/* User List */}
              <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">User List</h5>
                </div>

                <div className="card-body">
                  <UserList
                    users={users}
                    onEdit={startEdit}
                    onDelete={deleteUser}
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

export default User;
