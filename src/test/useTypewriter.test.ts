import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTypewriter } from '../hooks/useTypewriter'

// O array precisa ser estável entre renders (o Hero usa useMemo para isso):
// como ele entra nas dependências do efeito, um novo array a cada render
// reiniciaria a digitação.
const WORDS = ['abc'];

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('digita letra por letra até completar a palavra', () => {
    const { result } = renderHook(() => useTypewriter(WORDS, 10, 500))

    expect(result.current).toBe('')

    act(() => {
      vi.advanceTimersByTime(10)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(20)
    })
    expect(result.current).toBe('abc')
  })

  it('apaga a palavra e passa para a próxima depois da pausa', () => {
    const { result } = renderHook(() => useTypewriter(WORDS, 10, 500))

    act(() => {
      vi.advanceTimersByTime(30)
    })
    expect(result.current).toBe('abc')

    // durante a pausa de 500ms a palavra completa continua na tela
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe('abc')

    // primeiro tick de deleção remove uma letra
    act(() => {
      vi.advanceTimersByTime(15)
    })
    expect(result.current).toBe('ab')
  })

  it('percorre a lista em loop', () => {
    const { result } = renderHook(() => useTypewriter(WORDS, 10, 100))

    act(() => {
      vi.advanceTimersByTime(20)
    })
    expect(result.current).toBe('ab')

    // pausa + deleção completa + início da próxima volta
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    // em qualquer ponto do ciclo o texto é um prefixo da palavra atual
    expect('abc'.startsWith(result.current)).toBe(true)
  })

  it('devolve string vazia quando não há palavras', () => {
    const { result } = renderHook(() => useTypewriter([], 10, 100))
    expect(result.current).toBe('')
  })
})
