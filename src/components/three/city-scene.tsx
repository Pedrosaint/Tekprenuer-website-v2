import './quiet-three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { usePointer } from './use-pointer'

interface SceneProps {
  /** Render loop runs only while true (the host pauses it when scrolled away). */
  active: boolean
  /** Called when the first frame has been drawn. */
  onReady: () => void
}

/* ------------------------------------------------------------------ *
 * Procedural "Tek City": a skyline that grows on load, floats over a
 * metallic platform, reacts to the pointer and rotates with scroll.
 * ------------------------------------------------------------------ */
const PLATFORM_TOP = 0.19
const CITY_RADIUS = 2.45

interface Tower {
  x: number
  z: number
  w: number
  d: number
  h: number
  delay: number
}

const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const buildTowers = (): Tower[] => {
  const rand = mulberry32(2026)
  const towers: Tower[] = [{ x: 0.05, z: 0, w: 0.58, d: 0.58, h: 3.5, delay: 0 }]
  const cell = 0.7
  for (let i = -4; i <= 4; i++) {
    for (let j = -4; j <= 4; j++) {
      const x = i * cell + (rand() - 0.5) * 0.12
      const z = j * cell + (rand() - 0.5) * 0.12
      const dist = Math.hypot(x, z)
      if (dist > CITY_RADIUS || dist < 0.45) continue
      const closeness = 1 - dist / CITY_RADIUS
      const h = 0.3 + rand() * 0.5 + closeness ** 1.3 * (1.1 + rand() * 2.1)
      towers.push({ x, z, w: 0.34 + rand() * 0.18, d: 0.34 + rand() * 0.18, h, delay: dist * 0.22 + rand() * 0.15 })
    }
  }
  return towers
}

const makeWindowTextures = () => {
  const cols = 6
  const rows = 14
  const cell = 12
  const color = document.createElement('canvas')
  const glow = document.createElement('canvas')
  color.width = glow.width = cols * cell
  color.height = glow.height = rows * cell
  const c = color.getContext('2d')
  const g = glow.getContext('2d')
  if (!c || !g) throw new Error('2D canvas unavailable')
  const rand = mulberry32(11)

  c.fillStyle = '#1d33a6'
  c.fillRect(0, 0, color.width, color.height)
  g.fillStyle = '#000'
  g.fillRect(0, 0, glow.width, glow.height)

  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < cols; k++) {
      const lit = rand() > 0.7
      const warm = rand() > 0.45
      const x = k * cell + 4
      const y = r * cell + 4
      c.fillStyle = lit ? (warm ? '#ffe2b8' : '#bcd3ff') : '#0b1860'
      c.fillRect(x, y, cell - 8, cell - 8)
      if (lit) {
        g.fillStyle = warm ? '#ff9a3c' : '#5f8cff'
        g.fillRect(x, y, cell - 8, cell - 8)
      }
    }
  }

  const make = (canvas: HTMLCanvasElement, srgb: boolean) => {
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.anisotropy = 4
    if (srgb) texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }
  return { map: make(color, true), emissive: make(glow, true) }
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))
const easeOutBack = (t: number) => {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function City({ onReady, onCompiled }: Pick<SceneProps, 'onReady'> & { onCompiled: (done: boolean) => void }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)

  // Compile the shader programs in parallel, off the main thread, before the first frame is drawn. Drawing first would
  // link them one by one and block the page; the render loop starts once this settles (a failure just means the old way).
  useEffect(() => {
    let cancelled = false
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) onCompiled(true)
      })
    return () => {
      cancelled = true
    }
  }, [gl, scene, camera, onCompiled])

  const towers = useMemo(() => buildTowers(), [])
  const textures = useMemo(() => makeWindowTextures(), [])

  // One shared material set and one texture for the whole skyline; each tower's own geometry carries
  // UVs scaled to its size, so windows keep their proportions without per-tower textures.
  const materials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({
      map: textures.map,
      emissiveMap: textures.emissive,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.85,
      metalness: 0.1,
      roughness: 0.45,
    })
    const roof = new THREE.MeshStandardMaterial({ color: '#3552d6', metalness: 0.3, roughness: 0.35 })
    return [side, side, roof, roof, side, side]
  }, [textures])

  const geometries = useMemo(
    () =>
      towers.map((tower) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const uv = geometry.getAttribute('uv')
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (tower.w / 0.4), uv.getY(i) * (tower.h / 0.9))
        return geometry
      }),
    [towers],
  )

  const root = useRef<THREE.Group>(null)
  const skyline = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const satellite = useRef<THREE.Mesh>(null)
  const spire = useRef<THREE.Mesh>(null)
  const beacon = useRef<THREE.Mesh>(null)
  const particles = useRef<THREE.Points>(null)
  const pointer = usePointer()
  const smooth = useRef({ x: 0, y: 0 })
  const reported = useRef(false)

  const sparkles = useMemo(() => {
    const rand = mulberry32(5)
    const positions = new Float32Array(90 * 3)
    for (let i = 0; i < 90; i++) {
      const angle = rand() * Math.PI * 2
      const radius = 2.8 + rand() * 0.9
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = rand() * 4.6 - 0.2
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (!reported.current) {
      reported.current = true
      onReady()
    }
    const t = state.clock.elapsedTime
    const group = root.current
    if (!group) return

    smooth.current.x = THREE.MathUtils.damp(smooth.current.x, pointer.current.x, 3, delta)
    smooth.current.y = THREE.MathUtils.damp(smooth.current.y, pointer.current.y, 3, delta)
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.5)

    group.rotation.y = t * 0.14 + smooth.current.x * 0.5 + scroll * 1.2
    group.rotation.x = smooth.current.y * 0.07
    group.position.y = Math.sin(t * 0.9) * 0.08 - scroll * 0.45
    group.scale.setScalar(0.8 + 0.2 * easeOutExpo(clamp01(t / 1.4)))

    skyline.current?.children.forEach((child, i) => {
      const tower = towers[i]
      if (!tower) return
      const k = easeOutBack(clamp01((t - 0.2 - tower.delay) / 1.15))
      const height = Math.max(tower.h * k, 0.0001)
      child.scale.set(tower.w, height, tower.d)
      child.position.y = PLATFORM_TOP + height / 2
    })

    const lead = towers[0]
    if (lead && spire.current && beacon.current) {
      const k = easeOutBack(clamp01((t - 0.2) / 1.15))
      const top = PLATFORM_TOP + lead.h * k
      spire.current.position.y = top + 0.4
      beacon.current.position.y = top + 0.85
      beacon.current.scale.setScalar(1 + Math.sin(t * 3) * 0.18)
    }

    if (ring.current) ring.current.rotation.z = t * 0.3
    if (satellite.current) {
      satellite.current.position.set(Math.cos(t * 0.8) * 3.75, PLATFORM_TOP + 0.05, Math.sin(t * 0.8) * 3.75)
    }
    if (particles.current) particles.current.rotation.y = -t * 0.05

  })

  return (
    <>
      <hemisphereLight args={['#dfe7ff', '#6f82da', 3.1]} />
      <directionalLight position={[4, 7, 4]} intensity={2.4} color="#ffffff" />
      <pointLight position={[-5, 2, 4]} intensity={40} distance={16} color="#fb923c" />
      <pointLight position={[4, 3, -4]} intensity={30} distance={14} color="#5a85f5" />

      <group ref={root}>
        {/* Platform */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[3.35, 3.35, 0.14, 48]} />
          <meshStandardMaterial color="#7488e0" metalness={0.35} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[3.05, 3.05, 0.1, 48]} />
          <meshStandardMaterial color="#6670cc" metalness={0.3} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[2.75, 2.75, 0.06, 48]} />
          <meshStandardMaterial color="#4a5098" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh ref={ring} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.38, 0.028, 8, 96]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
        <mesh ref={satellite}>
          <sphereGeometry args={[0.08, 20, 20]} />
          <meshStandardMaterial color="#fff2e0" emissive="#fdba74" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>

        {/* Skyline */}
        <group ref={skyline}>
          {towers.map((tower, i) => (
            <mesh key={i} position={[tower.x, PLATFORM_TOP, tower.z]} scale={[tower.w, 0.0001, tower.d]} geometry={geometries[i]} material={materials} />
          ))}
        </group>
        <mesh ref={spire} position={[0.05, 4, 0]}>
          <cylinderGeometry args={[0.015, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#cfe0ff" metalness={0.3} roughness={0.3} />
        </mesh>
        <mesh ref={beacon} position={[0.05, 4.4, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#fff2e0" emissive="#fb923c" emissiveIntensity={4} toneMapped={false} />
        </mesh>


        <points ref={particles}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[sparkles, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#fdba74" size={0.045} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
        </points>
      </group>
    </>
  )
}

export default function CityScene({ active, onReady }: SceneProps) {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const [compiled, setCompiled] = useState(false)
  return (
    <Canvas
      frameloop={active && compiled ? 'always' : 'never'}
      dpr={[1, coarse ? 1.25 : 1.75]}
      camera={{ fov: 30, position: [0, 4.4, 12.8], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => camera.lookAt(0, 1.6, 0)}
      resize={{ scroll: false }}
    >
      <City onReady={onReady} onCompiled={setCompiled} />
    </Canvas>
  )
}
