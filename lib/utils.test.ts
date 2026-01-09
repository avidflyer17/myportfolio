import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
    it('should merge class names correctly', () => {
        expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
        expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
    })

    it('should merge tailwind classes properly', () => {
        // p-4 should be overridden by p-2
        expect(cn('p-4', 'p-2')).toBe('p-2')
        // text-red-500 should be overridden by text-blue-500
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should handle mixed inputs (arrays, objects)', () => {
        expect(cn(['cls1', 'cls2'], { cls3: true, cls4: false })).toBe('cls1 cls2 cls3')
    })
})
