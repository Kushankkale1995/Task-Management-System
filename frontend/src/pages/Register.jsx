import { Button, Form, Input, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { setAuthToken } from "../api/axios";
import { registerUser } from "../api/auth.api";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const onFinish = async (values) => {
    try {
      console.log("Register attempt with:", { name: values.name, email: values.email, password: "***" });
      const res = await registerUser(values);
      console.log("Register response:", res.data);
      if (res?.data?.token) {
        message.success("Registration successful!");
        setAuthToken(res.data.token);
        try {
          await api.get("/auth/me");
          navigate("/");
        } catch (err) {
          const errMsg = err?.response?.data?.message || err.message || "Token verification failed";
          console.error("Token verification failed after register", err?.response?.data || err.message);
          setAuthToken(null);
          message.error(errMsg);
        }
      } else {
        console.error("No token returned from register", res.data);
        message.error("Registration failed - no token received");
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message;
      console.error("Register error:", err.response?.data || err.message);
      message.error(errMsg || "Registration failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card title="Register" className="w-96">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item 
            name="name" 
            label="Full Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>
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
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form>
        <div className="mt-3 text-center">
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
