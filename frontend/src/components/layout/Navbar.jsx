import { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Space, message } from "antd";
import { UserOutlined, LogoutOutlined, DashboardOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/user.api";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (err) {
      console.error("Error loading user:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete window.axios?.defaults?.headers?.Authorization;
    message.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Header
      className="bg-white shadow-md sticky top-0 z-50"
      style={{ padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
    >
      <div className="flex items-center gap-2">
        <FileTextOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
        <h1 className="text-xl font-bold text-gray-800 m-0">Task Manager</h1>
      </div>

      <div className="flex items-center gap-4">
        <Menu
          mode="horizontal"
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/dashboard"),
            },
          ]}
          style={{ border: "none", flex: 1 }}
        />

        {user && (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
            <Space className="cursor-pointer">
              <Avatar size="large" icon={<UserOutlined />} />
              <span className="text-gray-700">{user.name}</span>
            </Space>
          </Dropdown>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
