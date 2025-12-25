import { Button, Form, Input, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { setAuthToken } from "../api/axios";
import { loginUser } from "../api/auth.api";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const handleLogin = async (values) => {
    try {
      console.log("Login attempt with:", { email: values.email, password: "***" });
      const res = await loginUser(values);
      console.log("Login response:", res.data);
      if (res?.data?.token) {
        setAuthToken(res.data.token);
        message.success("Login successful!");
        try {
          await api.get("/auth/me");
          navigate("/");
        } catch (err) {
          const errMsg = err?.response?.data?.message || err.message || "Token verification failed";
          console.error("Token verification failed after login", err?.response?.data || err.message);
          setAuthToken(null);
          message.error(errMsg);
        }
      } else {
        console.error("No token in login response", res.data);
        message.error("No token received from server");
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message;
      console.error("Login error:", err.response?.data || err.message);
      console.log("Full error response:", err.response);
      message.error(errMsg || "Login failed");
    }
  };


  return (
    <div className="flex h-screen items-center justify-center">
      <Card title="Login" className="w-96">
        <Form form={form} onFinish={handleLogin} layout="vertical">
          <Form.Item 
            name="email" 
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email" }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item 
            name="password" 
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
        <div className="mt-3 text-center">
          <span>Don't have an account? </span>
          <Link to="/register">Register</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
