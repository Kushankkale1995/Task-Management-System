import { Table, Space, Button, Popconfirm, Tag, Empty, Spin, Row, Col, Select, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getTasks, deleteTask } from "../../api/task.api";
import { getCategories } from "../../api/category.api";
import { useEffect, useState } from "react";
import _ from "lodash";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterPriority, setFilterPriority] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data || []);
    } catch (err) {
      message.error("Error loading tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      message.success("Task deleted successfully");
      loadTasks();
    } catch (err) {
      message.error("Error deleting task");
      console.error("Error deleting task:", err);
    }
  };

  // Apply filters using Lodash
  let filteredTasks = tasks;
  if (filterStatus) {
    filteredTasks = _.filter(filteredTasks, { status: filterStatus });
  }
  if (filterPriority) {
    filteredTasks = _.filter(filteredTasks, { priority: filterPriority });
  }
  if (filterCategory) {
    filteredTasks = _.filter(filteredTasks, (task) => task.category?._id === filterCategory);
  }

  // Apply sorting using Lodash
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  filteredTasks = _.orderBy(
    filteredTasks,
    [
      sortBy === "priority" ? (task) => priorityOrder[task.priority] || 0 : 
      sortBy === "dueDate" ? (task) => new Date(task.dueDate) || new Date(0) : 
      (task) => new Date(task.createdAt)
    ],
    ["desc"]
  );

  const statusColors = { Pending: "orange", "In Progress": "blue", Completed: "green" };
  const priorityColors = { Low: "green", Medium: "orange", High: "red" };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => <Tag color={priorityColors[priority]}>{priority}</Tag>,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (name) => name || "—",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => setEditingTask(record)}
          />
          <Popconfirm
            title="Delete Task"
            description="Are you sure you want to delete this task?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <TaskForm
        onTaskSaved={() => {
          loadTasks();
          setEditingTask(null);
        }}
        task={editingTask}
        categories={categories}
        onCancel={() => setEditingTask(null)}
      />

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filter & Sort</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by Status"
              allowClear
              onChange={setFilterStatus}
              className="w-full"
              options={[
                { label: "Pending", value: "Pending" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by Priority"
              allowClear
              onChange={setFilterPriority}
              className="w-full"
              options={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by Category"
              allowClear
              onChange={setFilterCategory}
              className="w-full"
              options={categories.map((cat) => ({ label: cat.name, value: cat._id }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              className="w-full"
              options={[
                { label: "Newest", value: "createdAt" },
                { label: "Due Date", value: "dueDate" },
                { label: "Priority", value: "priority" },
              ]}
            />
          </Col>
        </Row>
      </div>

      <Spin spinning={loading}>
        {filteredTasks.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            className="bg-white"
          />
        ) : (
          <Empty description={loading ? "Loading..." : "No tasks found"} />
        )}
      </Spin>
    </div>
  );
};

export default TaskList;
