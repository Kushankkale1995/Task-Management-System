import axios from "axios";

const instance = axios.create({
  // use 127.0.0.1 to avoid possible localhost/IPv6 resolution issues
  baseURL: "http://127.0.0.1:5000/api",
});

// Interceptor
instance.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  // strip surrounding quotes if any
  if (typeof token === "string") token = token.trim().replace(/^"|"$/g, "");
  // if token already includes 'Bearer ' don't double-prefix
  const headerValue = token
    ? token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`
    : token;
  console.log("Attaching token to request:", headerValue ? `${headerValue.slice(0,12)}...` : headerValue);
  if (headerValue) config.headers.Authorization = headerValue;
  return config;
});

export default instance;

// Helper to set token programmatically and set default header
export const setAuthToken = (token) => {
  if (!token) {
    localStorage.removeItem("token");
    delete instance.defaults.headers.Authorization;
    return;
  }
  // strip surrounding quotes
  if (typeof token === "string") token = token.trim().replace(/^"|"$/g, "");
  const headerValue = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  localStorage.setItem("token", token);
  instance.defaults.headers.Authorization = headerValue;
};
