import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  type Task,
  type TaskFilters,
  type SortField,
  type SortDirection,
  type TaskStatus,
  type TaskPriority,
  DEFAULT_FILTERS,
} from "../types/task";

const PRIORITY_ORDER: Record<string, number> = { high: 3, medium: 2, low: 1 };

function filtersFromParams(params: URLSearchParams): TaskFilters {
  return {
    status: (params.get("status")?.split(",").filter(Boolean) || []) as TaskStatus[],
    priority: (params.get("priority") || "") as TaskPriority | "",
    search: params.get("search") || "",
    sortBy: (params.get("sortBy") || DEFAULT_FILTERS.sortBy) as SortField,
    sortDir: (params.get("sortDir") || DEFAULT_FILTERS.sortDir) as SortDirection,
  };
}

function filtersToParams(f: TaskFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.status.length) p.set("status", f.status.join(","));
  if (f.priority) p.set("priority", f.priority);
  if (f.search) p.set("search", f.search);
  if (f.sortBy !== DEFAULT_FILTERS.sortBy) p.set("sortBy", f.sortBy);
  if (f.sortDir !== DEFAULT_FILTERS.sortDir) p.set("sortDir", f.sortDir);
  return p;
}

export function useFilters(tasks: Task[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);

  const setFilters = useCallback(
    (update: Partial<TaskFilters>) => {
      const next = { ...filtersFromParams(searchParams), ...update };
      setSearchParams(filtersToParams(next), { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filters.status.length > 0) {
      result = result.filter((t) => filters.status.includes(t.status));
    }
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === "priority") {
        cmp = (PRIORITY_ORDER[a.priority] || 0) - (PRIORITY_ORDER[b.priority] || 0);
      } else {
        cmp = new Date(a[filters.sortBy]).getTime() - new Date(b[filters.sortBy]).getTime();
      }
      return filters.sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [tasks, filters]);

  const hasActiveFilters = filters.status.length > 0 || !!filters.priority || !!filters.search;

  return { filters, setFilters, resetFilters, filteredTasks, hasActiveFilters };
}
