import React, { useEffect } from "react";

function TaskForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  editingTask,
  reset,
  getValues,
  setSelectedFiles,
  filePreview,
  setFilePreview,
  fileInputRef,
  onCancelEdit,
  formShouldReset,
  acknowledgeFormResetHandled,
  users,
}) {
  useEffect(() => {
    if (formShouldReset) {
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

      acknowledgeFormResetHandled();
    }
  }, [formShouldReset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          {...register("title", {
            required: "Title is required",
          })}
        />
        {errors.title && (
          <small className="text-danger">{errors.title.message}</small>
        )}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows="3"
          {...register("description", {
            required: "Description is required",
          })}
        />
        {errors.description && (
          <small className="text-danger">{errors.description.message}</small>
        )}
      </div>

      {/* Due Date + Person */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Due Date</label>
          <input
            type="datetime-local"
            className="form-control"
            {...register("dueDate", {
              validate: (value) => {
                if (!value) return true;

                const picked = new Date(value);
                const now = new Date();

                return picked >= now || "Due date cannot be in the past.";
              },
            })}
          />
          {errors.dueDate && (
            <small className="text-danger">{errors.dueDate.message}</small>
          )}
        </div>

        {/* Person */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Assign to Person</label>
          <select className="form-select" {...register("personId")}>
            <option value="">-- Select Person (Optional) --</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attachments */}
      <div className="mb-3">
        <label className="form-label">Attachments</label>
        <div className="input-group mb-3">
          <input
            type="file"
            className="form-control"
            multiple
            {...register("attachments")}
            ref={fileInputRef}
            onChange={(e) => {
              const newFiles = Array.from(e.target.files);

              setSelectedFiles((prev) => {
                const filtered = newFiles.filter(
                  (file) => !prev.some((pf) => pf.name === file.name)
                );
                return [...prev, ...filtered];
              });

              setFilePreview((prev) => {
                const filtered = newFiles
                  .map((f) => f.name)
                  .filter((name) => !prev.includes(name));
                return [...prev, ...filtered];
              });
            }}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              reset({
                ...getValues(),
                attachments: null,
              });

              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }

              setSelectedFiles([]);
              setFilePreview([]);
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="file-list mt-2">
          {filePreview.length > 0 &&
            filePreview.map((name, i) => (
              <div key={i} className="small text-muted">
                📎 {name}
              </div>
            ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="submit" className="btn btn-primary">
          {editingTask ? (
            <>
              <i className="bi bi-save me-2"></i> Save Changes
            </>
          ) : (
            <>
              <i className="bi bi-plus-lg me-2"></i> Add Task
            </>
          )}
        </button>

        {editingTask && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
