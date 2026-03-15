import { describe, it, expect } from 'vitest'
import { cn } from '../lib/utils'

const truthy = true
const falsy =  false
describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('handles conditional classes', () => {
    expect(cn('class1', truthy && 'class2', falsy && 'class3')).toBe('class1 class2')
  })

  it('merges conflicting Tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('', 'class1', '')).toBe('class1')
  })
})