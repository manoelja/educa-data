import { describe, it, expect } from 'vitest'
import { CHALK_ACCENTS, CHALK_COLORS, chalkColor } from '../lib/scene/chalk'

describe('paleta de giz', () => {
  it('tem tons únicos, com hex e tripla rgb coerentes', () => {
    expect(new Set(CHALK_COLORS.map((color) => color.id)).size).toBe(CHALK_COLORS.length)

    CHALK_COLORS.forEach((color) => {
      expect(color.hex).toMatch(/^#[0-9a-f]{6}$/i)

      const parts = color.rgb.split(',').map((part) => Number(part.trim()))
      expect(parts).toHaveLength(3)
      parts.forEach((value) => {
        expect(Number.isInteger(value)).toBe(true)
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(255)
      })
    })
  })

  it('cicla o índice, inclusive negativo e maior que a paleta', () => {
    expect(chalkColor(0)).toBe(CHALK_COLORS[0])
    expect(chalkColor(CHALK_COLORS.length)).toBe(CHALK_COLORS[0])
    expect(chalkColor(-1)).toBe(CHALK_COLORS[CHALK_COLORS.length - 1])
    expect(chalkColor(-1).id).toBe('verde')
  })
})

describe('traços de giz', () => {
  it('tem as sete variantes usadas pelos cards', () => {
    expect(Object.keys(CHALK_ACCENTS).sort()).toEqual([
      'arrow',
      'bars',
      'circle',
      'formula',
      'ticks',
      'underline',
      'wave',
    ])
  })

  it('cada variante é um caminho SVG real (não um ícone vazio)', () => {
    Object.values(CHALK_ACCENTS).forEach((paths) => {
      expect(paths.length).toBeGreaterThan(0)
      paths.forEach((d) => {
        expect(d.startsWith('M')).toBe(true)
        expect(d.length).toBeGreaterThan(10)
      })
    })
  })
})
