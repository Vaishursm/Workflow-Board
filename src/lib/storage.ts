const TASK_KEY = "workflow_tasks";

export const loadTasks = () => {
  const data = localStorage.getItem(TASK_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: unknown) => {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
};