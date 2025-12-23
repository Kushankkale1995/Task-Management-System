import API from "./axios";

// Fetch tasks for logged-in user
export const getTasks = async () => {
  try {
    const res = await API.get("/tasks"); // protected route
    return res.data; // backend returns array directly
  } catch (err) {
    console.error("Error fetching tasks:", err.response || err);
    return []; // throw so TaskList can catch 401
  }
};
// Public tasks (no token needed)
export const getPublicTasks = async () => {
  try {
    const res = await API.get("/tasks/public"); // public endpoint
    return res.data;
  } catch (err) {
    console.error("Error fetching public tasks:", err.response || err);
    return []; // return empty array silently
  }
};

// Other CRUD actions
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
