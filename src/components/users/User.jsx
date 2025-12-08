import React, { useEffect } from "react";
import Sidebar from "../Sidebar.jsx";
import Header from "../Header.jsx";

import { useUsers } from "../../hooks/useUsers.js";
import UserList from "./UserList.jsx";
import UserCreateForm from "./UserCreateForm.jsx";

import ConfirmModal from "../ui/ConfirmModal.jsx";
import { toast } from "react-toastify";

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
      const isUpdate = editingUser !== null;
      await submitUser(data);
      if (isUpdate) {
        toast.info(`User "${data.name}" updated successfully!`);
      } else {
        toast.success(`User "${data.name}" created successfully!`);
      }
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleCancel = () => {
    cancelEdit();
  };

  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState(null);

  function handleDeleteClick(user) {
    setUserToDelete(user);
    setShowConfirmModal(true);
  }

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
                    onDelete={handleDeleteClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal
          show={showConfirmModal}
          title="Confirm Delete"
          message={`Are you sure you want to delete the user "${userToDelete?.name}"?`}
          onConfirm={async () => {
            if (userToDelete) {
              await deleteUser(userToDelete.id);
              toast.success(`User "${userToDelete.name}" has been deleted`);
              setShowConfirmModal(false);
              setUserToDelete(null);
            }
          }}
          onCancel={() => {
            setShowConfirmModal(false);
            setUserToDelete(null);
          }}
        />
      </main>
    </div>
  );
};

export default User;
