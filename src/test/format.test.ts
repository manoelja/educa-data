import { describe, it, expect } from 'vitest'
import { formatNumber, interpolateCount } from '../lib/format'

describe('formatNumber', () => {
  it('formata números inteiros no padrão pt-BR', () => {
    expect(formatNumber(178400)).toBe('178.400')
  })

  it('respeita as casas decimais pedidas', () => {
    expect(formatNumber(47.3, 1)).toBe('47,3')
    expect(formatNumber(6, 1)).toBe('6,0')
    expect(formatNumber(78.94, 2)).toBe('78,94')
  })

  it('arredonda para o número de casas solicitado', () => {
    expect(formatNumber(62.44, 1)).toBe('62,4')
  })
})

describe('interpolateCount', () => {
  it('inicia em zero', () => {
    expect(interpolateCount(100, 0)).toBe(0)
  })

  it('chega exatamente ao alvo no fim da animação', () => {
    expect(interpolateCount(178400, 1)).toBe(178400)
    expect(interpolateCount(6, 1, 1)).toBe(6)
  })

  it('respeita as casas decimais', () => {
    expect(interpolateCount(6, 0.5, 1)).toBe(3)
    expect(interpolateCount(47.3, 0.5, 1)).toBe(23.7)
  })

  it('limita o progresso entre 0 e 1', () => {
    expect(interpolateCount(10, -1)).toBe(0)
    expect(interpolateCount(10, 5)).toBe(10)
  })
})
