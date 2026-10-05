import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { render, fireEvent, screen, act } from '@testing-library/react'
import i18n from '../i18n'
import App from '../App'

/** Simula o dedo entrando em `de` e saindo em `para` sobre a seção atual. */
const arrastar = (de: [number, number], para: [number, number]) => {
  const alvo = document.querySelector('#hero') ?? document.body
  act(() => {
    const inicio = new Event('touchstart', { bubbles: true })
    Object.assign(inicio, { touches: [{ clientX: de[0], clientY: de[1] }] })
    alvo.dispatchEvent(inicio)

    const fim = new Event('touchend', { bubbles: true })
    Object.assign(fim, { changedTouches: [{ clientX: para[0], clientY: para[1] }] })
    alvo.dispatchEvent(fim)
  })
}

describe('App — navegação lateral', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('pt')
  })

  beforeEach(() => {
    localStorage.clear()
    // O painel do dashboard baixa o JSON do censo: sem rede no jsdom, deixamos
    // a promessa pendente — só a navegação importa neste teste.
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('clicar em "Role para o lado" navega para a seção About', () => {
    const { container } = render(<App />)

    const indicador = screen.getByRole('link', { name: 'Role para o lado' })
    expect(indicador).toHaveAttribute('href', '#about')

    const trilha = container.querySelector('.app-track') as HTMLElement
    expect(trilha.style.transform).toBe('translateX(-0vw)')

    fireEvent.click(indicador)

    // Painel 2 (about): o track desliza uma tela para a esquerda e a âncora
    // não muda o hash — o clique é interceptado pelo handler do App.
    expect(trilha.style.transform).toBe('translateX(-100vw)')
    expect(window.location.hash).toBe('')
  })

  it('arrasto lateral no toque troca de seção', () => {
    const { container } = render(<App />)
    const trilha = container.querySelector('.app-track') as HTMLElement
    expect(trilha.style.transform).toBe('translateX(-0vw)')

    // Dedo entra em (320, 300) e sai em (80, 310): eixo horizontal domina
    // → próxima seção (about).
    arrastar([320, 300], [80, 310])

    expect(trilha.style.transform).toBe('translateX(-100vw)')
  })

  it('arrasto vertical no toque não troca de seção (é rolagem da sessão)', () => {
    const { container } = render(<App />)
    const trilha = container.querySelector('.app-track') as HTMLElement

    // Dedo entra em (200, 500) e sai em (210, 120): eixo vertical domina →
    // o navegador que rola o conteúdo da seção, o painel fica onde está.
    arrastar([200, 500], [210, 120])

    expect(trilha.style.transform).toBe('translateX(-0vw)')
  })

  it('arrasto curto não troca de seção (abaixo do limiar de 60px)', () => {
    const { container } = render(<App />)
    const trilha = container.querySelector('.app-track') as HTMLElement

    arrastar([200, 300], [170, 305])

    expect(trilha.style.transform).toBe('translateX(-0vw)')
  })
})
