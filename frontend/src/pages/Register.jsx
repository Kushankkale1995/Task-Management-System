import { Form, Input, Button, Card, message } from "antd";
import { registerUser } from "../api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
      };

      const res = await registerUser(payload);
      localStorage.setItem("token", res.data.token);

      message.success("Registration successful");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      message.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Register" className="w-96">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
