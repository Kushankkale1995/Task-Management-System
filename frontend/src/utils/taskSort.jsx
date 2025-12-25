import _ from "lodash";

/**
 * Sort tasks by priority (High > Medium > Low)
 * @param {Array} tasks - Array of task objects
 * @param {String} order - 'asc' or 'desc' (default: 'asc' for high priority first)
 * @returns {Array} Sorted tasks
 */
export const sortByPriority = (tasks, order = "asc") => {
  const priorityMap = { High: 3, Medium: 2, Low: 1 };
  return _.orderBy(
    tasks,
    (task) => priorityMap[task.priority] || 0,
    order === "asc" ? "desc" : "asc"
  );
};

/**
 * Sort tasks by due date
 * @param {Array} tasks - Array of task objects
 * @param {String} order - 'asc' (earliest first) or 'desc' (latest first)
 * @returns {Array} Sorted tasks
 */
export const sortByDueDate = (tasks, order = "asc") => {
  return _.orderBy(
    tasks,
    (task) => task.dueDate ? new Date(task.dueDate) : new Date(0),
    order
  );
};

/**
 * Sort tasks by creation date
 * @param {Array} tasks - Array of task objects
 * @param {String} order - 'asc' (oldest first) or 'desc' (newest first)
 * @returns {Array} Sorted tasks
 */
export const sortByCreatedDate = (tasks, order = "desc") => {
  return _.orderBy(
    tasks,
    (task) => new Date(task.createdAt),
    order
  );
};

/**
 * Sort tasks by title (alphabetically)
 * @param {Array} tasks - Array of task objects
 * @param {String} order - 'asc' or 'desc' (default: 'asc')
 * @returns {Array} Sorted tasks
 */
export const sortByTitle = (tasks, order = "asc") => {
  return _.orderBy(tasks, "title", order);
};

/**
 * Sort tasks by status
 * @param {Array} tasks - Array of task objects
 * @param {String} order - 'asc' or 'desc' (default: 'asc')
 * @returns {Array} Sorted tasks by status (Completed > In Progress > Pending)
 */
export const sortByStatus = (tasks, order = "asc") => {
  const statusMap = { Completed: 3, "In Progress": 2, Pending: 1 };
  return _.orderBy(
    tasks,
    (task) => statusMap[task.status] || 0,
    order === "asc" ? "desc" : "asc"
  );
};

/**
 * Apply multiple sorts at once
 * @param {Array} tasks - Array of task objects
 * @param {Array} sortRules - Array of {field, order} objects
 * @returns {Array} Sorted tasks
 */
export const applySorts = (tasks, sortRules = []) => {
  if (!sortRules || sortRules.length === 0) return tasks;

  const fields = sortRules.map((rule) => {
    switch (rule.field) {
      case "priority":
        return (task) => ({ High: 3, Medium: 2, Low: 1 }[task.priority] || 0);
      case "dueDate":
        return (task) => task.dueDate ? new Date(task.dueDate) : new Date(0);
      case "createdAt":
        return (task) => new Date(task.createdAt);
      case "status":
        return (task) => ({ Completed: 3, "In Progress": 2, Pending: 1 }[task.status] || 0);
      default:
        return (task) => task[rule.field];
    }
  });

  const orders = sortRules.map((rule) => rule.order || "asc");

  return _.orderBy(tasks, fields, orders);
};

/**
 * Group tasks by property
 * @param {Array} tasks - Array of task objects
 * @param {String} groupBy - Property to group by (status, priority, category, etc.)
 * @returns {Object} Grouped tasks
 */
export const groupTasks = (tasks, groupBy) => {
  return _.groupBy(tasks, (task) => {
    if (groupBy === "category") return task.category?.name || "Uncategorized";
    return task[groupBy] || "Unknown";
  });
};
