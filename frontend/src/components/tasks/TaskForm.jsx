import { Form, Input, Button, Select, DatePicker, Card, message, Row, Col } from "antd";
import { createTask, updateTask } from "../../api/task.api";
import { createCategory as apiCreateCategory } from "../../api/category.api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const TaskForm = ({ onTaskSaved, task, categories = [], onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        // description removed
        status: task.status,
        priority: task.priority,
        category: task.category?._id,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [task, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Normalize category value: Select mode 'tags' may return an array
      let categoryVal = values.category;
      if (Array.isArray(categoryVal)) {
        // choose the first provided tag (single-category UI expected)
        categoryVal = categoryVal.length > 0 ? categoryVal[0] : null;
      }

      // Handle category: if user typed a new category (string not matching an existing id), create it
      let categoryId = null;
      if (categoryVal) {
        const existing = categories.find(
          (c) => c._id === categoryVal || c.name === categoryVal
        );
        if (existing) {
          categoryId = existing._id;
        } else {
          // create new category (categoryVal should be a string name)
          const res = await apiCreateCategory({ name: categoryVal });
          // apiCreateCategory returns axios response; category is in res.data
          categoryId = res.data && (res.data._id || res.data.id) ? (res.data._id || res.data.id) : (res.data?._id || res.data?.id || res.data);
        }
      }

      const payload = {
        title: values.title,
        status: values.status,
        priority: values.priority,
        category: categoryId || null,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };

      if (task) {
        await updateTask(task._id, payload);
        message.success("Task updated successfully");
      } else {
        await createTask(payload);
        message.success("Task created successfully");
      }
      form.resetFields();
      onTaskSaved();
    } catch (err) {
      message.error(err.response?.data?.message || "Error saving task");
      console.error("Error saving task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={task ? "Edit Task" : "Create New Task"} className="mb-4 shadow">
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Enter task title" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: "Priority is required" }]}
              initialValue="Medium"
            >
              <Select placeholder="Select priority">
                <Select.Option value="Low">Low</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="High">High</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Description removed as requested */}

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="status"
              label="Status"
              initialValue="Pending"
            >
              <Select placeholder="Select status">
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="category" label="Category">
              <Select
                mode="tags"
                placeholder="Select or type category (optional)"
                options={(() => {
                  const defaultNames = ["Work", "Urgent", "Personal"];
                  const opts = [];
                  // existing categories as id => name
                  categories.forEach((c) => opts.push({ value: c._id, label: c.name }));
                  // add default names if not present in categories
                  defaultNames.forEach((n) => {
                    if (!categories.some((c) => c.name === n)) opts.push({ value: n, label: n });
                  });
                  return opts;
                })()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="dueDate"
              label="Due Date"
            >
              <DatePicker className="w-full" placeholder="Select due date" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex gap-2 justify-end">
          {task && onCancel && (
            <Button onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default TaskForm;
