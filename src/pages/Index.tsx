import { useState, useCallback, useMemo } from "react";
import { type Task, type TaskStatus, STATUSES } from "../types/task";
import { useTaskStore } from "../hooks/useTaskStore";
import {useFilters} from "../hooks/useFilters"
import BoardColumn from "../components/board/BoardColumn";
import TaskFormModal from "../components/board/TaskFormModal";
import { Button } from "../components/ui/button";
import { Plus, LayoutGrid } from "lucide-react";
import FilterBar from "../components/board/FilterBar";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import TaskCard from "../components/board/TaskCard";

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, moveTask, storageAvailable } =
    useTaskStore();
  const { filters, setFilters, resetFilters, filteredTasks, hasActiveFilters } =
    useFilters(tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleCreate = useCallback(() => {
    setEditingTask(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(
    (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      if (editingTask) {
        updateTask(editingTask.id, data);
      } else {
        addTask(data);
      }
    },
    [editingTask, updateTask, addTask]
  );

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      // Check if dropped over a column (droppable id is the status)
      const statuses: string[] = ["backlog", "in-progress", "done"];
      let targetStatus: TaskStatus | null = null;

      if (statuses.includes(over.id as string)) {
        targetStatus = over.id as TaskStatus;
      } else {
        // Dropped over another task — find which column that task is in
        const overTask = filteredTasks.find((t) => t.id === over.id);
        if (overTask) targetStatus = overTask.status;
      }

      if (targetStatus) {
        const currentTask = tasks.find((t) => t.id === taskId);
        if (currentTask && currentTask.status !== targetStatus) {
          moveTask(taskId, targetStatus);
        }
      }
    },
    [filteredTasks, tasks, moveTask]
  );

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    console.log(_event)
    // Could add preview logic here
  }, []);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      backlog: [],
      "in-progress": [],
      done: [],
    };
    filteredTasks.forEach((t) => {
      grouped[t.status].push(t);
    });
    return grouped;
  }, [filteredTasks]);

  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutGrid className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Workflow Board</h1>
              <p className="text-xs text-muted-foreground">
                {totalCount} task{totalCount !== 1 ? "s" : ""}
                {hasActiveFilters && ` · ${filteredTasks.length} shown`}
              </p>
            </div>
          </div>
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        </div>
      </header>

      {!storageAvailable && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-sm text-destructive">
          Local storage is unavailable. Your changes will not be saved.
        </div>
      )}

      <div className="container max-w-7xl mx-auto px-4 py-3">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          hasActive={hasActiveFilters}
        />
      </div>

      <main className="container max-w-7xl mx-auto px-4 pb-8">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">No tasks yet</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first task to get started
            </p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-1" />
              Create Task
            </Button>
          </div>
        ) : hasActiveFilters && filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-1">No matching tasks</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STATUSES.map((s) => (
                <BoardColumn
                  key={s.value}
                  status={s.value}
                  tasks={tasksByStatus[s.value]}
                  onEdit={handleEdit}
                  onMove={moveTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="rotate-2 opacity-90">
                  <TaskCard
                    task={activeTask}
                    onEdit={() => {}}
                    onMove={() => {}}
                    onDelete={() => {}}
                    isDragOverlay
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={deleteTask}
      />
    </div>
  );
};

export default Index;
