import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import i18n from '../i18n'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Sources from '../components/Sources/Sources'
import Analyses from '../components/Analyses/Analyses'
import Footer from '../components/Footer/Footer'
import EducationBackground from '../components/EducationBackground/EducationBackground'
import { analyses, dataSources } from '../data/indicators'

describe('landing — seções', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('pt')
  })

  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza a navbar com logo, links e os controles de tema/idioma', () => {
    render(<Navbar />)

    expect(screen.getAllByText('Educa').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Início' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Análises' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: 'Idioma' }).length).toBeGreaterThan(0)
    // Alterna os dois acabamentos do quadro: verde (claro) e ardósia (escuro)
    expect(screen.getAllByRole('button', { name: 'Alternar tema' }).length).toBeGreaterThan(0)
  })

  it('renderiza o hero com badge, título e os CTAs — sem painel de indicadores', () => {
    const { container } = render(<Hero />)

    expect(screen.getByText('DADOS PÚBLICOS ATIVOS')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explorar indicadores' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver metodologia' })).toBeInTheDocument()

    // O painel de indicadores saiu do início: sobra só o bloco de texto
    expect(container.querySelector('.system-status')).toBeNull()
    expect(container.querySelector('.status-item')).toBeNull()
    expect(container.querySelector('.hero-text')).not.toBeNull()
  })

  it('renderiza a seção sobre com dois cards e checklist', () => {
    const { container } = render(<About />)

    expect(screen.getByText('Dados educacionais que viram decisão')).toBeInTheDocument()
    expect(container.querySelectorAll('.about-card')).toHaveLength(2)
    expect(container.querySelectorAll('.about-checklist li')).toHaveLength(3)
  })

  it('renderiza todas as fontes de dados com título localizado', () => {
    const { container } = render(<Sources />)

    expect(container.querySelectorAll('.source-card')).toHaveLength(dataSources.length)
    expect(screen.getByText('Censo Escolar')).toBeInTheDocument()
    expect(screen.getByText('SAEB e IDEB')).toBeInTheDocument()
  })

  it('renderiza os seis cards de análise com métrica', () => {
    const { container } = render(<Analyses />)

    expect(container.querySelectorAll('.analysis-card')).toHaveLength(analyses.length)
    expect(screen.getByText('Alfabetização (15+)')).toBeInTheDocument()
    expect(screen.getByText('Registro de nascimento')).toBeInTheDocument()
    expect(container.querySelectorAll('.analysis-metric')).toHaveLength(analyses.length)
  })

  it('renderiza o rodapé com fontes oficiais e contato', () => {
    const { container } = render(<Footer />)

    expect(screen.getByText('Landing page do projeto de análise de dados abertos da educação básica brasileira. Feito para tornar indicadores educacionais públicos acessíveis a quem decide e a quem pesquisa.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contato@educadata\.org\.br/ })).toBeInTheDocument()
    expect(container.querySelectorAll('.footer-list')).toHaveLength(2)
  })
})

describe('cena de fundo', () => {
  it('monta o quadro negro, a poeira de giz e as camadas de acabamento', () => {
    const { container } = render(<EducationBackground />)

    expect(container.querySelector('.blackboard')).not.toBeNull()
    expect(container.querySelector('.board-surface')).not.toBeNull()
    expect(container.querySelector('.chalk-dust')).not.toBeNull()
    expect(container.querySelector('.scene-scrim')).not.toBeNull()
    expect(container.querySelector('.scene-grain')).not.toBeNull()

    // A sala com câmera saiu de cena
    expect(container.querySelector('.classroom')).toBeNull()
    expect(container.querySelector('.scene-room')).toBeNull()
  })

  it('mantém a cena fora da árvore de acessibilidade', () => {
    const { container } = render(<EducationBackground />)
    expect(container.querySelector('.scene')).toHaveAttribute('aria-hidden', 'true')
  })

  it('não renderiza nenhum texto na cena (ambiente, não diagrama)', () => {
    const { container } = render(<EducationBackground />)
    expect(container.querySelectorAll('text')).toHaveLength(0)
  })
})

describe('landing — i18n', () => {
  it('traduz os títulos das seções ao trocar de idioma', async () => {
    await i18n.changeLanguage('en')
    render(<About />)
    expect(screen.getByText('Education data that turns into decisions')).toBeInTheDocument()

    await i18n.changeLanguage('es')
    render(<Sources />)
    expect(screen.getByText('De dónde vienen los datos')).toBeInTheDocument()

    await i18n.changeLanguage('pt')
  })
})
