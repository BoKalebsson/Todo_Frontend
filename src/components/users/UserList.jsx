import React from "react";

const UserList = ({ users, onEdit, onDelete }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-muted text-center py-4">
        <i className="bi bi-people fs-1 text-secondary"></i>
        <p className="mt-3 mb-0">No users found.</p>
      </div>
    );
  }

  const extractRoles = (user) => {
    if (Array.isArray(user.roles)) return user.roles;
    if (user.user && Array.isArray(user.user.roles)) return user.user.roles;
    return [];
  };

  const getRoleBadgeClasses = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-primary bg-opacity-25 text-dark";
      case "MODERATOR":
        return "bg-warning bg-opacity-25 text-dark";
      case "USER":
      default:
        return "bg-success bg-opacity-25 text-dark";
    }
  };

  return (
    <div className="list-group">
      {users.map((user) => {
        const roles = extractRoles(user);

        return (
          <div
            key={user.id}
            className="list-group-item list-group-item-action py-3"
          >
            {/* Name and Buttons */}
            <div className="d-flex justify-content-between align-items-start">
              <h5 className="mb-1">{user.name}</h5>

              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onEdit(user)}
                >
                  <i className="bi bi-pencil"></i>
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(user.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>

            {/* Email + Username */}
            <p className="mb-1">
              <strong>Email:</strong> {user.email}
              <span className="mx-2">—</span>
              <strong>Username:</strong> {user.username}
            </p>

            {/* Roles */}
            <div className="mb-2">
              <strong>Roles: </strong>
              {roles.length > 0 ? (
                roles.map((role, index) => {
                  const cleanRole = role.replace("ROLE_", "");
                  return (
                    <span
                      key={index}
                      className={`badge me-2 ${getRoleBadgeClasses(cleanRole)}`}
                    >
                      {cleanRole}
                    </span>
                  );
                })
              ) : (
                <span className="text-muted">No roles</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
