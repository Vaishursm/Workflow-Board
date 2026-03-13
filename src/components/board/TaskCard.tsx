import { formatDistanceToNow } from "date-fns";
import type { Task, TaskPriority } from "../../types/task";
import { STATUSES } from "../../types/task";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { GripVertical, Clock, User } from "lucide-react";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  high: { label: "High", className: "bg-priority-high text-card border-transparent" },
  medium: { label: "Medium", className: "bg-priority-medium text-card border-transparent" },
  low: { label: "Low", className: "bg-priority-low text-card border-transparent" },
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onMove: (id: string, status: Task["status"]) => void;
  onDelete: (id: string) => void;
  isDragOverlay?: boolean;
}

const TaskCard = React.memo(function TaskCard({ task, onEdit, onMove, isDragOverlay }: TaskCardProps) {
  const prio = priorityConfig[task.priority];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { task },
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="group cursor-pointer shadow-card hover:shadow-card-hover transition-shadow animate-fade-in touch-none"
      onClick={() => !isDragging && onEdit(task)}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}`}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(task);
        }
      }}
    >
      <div className="p-3 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-card-foreground leading-snug line-clamp-2 flex-1">
            {task.title}
          </h3>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing shrink-0 mt-0.5"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={prio.className + " text-[10px] px-1.5 py-0"}>{prio.label}</Badge>
          {task.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{task.tags.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
          </div>
          {task.assignee && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[80px]">{task.assignee}</span>
            </div>
          )}
        </div>

        {/* Status change dropdown */}
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          <Select value={task.status} onValueChange={(v: string) => onMove(task.id, v as Task["status"])}>
            <SelectTrigger className="h-7 text-[11px]" aria-label="Change task status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-xs">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
});

export default TaskCard;
