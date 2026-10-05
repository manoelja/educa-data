import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import i18n from '../i18n'
import { DashboardView } from '../components/Dashboard/Dashboard'
import type { CensoData } from '../lib/censo'

const fixture: CensoData = {
  fonte: 'IBGE — Censo Demográfico 2022 (SIDRA)',
  escopo: 'teste',
  formato: 'colunar',
  resumo: { temas: 2, tabelas: 2, linhas: 8 },
  temas: {
    Alfabetização: {
      tabela9543: {
        titulo: 'Tabela 9543',
        variavel: 'Taxa de alfabetização',
        notas: [],
        abas: {
          Tabela: {
            colunas: ['localidade', 'Idade', '2022 · Total', '2022 · Total · Branca', '2022 · Homens · Total'],
            linhas: [
              ['Brasil', 'Total', 93, 95.66, 92.49],
              ['Brasil', '15 a 19 anos', 98, 98.5, 97.9],
              ['Goiás', 'Total', 94.51, 96.1, 93.8],
              ['Edealina (GO)', 'Total', 96.4, 97.2, 95.9],
            ],
            facetaNomes: ['Ano', 'Sexo', 'Cor ou raça'],
            facetaValores: [['2022'], ['Total', 'Homens'], ['Total', 'Branca']],
            colunasFacetas: [null, null, [0, 0, 0], [0, 0, 1], [0, 1, 0]],
          },
        },
      },
    },
    'Cor ou Raça': {
      tabela9605: {
        titulo: 'Tabela 9605',
        variavel: 'População residente',
        notas: [],
        abas: {
          'População residente (Pessoas)': {
            colunas: ['localidade', '2022 · Total', '2022 · Branca'],
            linhas: [
              ['Brasil', 203080756, 88252121],
              ['Goiás', 7064951, 3086923],
            ],
            facetaNomes: ['Ano', 'Cor ou raça'],
            facetaValores: [['2022'], ['Total', 'Branca']],
            colunasFacetas: [null, [0, 0], [0, 1]],
          },
        },
      },
    },
  },
}

const valor = (container: HTMLElement) =>
  container.querySelector('.dash-value-number')?.textContent

/** Abre um dropdown pelo rótulo e escolhe uma opção. */
const escolher = (label: string, opcao: string) => {
  fireEvent.click(screen.getByLabelText(label))
  fireEvent.click(screen.getByRole('option', { name: opcao }))
}

describe('Dashboard — painel interativo', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('pt')
  })

  it('mostra valor, comparativo de localidades e a série do eixo padrão', () => {
    const { container } = render(<DashboardView data={fixture} />)

    expect(screen.getByRole('heading', { name: 'Alfabetização (15+)' })).toBeInTheDocument()
    expect(valor(container)).toBe('93,0')

    const labels = [...container.querySelectorAll('.dash-bar-label')].map((n) => n.textContent)
    expect(labels).toContain('Brasil')
    expect(labels).toContain('Goiás')
    expect(labels).toContain('Edealina (GO)')

    // Série abre na dimensão padrão do indicador (Idade)
    expect(screen.getByText('SÉRIE POR · Idade')).toBeInTheDocument()
    expect(container.querySelectorAll('.dash-chart')).toHaveLength(2)
  })

  it('aplica subfiltros: mudar a idade atualiza valor e série', () => {
    const { container } = render(<DashboardView data={fixture} />)

    escolher('Idade', '15 a 19 anos')

    expect(valor(container)).toBe('98,0')
  })

  it('aplica subfiltros: trocar a cor/raça muda a coluna resolvida', () => {
    const { container } = render(<DashboardView data={fixture} />)

    escolher('Cor ou raça', 'Branca')

    expect(valor(container)).toBe('95,7')
  })

  it('troca o eixo da série', () => {
    render(<DashboardView data={fixture} />)

    escolher('EIXO DO GRÁFICO', 'Sexo')

    expect(screen.getByText('SÉRIE POR · Sexo')).toBeInTheDocument()
  })

  it('troca de indicador e passa a mostrar o novo valor', () => {
    const { container } = render(<DashboardView data={fixture} />)

    fireEvent.click(screen.getByRole('button', { name: 'População residente' }))

    expect(screen.getByRole('heading', { name: 'População residente' })).toBeInTheDocument()
    expect(valor(container)).toBe('203.080.756')
  })

  it('não quebra quando o indicador não tem dados no recorte', () => {
    const { container } = render(<DashboardView data={fixture} />)

    fireEvent.click(screen.getByRole('button', { name: 'Registro de nascimento' }))

    expect(valor(container)).toBe('—')
  })
})
