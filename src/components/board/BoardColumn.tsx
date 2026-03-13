import type { Task, TaskStatus } from "../../types/task";
import TaskCard from "./TaskCard";
import { cn } from "../../lib/utils";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const columnStyles: Record<TaskStatus, string> = {
  backlog: "bg-column-backlog",
  "in-progress": "bg-column-progress",
  done: "bg-column-done",
};

const columnLabels: Record<TaskStatus, string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  done: "Done",
};

const dotColors: Record<TaskStatus, string> = {
  backlog: "bg-muted-foreground",
  "in-progress": "bg-primary",
  done: "bg-priority-low",
};

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const BoardColumn = React.memo(function BoardColumn({
  status,
  tasks,
  onEdit,
  onMove,
  onDelete,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg p-3 min-h-[300px] flex flex-col transition-colors duration-200",
        columnStyles[status],
        isOver && "ring-2 ring-primary/40 bg-primary/5"
      )}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={cn("h-2.5 w-2.5 rounded-full", dotColors[status])} />
        <h2 className="text-sm font-semibold text-foreground">{columnLabels[status]}</h2>
        <span className="text-xs text-muted-foreground ml-auto bg-card rounded-full px-2 py-0.5 font-medium">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin max-h-[calc(100vh-240px)]">
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-lg">
              <p className="text-xs text-muted-foreground">No tasks</p>
            </div>
          )}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
});

export default BoardColumn;
