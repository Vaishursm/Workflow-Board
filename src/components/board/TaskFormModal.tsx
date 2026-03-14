import { useEffect, useRef, useCallback } from "react";
import type { Task, TaskStatus, TaskPriority } from "../../types/task";
import { useTaskForm } from "../../hooks/useTaskForm";
import { STATUSES, PRIORITIES } from "../../types/task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";

interface TaskFormModalProps {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onDelete?: (id: string) => void;
}

export default function TaskFormModal({
  open,
  task,
  onClose,
  onSave,
  onDelete,
}: TaskFormModalProps) {
  const { data, errors, isDirty, updateField, validate, getTaskData, reset } =
    useTaskForm(task);
  const [showConfirm, setShowConfirm] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      reset();
      onClose();
    }
  }, [isDirty, reset, onClose]);

  const handleConfirmDiscard = useCallback(() => {
    setShowConfirm(false);
    reset();
    onClose();
  }, [reset, onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      onSave(getTaskData());
      reset();
      onClose();
    },
    [validate, onSave, getTaskData, reset, onClose]
  );

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="sm:max-w-[520px]" aria-describedby="task-form-desc">
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
            <DialogDescription id="task-form-desc">
              {task ? "Update the task details below." : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                ref={titleRef}
                value={data.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Task title"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the task..."
                rows={4}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "desc-error" : undefined}
              />
              {errors.description && (
                <p id="desc-error" className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={data.status} onValueChange={(v) => updateField("status", v as TaskStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <Select value={data.priority} onValueChange={(v) => updateField("priority", v as TaskPriority)}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={data.assignee}
                onChange={(e) => updateField("assignee", e.target.value)}
                placeholder="Who's working on this?"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={data.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                placeholder="Comma separated: bug, frontend, urgent"
              />
            </div>

            <DialogFooter className="flex gap-2 pt-2">
              {task && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onDelete(task.id);
                    reset();
                    onClose();
                  }}
                  className="mr-auto"
                >
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{task ? "Save Changes" : "Create Task"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
