import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTheme } from '../hooks/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark-theme', 'no-theme-transition')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark-theme', 'no-theme-transition')
  })

  it('começa no quadro verde (sem a classe dark-theme)', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.isLight).toBe(true)
    expect(document.documentElement.classList.contains('dark-theme')).toBe(false)
  })

  it('alterna para a ardósia escura e persiste a escolha', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.toggleTheme())

    expect(result.current.isLight).toBe(false)
    expect(document.documentElement.classList.contains('dark-theme')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('volta ao verde e persiste', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.toggleTheme())
    act(() => result.current.toggleTheme())

    expect(result.current.isLight).toBe(true)
    expect(document.documentElement.classList.contains('dark-theme')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('parte do tema que o script anti-flash já aplicou no <html>', () => {
    document.documentElement.classList.add('dark-theme')

    const { result } = renderHook(() => useTheme())

    expect(result.current.isLight).toBe(false)
  })
})
