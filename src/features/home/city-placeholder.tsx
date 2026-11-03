// Skyline silhouette: [x, y, width, height]. Every tower stands on the platform at y + height = 300.
const towers = [
  [95, 230, 34, 70],
  [135, 200, 40, 100],
  [180, 160, 44, 140],
  [228, 70, 50, 230],
  [284, 150, 44, 150],
  [334, 195, 40, 105],
  [380, 225, 34, 75],
] as const

/**
 * Stands in for the live 3D city while it loads: a faint, flat skyline on a platform ring that gently pulses.
 * It is plain inline markup (no image to download), part of the prerendered HTML, decorative, and fades out
 * when the 3D scene has drawn its first frame. It never shows where 3D cannot run (the hero column collapses then).
 */
export function CityPlaceholder() {
  return (
    <div aria-hidden="true" className="flex aspect-5/4 items-center justify-center">
      <svg viewBox="0 0 500 400" className="placeholder-pulse h-full w-full">
        <ellipse cx="250" cy="322" rx="224" ry="64" className="fill-none stroke-orange-400/30" strokeWidth="2" />
        <ellipse cx="250" cy="318" rx="214" ry="58" className="fill-white/5 stroke-white/10" strokeWidth="1.5" />
        <ellipse cx="250" cy="308" rx="184" ry="48" className="fill-white/5 stroke-white/10" strokeWidth="1.5" />
        {towers.map(([x, y, width, height]) => (
          <rect key={x} x={x} y={y} width={width} height={height} rx="3" className="fill-white/5 stroke-white/10" strokeWidth="1.5" />
        ))}
        <line x1="253" y1="34" x2="253" y2="70" className="stroke-white/15" strokeWidth="2" />
        <circle cx="253" cy="30" r="5" className="fill-orange-400/40" />
      </svg>
    </div>
  )
}
