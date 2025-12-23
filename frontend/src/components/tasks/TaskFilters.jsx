import { Select, Button } from "antd";

const { Option } = Select;

const TaskFilter = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4 mb-4">
      <Select
        placeholder="Status"
        value={filters.status || undefined}
        onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
        allowClear
      >
        <Option value="Pending">Pending</Option>
        <Option value="In Progress">In Progress</Option>
        <Option value="Completed">Completed</Option>
      </Select>

      <Select
        placeholder="Priority"
        value={filters.priority || undefined}
        onChange={(value) => setFilters((prev) => ({ ...prev, priority: value }))}
        allowClear
      >
        <Option value="Low">Low</Option>
        <Option value="Medium">Medium</Option>
        <Option value="High">High</Option>
      </Select>

      <Select
        placeholder="Category"
        value={filters.category || undefined}
        onChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
        allowClear
        mode="tags"
      ></Select>

      <Button onClick={() => setFilters({})}>Reset</Button>
    </div>
  );
};

export default TaskFilter;
