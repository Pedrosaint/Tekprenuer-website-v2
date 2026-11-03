import { useEffect, useState } from 'react'

/**
 * Decides whether the live 3D scenes should run. Everything else on the site works without them
 * (the home hero simply gives its space back to the text).
 *
 * 3D is skipped when: the visitor prefers reduced motion, has Data Saver on, has very little memory,
 * has no WebGL, or WebGL is software-rendered (SwiftShader / llvmpipe), which would be slow for anyone.
 * Developers can append ?3d=force or ?3d=off to the URL to override the checks.
 */
interface NavigatorHints extends Navigator {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

let cached: boolean | undefined

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|microsoft basic render/i

const detect = (): boolean => {
  const override = new URLSearchParams(window.location.search).get('3d')
  if (override === 'off') return false
  if (override === 'force') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false

  const nav = navigator as NavigatorHints
  if (nav.connection?.saveData) return false
  if ((nav.deviceMemory ?? 8) < 2) return false

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return false
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return !SOFTWARE_RENDERER.test(renderer)
  } catch {
    return false
  }
}

export const canRender3D = (): boolean => {
  if (typeof window === 'undefined') return false
  cached ??= detect()
  return cached
}

/** Gives hydration and the first interactions a head start before the scene's heavy first frame. */
const SETTLE_MS = 2000

/**
 * True shortly after the page has loaded and the browser is idle, so the 3D scene never competes with first
 * paint, the LCP element or hydration. The scene then fades in on its own once its first frame has drawn.
 * No interaction is needed.
 */
export function useAfterIdle(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let idleId: number | undefined
    let timeoutId: number | undefined
    const start = () => {
      timeoutId = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1000 })
        else setReady(true)
      }, SETTLE_MS)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])

  return ready
}
