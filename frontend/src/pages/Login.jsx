import { Form, Input, Button, Card, Typography, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useState } from "react";
import { loginSuccess, isAuthenticated } from "../utils/auth";

const { Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/dashboard"; // redirect after login

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const payload = {
        email: values.email.trim(),
        password: values.password.trim(),
      };

      const res = await loginUser(payload);

      // Store token in localStorage
      localStorage.setItem("token", res.data.token);

      // Update any app state if needed
      loginSuccess(res.data.token); // optional if you track login globally

      message.success("Login successful");

      // Redirect to dashboard or previous page
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      message.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Login" className="w-96">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>

          <Button
            block
            className="mt-3"
            onClick={() =>
              navigate(isAuthenticated() ? "/dashboard" : "/", { replace: true })
            }
          >
            Back
          </Button>

          <div className="text-center mt-4">
            <Text>
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
