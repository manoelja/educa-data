import { describe, it, expect } from 'vitest'
import {
  pegarAba,
  colunaIndex,
  acharLinha,
  localidades,
  dimensoes,
  valoresDimensao,
  encontrarColuna,
  consultar,
  serieLocalidade,
  serieDimensao,
  type CensoAba,
  type CensoData,
} from '../lib/censo'

const aba: CensoAba = {
  colunas: [
    'localidade',
    'Idade',
    '2022 · Total',
    '2022 · Total · Branca',
    '2022 · Homens · Total',
    '2022 · Homens · Branca',
  ],
  linhas: [
    ['Brasil', 'Total', 93, 95.66, 92.49, 95.48],
    ['Brasil', '15 a 19 anos', 98, 98.5, 97.9, 98.2],
    ['Goiás', 'Total', 94.51, 96.1, 93.8, 95.5],
    ['Goiás', '15 a 19 anos', 99, 99.1, 98.7, 98.9],
  ],
  facetaNomes: ['Ano', 'Sexo', 'Cor ou raça'],
  facetaValores: [['2022'], ['Total', 'Homens'], ['Total', 'Branca']],
  colunasFacetas: [null, null, [0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1]],
}

const data: CensoData = {
  fonte: 'IBGE — teste',
  escopo: 'teste',
  formato: 'colunar',
  resumo: { temas: 1, tabelas: 1, linhas: 4 },
  temas: {
    Alfabetização: {
      tabela9543: { titulo: 'T', variavel: 'V', notas: [], abas: { Tabela: aba } },
    },
  },
}

describe('lib/censo — base', () => {
  it('pega a aba pelo caminho tema/tabela/aba', () => {
    expect(pegarAba(data, 'Alfabetização', 'tabela9543', 'Tabela')).toBe(aba)
    expect(pegarAba(data, 'Alfabetização', 'tabela9543', 'X')).toBeNull()
    expect(pegarAba(data, 'Nada', 'x', 'y')).toBeNull()
  })

  it('acha o índice da coluna', () => {
    expect(colunaIndex(aba, '2022 · Total')).toBe(2)
    expect(colunaIndex(aba, 'nope')).toBe(-1)
  })

  it('encontra a linha por filtros', () => {
    expect(acharLinha(aba, { Idade: 'Total', localidade: 'Goiás' })?.[2]).toBe(94.51)
    expect(acharLinha(aba, { Idade: 'Não existe' })).toBeNull()
    expect(acharLinha(aba, { ColunaInexistente: 'x' })).toBeNull()
  })

  it('lista localidades na ordem de aparição', () => {
    expect(localidades(aba)).toEqual(['Brasil', 'Goiás'])
  })
})

describe('lib/censo — facetas', () => {
  it('descobre dimensões de linha e de coluna (sem Ano)', () => {
    expect(dimensoes(aba)).toEqual([
      { nome: 'Idade', tipo: 'linha' },
      { nome: 'Sexo', tipo: 'coluna' },
      { nome: 'Cor ou raça', tipo: 'coluna' },
    ])
  })

  it('devolve as categorias de uma dimensão', () => {
    expect(valoresDimensao(aba, 'Cor ou raça')).toEqual(['Total', 'Branca'])
    expect(valoresDimensao(aba, 'Idade')).toEqual(['Total', '15 a 19 anos'])
  })

  it('resolve a coluna pela combinação de facetas', () => {
    expect(encontrarColuna(aba, { Sexo: 'Total', 'Cor ou raça': 'Total' })).toBe(2)
    expect(encontrarColuna(aba, { Sexo: 'Total', 'Cor ou raça': 'Branca' })).toBe(3)
    expect(encontrarColuna(aba, { Sexo: 'Homens', 'Cor ou raça': 'Branca' })).toBe(5)
    expect(encontrarColuna(aba, { Sexo: 'Inexistente' })).toBe(-1)
  })

  it('consulta um recorte completo', () => {
    const recorte = {
      localidade: 'Brasil',
      chaves: { Idade: 'Total' },
      facetas: { Sexo: 'Total', 'Cor ou raça': 'Branca' },
    }
    expect(consultar(aba, recorte)).toBe(95.66)
    expect(consultar(aba, { ...recorte, localidade: 'Goiás' })).toBe(96.1)
    expect(consultar(aba, { ...recorte, chaves: { Idade: 'Inexistente' } })).toBeNull()
  })
})

describe('lib/censo — séries', () => {
  it('varia as localidades', () => {
    expect(serieLocalidade(aba, { chaves: { Idade: 'Total' }, facetas: { Sexo: 'Total', 'Cor ou raça': 'Total' } })).toEqual([
      { localidade: 'Brasil', valor: 93 },
      { localidade: 'Goiás', valor: 94.51 },
    ])
  })

  it('varia uma dimensão de linha', () => {
    expect(
      serieDimensao(
        aba,
        { localidade: 'Brasil', chaves: { Idade: 'Total' }, facetas: { Sexo: 'Total', 'Cor ou raça': 'Total' } },
        'Idade',
      ),
    ).toEqual([
      { rotulo: 'Total', valor: 93 },
      { rotulo: '15 a 19 anos', valor: 98 },
    ])
  })

  it('varia uma dimensão de coluna', () => {
    expect(
      serieDimensao(
        aba,
        { localidade: 'Brasil', chaves: { Idade: 'Total' }, facetas: { Sexo: 'Total', 'Cor ou raça': 'Total' } },
        'Cor ou raça',
      ),
    ).toEqual([
      { rotulo: 'Total', valor: 93 },
      { rotulo: 'Branca', valor: 95.66 },
    ])
  })
})
