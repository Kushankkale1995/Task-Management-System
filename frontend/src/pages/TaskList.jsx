import { useEffect, useState } from "react";
import { Table, Button, Select } from "antd";
import { getTasks, deleteTask } from "../../api/task.api";
import { filterTasks } from "../../utils/taskFilter";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getTasks().then((res) => setTasks(res.data));
  }, []);

  const filtered = filterTasks(tasks, status);

  return (
    <>
      <Select
        placeholder="Filter by Status"
        onChange={setStatus}
        className="mb-4 w-52"
        allowClear
      >
        <Select.Option value="Pending">Pending</Select.Option>
        <Select.Option value="Completed">Completed</Select.Option>
      </Select>

      <Table
        dataSource={filtered}
        rowKey="_id"
        columns={[
          { title: "Title", dataIndex: "title" },
          { title: "Status", dataIndex: "status" },
          {
            title: "Action",
            render: (_, record) => (
              <Button danger onClick={() => deleteTask(record._id)}>
                Delete
              </Button>
            )
          }
        ]}
      />
    </>
  );
};

export default TaskList;
