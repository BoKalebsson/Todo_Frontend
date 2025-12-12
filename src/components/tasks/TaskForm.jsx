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
  existingFiles,
  setExistingFiles,
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
              const newlySelectedFiles = Array.from(e.target.files);

              // Name of existing files:
              const existingFileNames = existingFiles.map(
                (file) => file.fileName
              );

              // Keep only newly selected files that are NOT already among existing files:
              const nonDuplicateNewFiles = newlySelectedFiles.filter(
                (file) => !existingFileNames.includes(file.name)
              );

              // Merge previous selected files with new non-duplicate files:
              setSelectedFiles((prevSelectedFiles) => {
                // Ensure no duplicates are added
                const filteredPrev = prevSelectedFiles.filter(
                  (file) =>
                    !nonDuplicateNewFiles.some(
                      (newFile) => newFile.name === file.name
                    )
                );
                return [...filteredPrev, ...nonDuplicateNewFiles];
              });

              // Update the preview list with new files, avoiding duplicates
              setFilePreview((prevPreview) => {
                const filteredPrevPreview = prevPreview.filter(
                  (name) =>
                    !nonDuplicateNewFiles.some((file) => file.name === name)
                );
                return [
                  ...filteredPrevPreview,
                  ...nonDuplicateNewFiles.map((file) => file.name),
                ];
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
          {/* Existing Files */}
          {existingFiles.length > 0 &&
            existingFiles.map((file) => (
              <div key={`existing-${file.id}`} className="small text-muted">
                📎 {file.fileName} (existing)
              </div>
            ))}

          {/* Added files */}
          {filePreview.length > 0 &&
            filePreview.map((name, i) => (
              <div key={`new-${i}`} className="small text-muted">
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
