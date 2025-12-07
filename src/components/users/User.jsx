import React, { useEffect } from "react";
import Sidebar from "../Sidebar.jsx";
import Header from "../Header.jsx";

import { useUsers } from "../../hooks/useUsers.js";
import UserList from "./UserList.jsx";
import UserCreateForm from "./UserCreateForm.jsx";

const User = () => {
  const {
    users,
    editingUser,
    submitUser,
    deleteUser,
    startEdit,
    cancelEdit,
    formShouldReset,
    acknowledgeFormResetHandled,
    loadUsers,
  } = useUsers();

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (data) => {
    try {
      await submitUser(data);
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleCancel = () => {
    cancelEdit();
  };

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
              {/* User Form */}
              <UserCreateForm
                editingUser={editingUser}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                formShouldReset={formShouldReset}
                acknowledgeFormResetHandled={acknowledgeFormResetHandled}
              />

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
