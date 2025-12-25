import axios from "./axios";

// Get all tasks for logged-in user
export const getTasks = () => axios.get("/tasks");

// Create new task
export const createTask = (data) => axios.post("/tasks", data);

// Delete task by id
export const deleteTask = (id) => axios.delete(`/tasks/${id}`);

// Update task by id
export const updateTask = (id, data) => axios.put(`/tasks/${id}`, data);
