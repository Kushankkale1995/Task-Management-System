import _ from "lodash";

/**
 * Filter tasks by status
 * @param {Array} tasks - Array of task objects
 * @param {String} status - Status to filter by (Pending, In Progress, Completed)
 * @returns {Array} Filtered tasks
 */
export const filterByStatus = (tasks, status) =>
  status ? _.filter(tasks, { status }) : tasks;

/**
 * Filter tasks by priority
 * @param {Array} tasks - Array of task objects
 * @param {String} priority - Priority to filter by (Low, Medium, High)
 * @returns {Array} Filtered tasks
 */
export const filterByPriority = (tasks, priority) =>
  priority ? _.filter(tasks, { priority }) : tasks;

/**
 * Filter tasks by category
 * @param {Array} tasks - Array of task objects
 * @param {String} categoryId - Category ID to filter by
 * @returns {Array} Filtered tasks
 */
export const filterByCategory = (tasks, categoryId) =>
  categoryId ? _.filter(tasks, (task) => task.category?._id === categoryId) : tasks;

/**
 * Filter tasks by due date range
 * @param {Array} tasks - Array of task objects
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Filtered tasks within date range
 */
export const filterByDueDate = (tasks, startDate, endDate) => {
  if (!startDate || !endDate) return tasks;
  return _.filter(tasks, (task) => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= startDate && dueDate <= endDate;
  });
};

/**
 * Filter tasks by completion status
 * @param {Array} tasks - Array of task objects
 * @param {Boolean} completed - Filter completed or incomplete tasks
 * @returns {Array} Filtered tasks
 */
export const filterByCompletion = (tasks, completed) => {
  if (completed === null || completed === undefined) return tasks;
  const status = completed ? "Completed" : ["Pending", "In Progress"];
  return completed
    ? _.filter(tasks, { status: "Completed" })
    : _.filter(tasks, (task) => status.includes(task.status));
};

/**
 * Search tasks by title or description
 * @param {Array} tasks - Array of task objects
 * @param {String} searchTerm - Search term
 * @returns {Array} Filtered tasks matching search term
 */
export const searchTasks = (tasks, searchTerm) => {
  if (!searchTerm) return tasks;
  const term = searchTerm.toLowerCase();
  return _.filter(tasks, (task) =>
    task.title.toLowerCase().includes(term) ||
    task.description?.toLowerCase().includes(term) ||
    task.category?.name.toLowerCase().includes(term)
  );
};

/**
 * Apply multiple filters at once
 * @param {Array} tasks - Array of task objects
 * @param {Object} filters - Filter object with status, priority, categoryId, search, etc.
 * @returns {Array} Filtered tasks
 */
export const applyFilters = (tasks, filters = {}) => {
  let result = tasks;

  if (filters.status) result = filterByStatus(result, filters.status);
  if (filters.priority) result = filterByPriority(result, filters.priority);
  if (filters.categoryId) result = filterByCategory(result, filters.categoryId);
  if (filters.search) result = searchTasks(result, filters.search);
  if (filters.startDate && filters.endDate)
    result = filterByDueDate(result, filters.startDate, filters.endDate);
  if (filters.completed !== null && filters.completed !== undefined)
    result = filterByCompletion(result, filters.completed);

  return result;
};
