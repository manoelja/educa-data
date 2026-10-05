import '@testing-library/jest-dom'

// jsdom não implementa IntersectionObserver — os hooks de scroll usam a API.
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
  root = null
  rootMargin = ''
  thresholds = []
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// `prefers-reduced-motion` (o hook useCountUp consulta matchMedia)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// requestAnimationFrame é usado pela animação de contagem
if (typeof window.requestAnimationFrame !== 'function') {
  window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
    setTimeout(() => callback(Date.now()), 16)) as typeof window.requestAnimationFrame
  window.cancelAnimationFrame = ((handle: number) => clearTimeout(handle)) as typeof window.cancelAnimationFrame
}
