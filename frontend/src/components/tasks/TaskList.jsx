import { Table, Button, Select, Modal, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask, getPublicTasks } from "../../api/taskApi";
import { getCategories } from "../../api/categoryApi"; // create this API

const { Option } = Select;

const TaskList = ({ loggedIn }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch tasks & categories on load
  useEffect(() => {
    fetchTasks();
    if (loggedIn) fetchCategories();
  }, [loggedIn]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let data = [];
      if (loggedIn && localStorage.getItem("token")) {
        data = await getTasks();
      } else {
        data = await getPublicTasks();
      }
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      if (loggedIn && err?.response?.status === 401) {
        const publicData = await getPublicTasks();
        setTasks(publicData);
        message.warning("Session expired. Showing public tasks.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!loggedIn) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      message.success("Task deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const updated = await updateTask(editingTask._id, values);
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? updated.data || updated : t))
      );
      setModalVisible(false);
      setEditingTask(null);
      message.success("Task updated");
    } catch (err) {
      console.error("Update failed:", err);
      message.error("Failed to update task");
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const statusMatch = filterStatus ? t.status === filterStatus : true;
    const categoryMatch = filterCategory ? t.category?._id === filterCategory : true;
    return statusMatch && categoryMatch;
  });

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    { title: "Category", dataIndex: ["category", "name"], key: "category" },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        loggedIn ? (
          <>
            <Button type="link" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Button danger onClick={() => handleDelete(record._id)}>
              Delete
            </Button>
          </>
        ) : null,
    },
  ];

  return (
    <div>
      {loggedIn && (
        <div style={{ marginBottom: 16 }}>
          <Select
            placeholder="Filter by status"
            style={{ width: 180, marginRight: 16 }}
            allowClear
            onChange={(value) => setFilterStatus(value)}
          >
            <Option value="Pending">Pending</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
          </Select>

          <Select
            placeholder="Filter by category"
            style={{ width: 180 }}
            allowClear
            onChange={(value) => setFilterCategory(value)}
          >
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </div>
      )}

      <Table
        dataSource={filteredTasks}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Task"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {editingTask && (
          <Form
            initialValues={{
              title: editingTask.title,
              status: editingTask.status,
              priority: editingTask.priority,
            }}
            onFinish={handleUpdate}
            layout="vertical"
          >
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Option value="Pending">Pending</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Form.Item>

            <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Update
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default TaskList;
