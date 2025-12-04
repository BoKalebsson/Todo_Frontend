import React from "react";
import { getSortLabel } from "../../utils/taskSorting.js";
import { getFilterLabel } from "../../utils/taskFiltering.js";

function TaskControls({ sortMode, setSortMode, filterMode, setFilterMode }) {
  return (
    <div className="card-header bg-white d-flex justify-content-between align-items-center">
      {/* Left side: Labels */}
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

      {/* Right side: Buttons */}
      <div className="btn-group">
        {/* Filter dropdown */}
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
                {filterMode === "withAttachments" ? "✔ " : ""} With attachments
              </button>
            </li>

            <li>
              <button
                className="dropdown-item"
                onClick={() => setFilterMode("withoutAttachments")}
              >
                {filterMode === "withoutAttachments" ? "✔ " : ""} Without
                attachments
              </button>
            </li>
          </ul>
        </div>

        {/* Sort dropdown */}
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
                {sortMode === "completed" ? "✔ " : ""} Completed First
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TaskControls;
