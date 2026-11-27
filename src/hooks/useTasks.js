import { useCallback, useEffect, useState } from 'react';

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from './src/services/tasks';

export function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError('');

      const data = await getTasks();

      setTasks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false)
    }
  }, [userId]);

  useEffect(() => {
    setTasks([]);

    if (!userId) return;
    fetchTasks();
  }, [userId, fetchTasks]);

  async function addTask(title, description, priority) {
    try {
      setError('');

      const newTask = await createTask(
        title,
        description,
        priority
      );

      setTasks((current) => [newTrask, ...current]);

      return newTask;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function toggleTasks(task) {
    try {
      setError('');

      const updatedTask = await updateTask(
        task.id,
        !task.completed
      );

      setTasks((current) =>
        current.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        )
      );
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function removeTasks(taskId) {
    try {
      setError('');

      await deleteTask(taskId);

      setTasks((current) =>
        current.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleTasks,
    removeTasks
  }
}
