import axios from "./axios";

// Get current logged-in user profile
export const getProfile = () => axios.get("/users/me");

// Update profile
export const updateProfile = (data) => axios.put("/users/me", data);

// Get all users
export const getAllUsers = () => axios.get("/users");
