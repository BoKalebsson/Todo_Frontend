import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const roleColors = {
  USER: "bg-success bg-opacity-25",
  ADMIN: "bg-primary bg-opacity-25",
  MODERATOR: "bg-warning bg-opacity-25",
};

export const UserCreateForm = ({
  editingUser,
  formShouldReset,
  acknowledgeFormResetHandled,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      roles: [],
    },
  });

  const watchedRoles = watch("roles", []);
  const watchedPassword = watch("password", "");

  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name || "",
        email: editingUser.email || "",
        username: editingUser.username || "",
        password: "",
        confirmPassword: "",
        roles: editingUser.roles || [],
      });
    }
  }, [editingUser]);

  useEffect(() => {
    if (formShouldReset) {
      reset({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        roles: [],
      });
      acknowledgeFormResetHandled();
    }
  }, [formShouldReset]);

  const toggleRole = (role) => {
    const currentRoles = watchedRoles || [];
    if (currentRoles.includes(role)) {
      reset({ ...watch(), roles: currentRoles.filter((r) => r !== role) });
    } else {
      reset({ ...watch(), roles: [...currentRoles, role] });
    }
  };

  const handleFormSubmit = (data) => {
    if (!data.roles || data.roles.length === 0) {
      alert("Please select at least one role");
      return;
    }
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSubmit(data);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white w-100 mb-4">
      <h2 className="text-xl font-semibold mb-4">
        {editingUser ? "Edit User" : "Create User"}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="form-control"
          />
          {errors.name && (
            <small className="text-danger">{errors.name.message}</small>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className="form-control"
          />
          {errors.email && (
            <small className="text-danger">{errors.email.message}</small>
          )}
        </div>

        {/* Username */}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
            className="form-control"
          />
          {errors.username && (
            <small className="text-danger">{errors.username.message}</small>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: !editingUser ? "Password is required" : false,
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="form-control"
          />
          {errors.password && (
            <small className="text-danger">{errors.password.message}</small>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: !editingUser ? "Confirm password is required" : false,
              validate: (value) =>
                value === watchedPassword || "Passwords do not match",
            })}
            className="form-control"
          />
          {errors.confirmPassword && (
            <small className="text-danger">
              {errors.confirmPassword.message}
            </small>
          )}
        </div>

        {/* Roles */}
        <div className="mb-3">
          <label className="form-label mb-1">Roles</label>
          <div className="d-flex flex-wrap gap-2">
            {Object.keys(roleColors).map((role) => {
              const isSelected = watchedRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`btn btn-sm ${
                    isSelected ? "border-2 border-dark" : "border"
                  } text-dark ${roleColors[role]}`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editingUser ? "Save Changes" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreateForm;
