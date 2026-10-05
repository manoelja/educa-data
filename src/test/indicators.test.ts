import { describe, it, expect } from 'vitest'
import { analyses, dataSources, heroStats, idebSeries } from '../data/indicators'
import { icons } from '../lib/icons'

describe('heroStats', () => {
  it('expõe exatamente os três indicadores do painel do Hero', () => {
    expect(heroStats.map((stat) => stat.id)).toEqual(['schools', 'enrollments', 'ideb'])
  })

  it('mantém os valores e barras em faixas válidas', () => {
    heroStats.forEach((stat) => {
      expect(stat.value).toBeGreaterThan(0)
      expect(stat.decimals).toBeGreaterThanOrEqual(0)
      expect(stat.bar).toBeGreaterThan(0)
      expect(stat.bar).toBeLessThanOrEqual(100)
    })
  })
})

describe('analyses', () => {
  it('tem seis recortes com ids únicos', () => {
    expect(analyses).toHaveLength(6)
    expect(new Set(analyses.map((item) => item.id)).size).toBe(analyses.length)
  })

  it('usa somente ícones e tendências conhecidos', () => {
    const trends = ['up', 'down', 'flat']
    analyses.forEach((item) => {
      expect(Object.keys(icons)).toContain(item.icon)
      expect(trends).toContain(item.trend)
      expect(item.value).toBeGreaterThan(0)
    })
  })
})

describe('dataSources', () => {
  it('cobre censo, saeb, ibge e stack', () => {
    expect(dataSources.map((source) => source.id)).toEqual(['censo', 'saeb', 'ibge', 'stack'])
  })

  it('aponta para ícones existentes', () => {
    dataSources.forEach((source) => {
      expect(Object.keys(icons)).toContain(source.icon)
    })
  })
})

describe('idebSeries', () => {
  it('está em ordem cronológica com valores plausíveis de IDEB', () => {
    const years = idebSeries.map((point) => point.year)
    expect(years).toEqual([...years].sort((a, b) => a - b))

    idebSeries.forEach((point) => {
      expect(point.value).toBeGreaterThanOrEqual(0)
      expect(point.value).toBeLessThanOrEqual(10)
    })
  })
})
