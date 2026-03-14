import { useState, useCallback, useEffect, useRef } from "react";
import type { Task, TaskStatus, TaskPriority } from "../types/task";

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string;
}

export interface TaskFormErrors {
  title?: string;
  description?: string;
}

const EMPTY: TaskFormData = {
  title: "",
  description: "",
  status: "backlog",
  priority: "medium",
  assignee: "",
  tags: "",
};

export function useTaskForm(task?: Task | null) {
  const [data, setData] = useState<TaskFormData>(EMPTY);
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const initialRef = useRef<TaskFormData>(EMPTY);

  useEffect(() => {
    if (task) {
      const d: TaskFormData = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        tags: task.tags.join(", "),
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(d);
      initialRef.current = d;
    } else {
      setData(EMPTY);
      initialRef.current = EMPTY;
    }
    setErrors({});
    setIsDirty(false);
  }, [task]);

  const updateField = useCallback(
    <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
      setData((prev) => {
        const next = { ...prev, [field]: value };
        setIsDirty(JSON.stringify(next) !== JSON.stringify(initialRef.current));
        return next;
      });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const validate = useCallback((): boolean => {
    const e: TaskFormErrors = {};
    if (!data.title.trim()) e.title = "Title is required";
    else if (data.title.length > 100) e.title = "Title must be 100 characters or less";
    if (!data.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [data]);

  const getTaskData = useCallback(
    (): Omit<Task, "id" | "createdAt" | "updatedAt"> => ({
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      priority: data.priority,
      assignee: data.assignee.trim(),
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }),
    [data]
  );

  const reset = useCallback(() => {
    setData(EMPTY);
    setErrors({});
    setIsDirty(false);
    initialRef.current = EMPTY;
  }, []);

  return { data, errors, isDirty, updateField, validate, getTaskData, reset };
}
