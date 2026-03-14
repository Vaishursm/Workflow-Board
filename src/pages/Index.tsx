import { useState } from "react";
import BoardColumn from "../components/board/BoardColumn";
import type { Task, TaskStatus } from "../types/task";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Setup project",
    description: "Initialize repository and install dependencies",
    assignee: "Alice",
    priority: "high",
    status: "backlog",
    tags: ["setup"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "2",
    title: "Build board UI",
    description: "Create components for board columns and task cards",
    assignee: "Bob",
    priority: "medium",
    status: "in-progress",
    tags: ["ui"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "3",
    title: "Write docs",
    description: "Document project setup and usage instructions",
    assignee: "Charlie",
    priority: "low",
    status: "done",
    tags: ["docs"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleEdit = (task: Task) => {
    console.log("Edit task:", task);
  };

  const handleMove = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status, updatedAt: Date.now() }
          : t
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const backlog = tasks.filter((t) => t.status === "backlog");
  const inProgress = tasks.filter((t) => t.status === "in-progress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="p-6 h-screen">
      <h1 className="text-xl font-semibold mb-6">Workflow Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 h-full">
        <BoardColumn
          status="backlog"
          tasks={backlog}
          onEdit={handleEdit}
          onMove={handleMove}
          onDelete={handleDelete}
        />

        <BoardColumn
          status="in-progress"
          tasks={inProgress}
          onEdit={handleEdit}
          onMove={handleMove}
          onDelete={handleDelete}
        />

        <BoardColumn
          status="done"
          tasks={done}
          onEdit={handleEdit}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}