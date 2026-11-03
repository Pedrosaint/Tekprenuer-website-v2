import type { CSSProperties } from 'react'

type RingStyle = CSSProperties & { '--tilt': string }

const rings: { size: string; tilt: string; duration: string; color: string }[] = [
  { size: '58%', tilt: '72deg', duration: '20s', color: 'border-royal-300/60' },
  { size: '78%', tilt: '56deg', duration: '28s', color: 'border-orange-400/70' },
  { size: '96%', tilt: '82deg', duration: '38s', color: 'border-white/25' },
]

/**
 * CSS-only 3D stand-in for the WebGL orbit scene: a flat core and three tumbling rings.
 * Shown whenever WebGL is unavailable or skipped, and until the real scene has drawn its first frame.
 */
export function OrbitFallback() {
  return (
    <div aria-hidden="true" className="perspective-distant relative flex h-full w-full items-center justify-center">
      <div className="absolute size-1/4 animate-float rounded-xl bg-royal-600" />
      {rings.map((ring) => {
        const style: RingStyle = { width: ring.size, '--tilt': ring.tilt, animation: `ring-tumble ${ring.duration} linear infinite` }
        return <div key={ring.size} style={style} className={`absolute aspect-square transform-3d rounded-full border-2 ${ring.color}`} />
      })}
    </div>
  )
}
