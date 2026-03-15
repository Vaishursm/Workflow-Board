import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTaskStore } from '../hooks/useTaskStore'
import * as storage from '../lib/storage'
import type { Task } from '../types/task'

// Mock storage
vi.mock('../lib/storage', () => ({
  loadTasks: vi.fn(),
  saveTasks: vi.fn(),
  isStorageAvailable: vi.fn(),
}))

const mockStorage = vi.mocked(storage)

describe('useTaskStore hook', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test description',
    status: 'backlog',
    priority: 'medium',
    assignee: 'Test User',
    tags: ['test'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockStorage.isStorageAvailable.mockReturnValue(true)
    mockStorage.loadTasks.mockReturnValue({ tasks: [], migrated: false })
  })

  it('initializes with empty tasks', () => {
    const { result } = renderHook(() => useTaskStore())

    expect(result.current.tasks).toEqual([])
    expect(result.current.storageAvailable).toBe(true)
  })

  it('loads tasks on mount', () => {
    mockStorage.loadTasks.mockReturnValue({ tasks: [mockTask], migrated: false })

    const { result } = renderHook(() => useTaskStore())

    expect(result.current.tasks).toEqual([mockTask])
  })

  it('adds a new task', () => {
    const { result } = renderHook(() => useTaskStore())

    act(() => {
      result.current.addTask({
        title: 'New Task',
        description: 'New description',
        status: 'backlog',
        priority: 'high',
        assignee: 'New User',
        tags: ['new'],
      })
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('New Task')
    expect(result.current.tasks[0].id).toBeDefined()
    expect(mockStorage.saveTasks).toHaveBeenCalledWith(result.current.tasks)
  })

  it('updates an existing task', () => {
    mockStorage.loadTasks.mockReturnValue({ tasks: [mockTask], migrated: false })

    const { result } = renderHook(() => useTaskStore())

    act(() => {
      result.current.updateTask('1', { title: 'Updated Title' })
    })

    expect(result.current.tasks[0].title).toBe('Updated Title')
    expect(result.current.tasks[0].updatedAt).not.toBe(mockTask.updatedAt)
    expect(mockStorage.saveTasks).toHaveBeenCalled()
  })

  it('deletes a task', () => {
    mockStorage.loadTasks.mockReturnValue({ tasks: [mockTask], migrated: false })

    const { result } = renderHook(() => useTaskStore())

    act(() => {
      result.current.deleteTask('1')
    })

    expect(result.current.tasks).toHaveLength(0)
    expect(mockStorage.saveTasks).toHaveBeenCalledWith([])
  })

  it('moves a task to different status', () => {
    mockStorage.loadTasks.mockReturnValue({ tasks: [mockTask], migrated: false })

    const { result } = renderHook(() => useTaskStore())

    act(() => {
      result.current.moveTask('1', 'in-progress')
    })

    expect(result.current.tasks[0].status).toBe('in-progress')
    expect(result.current.tasks[0].updatedAt).not.toBe(mockTask.updatedAt)
    expect(mockStorage.saveTasks).toHaveBeenCalled()
  })

  it('handles storage unavailable', () => {
    mockStorage.isStorageAvailable.mockReturnValue(false)

    const { result } = renderHook(() => useTaskStore())

    expect(result.current.storageAvailable).toBe(false)
  })
})