import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "./AuthContext";

import {
  createTask,
  getTask,
  updateTasks,
  deleteTasks
} from "./src/services/tasks";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Task state
  const [tasks, setTasks] = useState([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Tasks
  useEffect(() => {
    async function fetchTasks(); {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  async function handleCreateTask(e) => {
    e.preventDefault();

    try {
      setError("");

      const newTask = await createTask(
        title,
        description,
        priority
      );

      setTasks((currentTasks) => [
        newTask,
        ...currentTasks,
      ]);

      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleToggleTask(task) {
    try {
      setError("");

      const updatedTask = await updateTask(
        task.id,
        !task.completed
      );

      setTasks((currentTasks) =>
        currentTasks.map((curentTask) =>
          currentTasks.id === updatedTask.id
            ? updatedTask
            : currentTask
        )
      )
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      setError("");

      await deleteTasks(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main>
      <header>
        <h1>Task Manager</h1>
        <p>Welcome, {user?.mail}</p>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section>
        <h2>Create a task</h2>
        <form onSubmit={handleCreateTask}>
          <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button type="submit">
            Create a Task
          </button>
        </form>
      </section>

      <section>
        <h2>Your tasks</h2>
        {loading && <p>Loading tasks...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && tasks.length === 0 && (
          <p>Your don't have any task yet.</p>
        )}

        {tasks.map((task) => (
          <article key={task.id}>
            <h3>
              {task.completed ? "✅" : "⬜"} {task.title}
            </h3>

            <p>{task.description}</p>
            <p>Priority: {task.priority}</p>

            <button onClick={() => handleToggleTask(task)}>
              {task.completed ? "Mark as pending" : "Complete"}
            </button>

            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Dashboard;
