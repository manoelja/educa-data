import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Blackboard from '../components/EducationBackground/Blackboard'
import Frame from '../components/EducationBackground/Frame'
import ChalkDust from '../components/EducationBackground/ChalkDust'
import ChalkDecor from '../components/Common/ChalkDecor'
import DrawnChart from '../components/Common/DrawnChart'
import { analyses, idebSeries } from '../data/indicators'
import { CHALK_ACCENTS } from '../lib/scene/chalk'

describe('Blackboard', () => {
  it('monta a superfície de ardósia com as marcas apagadas', () => {
    const { container } = render(<Blackboard />)

    expect(container.querySelector('.blackboard')).not.toBeNull()
    expect(container.querySelector('.board-surface')).not.toBeNull()
    expect(container.querySelector('.board-ghosts')).not.toBeNull()
    expect(container.querySelectorAll('.board-ghost').length).toBeGreaterThan(8)
    expect(container.querySelector('.board-sheen')).not.toBeNull()
    expect(container.querySelector('.board-vignette')).not.toBeNull()
  })

  it('fica fora da árvore de acessibilidade e não usa texto', () => {
    const { container } = render(<Blackboard />)

    expect(container.querySelector('.board-ghosts')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('text')).toHaveLength(0)
  })
})

describe('Frame', () => {
  it('envolve o quadro com a moldura: 4 barras e 4 cantos em meia-esquadria', () => {
    const { container } = render(<Frame />)

    expect(container.querySelector('.board-frame-overlay')).not.toBeNull()
    expect(container.querySelectorAll('.bo-frame')).toHaveLength(4)
    expect(container.querySelectorAll('.bo-frame-corner')).toHaveLength(4)
    expect(container.querySelector('.board-frame-overlay')).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('ChalkDecor', () => {
  it('desenha cada traço em duas passadas: pó de giz e traço firme', () => {
    const { container } = render(<ChalkDecor accent="bars" color={1} />)

    expect(container.querySelectorAll('.chalk-decor__stroke')).toHaveLength(
      CHALK_ACCENTS.bars.length * 2
    )
    expect(container.querySelectorAll('.chalk-decor__stroke--dust')).toHaveLength(
      CHALK_ACCENTS.bars.length
    )
  })

  it('pinta o traço com a cor de giz pedida e fica fora da árvore semântica', () => {
    const { container } = render(<ChalkDecor accent="wave" color={2} />)
    const svg = container.querySelector('.chalk-decor') as SVGElement

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg.style.color).not.toBe('')
  })

  it('aceita um modificador de posição', () => {
    const { container } = render(<ChalkDecor accent="ticks" className="chalk-decor--left" />)
    expect(container.querySelector('.chalk-decor--left')).not.toBeNull()
  })
})

describe('ChalkDust', () => {
  it('renderiza o canvas decorativo de poeira', () => {
    const { container } = render(<ChalkDust />)

    const canvas = container.querySelector('canvas.chalk-dust')
    expect(canvas).not.toBeNull()
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('DrawnChart', () => {
  it('desenha a linha com um ponto por valor', () => {
    const { container } = render(
      <DrawnChart variant="line" values={idebSeries.map((point) => point.value)} />
    )

    expect(container.querySelectorAll('.dc-line')).toHaveLength(1)
    expect(container.querySelectorAll('.dc-dot')).toHaveLength(idebSeries.length)
  })

  it('desenha uma barra por indicador', () => {
    const { container } = render(
      <DrawnChart variant="bars" values={analyses.map((item) => item.value)} />
    )

    expect(container.querySelectorAll('.dc-bar')).toHaveLength(analyses.length)
  })

  it('desenha o donut com trilha e arco', () => {
    const { container } = render(<DrawnChart variant="donut" percent={78.9} />)

    expect(container.querySelectorAll('.dc-track')).toHaveLength(1)
    expect(container.querySelectorAll('.dc-arc')).toHaveLength(1)
  })

  it('fica fora da árvore semântica', () => {
    const { container } = render(<DrawnChart variant="donut" percent={50} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
