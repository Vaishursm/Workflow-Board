import { useState, useCallback } from "react";
import type { Task } from "../types/task";
import { toast } from "sonner";


export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>([]);

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
        // saveTasks(next);
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
        // saveTasks(next);
        return next;
      });
      toast.success("Task updated");
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
    //   saveTasks(next);
      return next;
    });
    toast.success("Task deleted");
  }, []);

  return { tasks, addTask, updateTask, deleteTask };
}
