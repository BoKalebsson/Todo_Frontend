export function filterTasks(tasks, filterMode) {
  switch (filterMode) {
    case "completed":
      return tasks.filter((task) => task.completed === true);

    case "pending":
      return tasks.filter((task) => task.completed === false);

    case "withAttachments":
      return tasks.filter((task) => task.numberOfAttachments > 0);

    case "withoutAttachments":
      return tasks.filter((task) => task.numberOfAttachments === 0);

    case "all":
    default:
      return tasks;
  }
}

export function getFilterLabel(filterMode) {
  switch (filterMode) {
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    case "withAttachments":
      return "With attachments";
    case "withoutAttachments":
      return "Without attachments";
    case "all":
    default:
      return "None";
  }
}
