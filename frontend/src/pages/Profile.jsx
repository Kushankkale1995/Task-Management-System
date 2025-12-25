import { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Tabs, Empty, Spin, Row, Col } from "antd";
import { SaveOutlined, LockOutlined } from "@ant-design/icons";
import { getProfile, updateProfile } from "../api/user.api";
import { getAllUsers } from "../api/user.api";
import AppLayout from "../components/layout/AppLayout";

const Profile = () => {
  const [form] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);

  useEffect(() => {
    loadProfile();
    loadAllUsers();
  }, []);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await getProfile();
      setUser(res.data);
      form.setFieldsValue({
        name: res.data.name,
        email: res.data.email,
      });
    } catch (err) {
      message.error("Error loading profile");
      console.error("Error loading profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      setAllUsersLoading(true);
      const res = await getAllUsers();
      setAllUsers(res.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setAllUsersLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setUpdateLoading(true);
      await updateProfile({ name: values.name });
      message.success("Profile updated successfully");
      loadProfile();
    } catch (err) {
      message.error(err.response?.data?.message || "Error updating profile");
      console.error("Error updating profile:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const tabItems = [
    {
      key: "profile",
      label: "Profile Information",
      children: (
        <Spin spinning={profileLoading}>
          <Card>
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: "Name is required" }]}
                  >
                    <Input placeholder="Enter your name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                  >
                    <Input disabled placeholder="Your email address" />
                  </Form.Item>
                </Col>
              </Row>

              {user && (
                <div className="text-sm text-gray-500 mb-4">
                  <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              )}

              <Button
                type="primary"
                htmlType="submit"
                loading={updateLoading}
                icon={<SaveOutlined />}
              >
                Update Profile
              </Button>
            </Form>
          </Card>
        </Spin>
      ),
    },
    
    {
      key: "all",
      label: "All Profiles",
      children: (
        <Spin spinning={allUsersLoading}>
          <Card>
            {allUsers.length === 0 ? (
              <Empty description="No users found" />
            ) : (
              <div className="space-y-2">
                {allUsers.map((u) => (
                  <Card type="inner" key={u._id} title={u.name} size="small">
                    <p><strong>Email:</strong> {u.email}</p>
                    <p><strong>Joined:</strong> {new Date(u.createdAt).toLocaleDateString()}</p>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </Spin>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card title="Account Settings" className="shadow">
          <Tabs items={tabItems} />
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
