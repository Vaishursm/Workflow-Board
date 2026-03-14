import { type TaskFilters, STATUSES, PRIORITIES, type TaskStatus, type TaskPriority, type SortField, type SortDirection } from "../../types/task";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Search, X, ArrowUpDown } from "lucide-react";

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (update: Partial<TaskFilters>) => void;
  onReset: () => void;
  hasActive: boolean;
}

export default function FilterBar({ filters, onChange, onReset, hasActive }: FilterBarProps) {
  const toggleStatus = (s: TaskStatus) => {
    const next = filters.status.includes(s)
      ? filters.status.filter((x) => x !== s)
      : [...filters.status, s];
    onChange({ status: next });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="pl-9 h-9"
          aria-label="Search tasks"
        />
      </div>

      {/* Status multi-select as toggle badges */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground font-medium">Status:</span>
        {STATUSES.map((s) => (
          <Badge
            key={s.value}
            variant={filters.status.includes(s.value) ? "default" : "secondary"}
            className="cursor-pointer text-xs select-none"
            onClick={() => toggleStatus(s.value)}
            role="checkbox"
            aria-checked={filters.status.includes(s.value)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleStatus(s.value);
              }
            }}
          >
            {s.label}
          </Badge>
        ))}
      </div>

      {/* Priority filter */}
      <Select
        value={filters.priority || "all"}
        onValueChange={(v) => onChange({ priority: v === "all" ? "" : (v as TaskPriority) })}
      >
        <SelectTrigger className="w-[130px] h-9" aria-label="Filter by priority">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {PRIORITIES.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${filters.sortBy}-${filters.sortDir}`}
        onValueChange={(v) => {
          const [sortBy, sortDir] = v.split("-") as [SortField, SortDirection];
          onChange({ sortBy, sortDir });
        }}
      >
        <SelectTrigger className="w-[170px] h-9" aria-label="Sort tasks">
          <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updatedAt-desc">Updated (newest)</SelectItem>
          <SelectItem value="updatedAt-asc">Updated (oldest)</SelectItem>
          <SelectItem value="createdAt-desc">Created (newest)</SelectItem>
          <SelectItem value="createdAt-asc">Created (oldest)</SelectItem>
          <SelectItem value="priority-desc">Priority (high first)</SelectItem>
          <SelectItem value="priority-asc">Priority (low first)</SelectItem>
        </SelectContent>
      </Select>

      {hasActive && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
          <X className="h-3.5 w-3.5 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
