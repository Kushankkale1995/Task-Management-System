import { Form, Input, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const TaskForm = ({ onFinish, initialValues }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };

      await onFinish(payload); // call parent

      message.success("Task added successfully!"); // ✅ success popup
      form.resetFields(); // ✅ clear form
    } catch (err) {
      console.error(err);
      message.error("Failed to add task!"); // error popup
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        ...initialValues,
        dueDate: initialValues?.dueDate ? dayjs(initialValues.dueDate) : null,
      }}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input placeholder="Task title" />
      </Form.Item>

      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
        <Select placeholder="Select status">
          <Option value="Pending">Pending</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      </Form.Item>

      <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
        <Select placeholder="Select priority">
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>
      </Form.Item>

      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select placeholder="Select category" mode="tags">
          <Option value="Work">Work</Option>
          <Option value="Personal">Personal</Option>
          <Option value="Urgent">Urgent</Option>
        </Select>
      </Form.Item>

      <Form.Item name="dueDate" label="Due Date">
        <DatePicker className="w-full" />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        {initialValues ? "Update Task" : "Add Task"}
      </Button>
    </Form>
  );
};

export default TaskForm;
