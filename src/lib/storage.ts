const TASK_KEY = "workflow_tasks";

export const loadTasks = () => {
  const data = localStorage.getItem(TASK_KEY);
  const parsed = data ? JSON.parse(data) : [];
  const tasks = Array.isArray(parsed) ? parsed : [];
  return { tasks, migrated: false };
};

export const saveTasks = (tasks: unknown) => {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
};

export function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}