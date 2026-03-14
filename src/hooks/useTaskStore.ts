import { useState, useCallback, useEffect, useRef } from "react";
import type { Task, TaskStatus } from "../types/task";
import { loadTasks, saveTasks, isStorageAvailable } from "../lib/storage";
import { toast } from "sonner";

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const available = isStorageAvailable();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStorageAvailable(available);

    if (!available) {
      toast.error("Local storage is unavailable. Changes won't be persisted.");
      return;
    }

    const { tasks: loaded, migrated } = loadTasks();
    setTasks(loaded);

    if (migrated) {
      toast.info("Your data was migrated to a newer format.", { duration: 5000 });
    }
  }, []);
  
  const addTask = useCallback(
    (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const task: Task = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => {
        const next = [task, ...prev];
        saveTasks(next);
        return next;
      });
      toast.success("Task created");
      return task;
    },
    []
  );

  const updateTask = useCallback(
    (id: string, data: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prev) => {
        const next = prev.map((t) =>
          t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
        );
        saveTasks(next);
        return next;
      });
      toast.success("Task updated");
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTasks(next);
      return next;
    });
    toast.success("Task deleted");
  }, []);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
      );
      saveTasks(next);
      return next;
    });
  }, []);

  return { tasks, addTask, updateTask, deleteTask, moveTask, storageAvailable };
}
