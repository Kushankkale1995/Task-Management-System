import { Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, logout } from "../../utils/auth";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const isProfilePage = location.pathname === "/profile";

  useEffect(() => {
    const syncAuth = () => setLoggedIn(isAuthenticated());

    window.addEventListener("auth-change", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth-change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow">
      <h1
        className="text-lg font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Task Manager
      </h1>

      <div className="flex gap-4">
        {/* PROFILE BUTTON (ONLY AFTER LOGIN) */}
        {loggedIn && (
          <Button onClick={() => navigate(isProfilePage ? -1 : "/profile")}>
            {isProfilePage ? "Back" : "Profile"}
          </Button>
        )}

        {/* LOGIN / LOGOUT BUTTON */}
        {loggedIn ? (
          <Button danger onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button type="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
