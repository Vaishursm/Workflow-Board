export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: "low" | "medium" | "high";
  createdAt: number;
};