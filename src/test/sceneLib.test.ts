import { describe, it, expect, beforeEach } from 'vitest'
import { easeOutCubic, FOCAL, lerp, projectBlur, projectScale } from '../lib/scene/projection'
import { drift, noise1 } from '../lib/scene/noise'
import { getPointer, resetPointer, stepPointer } from '../lib/scene/pointer'

describe('projectScale', () => {
  it('mantém escala 1 no plano focal', () => {
    expect(projectScale(0)).toBe(1)
  })

  it('aumenta quando o objeto se aproxima da câmera', () => {
    expect(projectScale(300)).toBeGreaterThan(1)
  })

  it('diminui quando o objeto se afasta', () => {
    expect(projectScale(-300)).toBeLessThan(1)
    expect(projectScale(-300)).toBeCloseTo(FOCAL / (FOCAL + 300), 6)
  })

  it('nunca divide por zero nem devolve valor negativo', () => {
    expect(projectScale(FOCAL)).toBeGreaterThan(0)
    expect(projectScale(FOCAL * 2)).toBeGreaterThan(0)
  })
})

describe('projectBlur', () => {
  it('não desfoca o que está no plano focal', () => {
    expect(projectBlur(0)).toBe(0)
  })

  it('cresce com a distância ao plano focal e respeita o teto', () => {
    expect(projectBlur(-200)).toBeGreaterThan(projectBlur(-100))
    expect(projectBlur(-5000)).toBeLessThanOrEqual(7)
  })
})

describe('lerp e easeOutCubic', () => {
  it('lerp interpola entre dois valores', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
    expect(lerp(0, 10, 0)).toBe(0)
    expect(lerp(0, 10, 1)).toBe(10)
  })

  it('easeOutCubic começa em 0, termina em 1 e limita fora da faixa', () => {
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(1)).toBe(1)
    expect(easeOutCubic(-1)).toBe(0)
    expect(easeOutCubic(4)).toBe(1)
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5)
  })
})

describe('noise1 / drift', () => {
  it('é determinístico para a mesma entrada', () => {
    expect(noise1(3.2, 7)).toBe(noise1(3.2, 7))
  })

  it('fica na faixa [0, 1] e o drift em [-1, 1]', () => {
    for (let i = 0; i < 40; i++) {
      const value = noise1(i * 0.37, i)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(1)

      const centered = drift(i * 0.37, i)
      expect(centered).toBeGreaterThanOrEqual(-1)
      expect(centered).toBeLessThanOrEqual(1)
    }
  })

  it('varia entre entradas vizinhas (não é uma constante)', () => {
    expect(noise1(1, 0)).not.toBe(noise1(1.5, 0))
  })
})

describe('pointer', () => {
  beforeEach(() => resetPointer())

  it('começa centrado e sem suporte a hover', () => {
    const pointer = getPointer()
    expect(pointer.x).toBe(0)
    expect(pointer.y).toBe(0)
    expect(pointer.supported).toBe(false)
  })

  it('aproxima-se do alvo a cada passo (inércia)', () => {
    getPointer().targetX = 1
    stepPointer(0.5)
    const first = getPointer().x
    stepPointer(0.5)
    const second = getPointer().x

    expect(first).toBeGreaterThan(0)
    expect(first).toBeLessThan(1)
    expect(second).toBeGreaterThan(first)
    expect(second).toBeLessThanOrEqual(1)
  })
})
