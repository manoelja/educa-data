import { describe, it, expect, beforeEach } from 'vitest'
import { applySceneIntensityFromUrl } from '../lib/scene/intensity'

const readIntensity = () =>
  document.documentElement.style.getPropertyValue('--scene-intensity')

describe('applySceneIntensityFromUrl', () => {
  beforeEach(() => {
    document.documentElement.style.removeProperty('--scene-intensity')
  })

  it('não mexe em nada quando o parâmetro não existe', () => {
    expect(applySceneIntensityFromUrl('')).toBeNull()
    expect(readIntensity()).toBe('')
  })

  it('aplica o valor informado', () => {
    expect(applySceneIntensityFromUrl('?scene=0.5')).toBe(0.5)
    expect(readIntensity()).toBe('0.5')
  })

  it('aceita 0 para desligar a cena', () => {
    expect(applySceneIntensityFromUrl('?scene=0')).toBe(0)
    expect(readIntensity()).toBe('0')
  })

  it('limita o valor à faixa 0–2', () => {
    expect(applySceneIntensityFromUrl('?scene=9')).toBe(2)
    expect(applySceneIntensityFromUrl('?scene=-3')).toBe(0)
  })

  it('ignora valores inválidos', () => {
    expect(applySceneIntensityFromUrl('?scene=abc')).toBeNull()
    expect(applySceneIntensityFromUrl('?scene=')).toBeNull()
    expect(readIntensity()).toBe('')
  })

  it('convive com outros parâmetros na URL', () => {
    expect(applySceneIntensityFromUrl('?utm=email&scene=0.75&x=1')).toBe(0.75)
  })
})
