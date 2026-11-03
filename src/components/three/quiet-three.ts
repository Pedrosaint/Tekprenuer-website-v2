/**
 * @react-three/fiber 9.x still constructs THREE.Clock internally, and three.js (r18x) prints a one-time
 * deprecation notice for it. That is upstream's to fix, and the notice is harmless, so drop exactly that
 * message and nothing else. Remove this file when @react-three/fiber moves to THREE.Timer.
 * Imported only by the lazy 3D scenes, so it never runs unless a scene is actually mounted.
 */
const NOTICE = 'THREE.Clock: This module has been deprecated'

const warn = console.warn.bind(console)
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].startsWith(NOTICE)) return
  warn(...args)
}
