import type { Task } from "../types/task";

const STORAGE_KEY = "workflow-board-tasks";
const VERSION_KEY = "workflow-board-version";
const CURRENT_VERSION = 2;

interface StorageV1Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority?: string;
  assignee?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

function migrateV1ToV2(tasks: StorageV1Task[]): Task[] {
  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description || "",
    status: (["backlog", "in-progress", "done"].includes(t.status) ? t.status : "backlog") as Task["status"],
    priority: (["low", "medium", "high"].includes(t.priority || "") ? t.priority : "medium") as Task["priority"],
    assignee: t.assignee || "",
    tags: Array.isArray(t.tags) ? t.tags : [],
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: t.updatedAt || t.createdAt || new Date().toISOString(),
  }));
}

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

const OLD_STORAGE_KEY = "workflow_tasks";

export function loadTasks(): { tasks: Task[]; migrated: boolean } {
  if (!isStorageAvailable()) {
    return { tasks: [], migrated: false };
  }

  try {
    // Check for old storage key first
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const oldParsed = JSON.parse(oldRaw);
      if (Array.isArray(oldParsed)) {
        const migrated = migrateV1ToV2(oldParsed);
        saveTasks(migrated);
        localStorage.removeItem(OLD_STORAGE_KEY); // Clean up old key
        return { tasks: migrated, migrated: true };
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: [], migrated: false };

    const parsed = JSON.parse(raw);
    const version = Number(localStorage.getItem(VERSION_KEY) || "1");

    if (version < CURRENT_VERSION) {
      const migrated = migrateV1ToV2(parsed);
      saveTasks(migrated);
      return { tasks: migrated, migrated: true };
    }

    return { tasks: parsed as Task[], migrated: false };
  } catch {
    return { tasks: [], migrated: false };
  }
}

export function saveTasks(tasks: Task[]): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
  } catch {
    // Storage full or unavailable
  }
}
