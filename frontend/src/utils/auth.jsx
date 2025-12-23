export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const loginSuccess = (token) => {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("auth-change"));
};

export const logout = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-change"));
};
