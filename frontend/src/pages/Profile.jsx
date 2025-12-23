import { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import AppLayout from "../components/layout/AppLayout";
import {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
} from "../api/userApi";

const { Title, Text } = Typography;

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [myId, setMyId] = useState(null);
  const [loading, setLoading] = useState(true);

  // edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 🔹 load users + logged-in profile
  const loadData = async () => {
    try {
      setLoading(true);

      const myProfileRes = await getMyProfile();
      setMyId(myProfileRes.data._id);

      const usersRes = await getAllUsers();
      setUsers(usersRes.data);
    } catch (err) {
      message.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 open edit modal
  const openEditModal = (user) => {
    form.setFieldsValue({
      name: user.name,
      email: user.email,
    });
    setIsModalOpen(true);
  };

  // 🔹 save profile changes
  const handleUpdate = async (values) => {
    try {
      await updateMyProfile(values);
      message.success("Profile updated successfully");
      setIsModalOpen(false);
      loadData(); // refresh list
    } catch (err) {
      message.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user._id} className="text-center">
            <Avatar size={64} style={{ backgroundColor: "#1890ff" }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>

            <Title level={4} className="mt-3">
              {user.name}
            </Title>

            <Text>{user.email}</Text>

            {user._id === myId && (
              <div className="mt-4">
                <Button
                  type="primary"
                  onClick={() => openEditModal(user)}
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 🔹 EDIT PROFILE MODAL */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default Profile;
