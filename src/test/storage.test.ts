import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as storage from '../lib/storage'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Storage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(storage.isStorageAvailable()).toBe(true)
    })

    it('returns false when localStorage throws', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage not available')
      })

      expect(storage.isStorageAvailable()).toBe(false)
    })
  })

  describe('loadTasks', () => {
    it('returns empty array when storage is not available', () => {
      vi.spyOn(storage, 'isStorageAvailable').mockReturnValue(false)

      expect(storage.loadTasks()).toEqual({ tasks: [], migrated: false })
    })

    it('returns empty array when no data exists', () => {
      vi.spyOn(storage, 'isStorageAvailable').mockReturnValue(true)
      localStorageMock.getItem.mockReturnValue(null)

      expect(storage.loadTasks()).toEqual({ tasks: [], migrated: false })
    })
  })
})