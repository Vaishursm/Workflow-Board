export type TaskStatus = "backlog" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  createdAt: Date | number | string;
  updatedAt: Date | number | string;
}

export type SortField = "createdAt" | "updatedAt" | "priority";
export type SortDirection = "asc" | "desc";

export interface TaskFilters {
  status: TaskStatus[];
  priority: TaskPriority | "";
  search: string;
  sortBy: SortField;
  sortDir: SortDirection;
}

export const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const DEFAULT_FILTERS: TaskFilters = {
  status: [],
  priority: "",
  search: "",
  sortBy: "updatedAt",
  sortDir: "desc",
};
