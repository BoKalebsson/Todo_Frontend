export function sortTasks(tasks, sortMode) {
  if (sortMode === "none") return tasks;

  const sorted = [...tasks];

  switch (sortMode) {
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case "date":
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    case "completed":
      return sorted.sort(
        (a, b) => Number(b.completed) - Number(a.completed)
      );

    default:
      return tasks;
  }
}

export function getSortLabel(sortMode) {
  switch (sortMode) {
    case "none":
      return "None";
    case "title":
      return "Title";
    case "date":
      return "Created (Newest)";
    case "completed":
      return "Completed First";
    default:
      return "";
  }
}