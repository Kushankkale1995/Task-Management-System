import axios from "./axios";

// Login user
export const loginUser = (data) => axios.post("/auth/login", data);

// Register user
export const registerUser = (data) => axios.post("/auth/register", data);
