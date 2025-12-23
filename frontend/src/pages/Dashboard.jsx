import AppLayout from "../components/layout/AppLayout";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import { createTask, getTasks } from "../api/taskApi";
import { useState, useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import { message } from "antd";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data); // assuming res.data contains array of tasks
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      message.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();

    // Listen for login/logout changes
    const syncAuth = () => setLoggedIn(isAuthenticated());
    window.addEventListener("auth-change", syncAuth);
    return () => window.removeEventListener("auth-change", syncAuth);
  }, []);

  // Add task (only allowed for logged-in users)
  const handleAddTask = async (values) => {
    if (!loggedIn) {
      message.warning("Please login to add tasks");
      return;
    }

    try {
      await createTask(values);
      message.success("Task created successfully");
      fetchTasks(); // refresh task list
    } catch (err) {
      message.error("Failed to add task");
    }
  };

  return (
    <AppLayout>
      {/* TaskForm only for logged-in users */}
      {loggedIn && <TaskForm onFinish={handleAddTask} />}

      {/* TaskList always visible, disable actions if not logged in */}
      <TaskList tasks={tasks} loggedIn={loggedIn} />
    </AppLayout>
  );
};

export default Dashboard;
