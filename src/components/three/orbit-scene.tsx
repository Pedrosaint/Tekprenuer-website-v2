import './quiet-three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { usePointer } from './use-pointer'

interface SceneProps {
  active: boolean
  onReady: () => void
}

const RINGS = [
  { radius: 2.3, tilt: [1.2, 0.2, 0], speed: 0.22, color: '#8fb0ff', opacity: 0.7 },
  { radius: 2.9, tilt: [0.5, 0.9, 0.3], speed: -0.16, color: '#fb923c', opacity: 0.85 },
  { radius: 3.6, tilt: [-0.7, 0.3, 1.0], speed: 0.1, color: '#ffffff', opacity: 0.3 },
]

/** Faceted core with orbiting rings and a particle shell: a calm backdrop for the call-to-action band. */
function Orbit({ onReady }: Pick<SceneProps, 'onReady'>) {
  const root = useRef<THREE.Group>(null)
  const core = useRef<THREE.Group>(null)
  const rings = useRef<THREE.Group>(null)
  const pointer = usePointer()
  const smooth = useRef({ x: 0, y: 0 })
  const reported = useRef(false)

  const shell = useMemo(() => {
    const positions = new Float32Array(160 * 3)
    for (let i = 0; i < 160; i++) {
      // Fibonacci sphere keeps the points evenly spread without a random generator.
      const y = 1 - (i / 159) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = i * 2.399963
      const r = 4.2 + (i % 5) * 0.12
      positions[i * 3] = Math.cos(theta) * radius * r
      positions[i * 3 + 1] = y * r
      positions[i * 3 + 2] = Math.sin(theta) * radius * r
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (!reported.current) {
      reported.current = true
      onReady()
    }
    const t = state.clock.elapsedTime
    smooth.current.x = THREE.MathUtils.damp(smooth.current.x, pointer.current.x, 2.5, delta)
    smooth.current.y = THREE.MathUtils.damp(smooth.current.y, pointer.current.y, 2.5, delta)

    if (root.current) {
      root.current.rotation.y = t * 0.12 + smooth.current.x * 0.6
      root.current.rotation.x = smooth.current.y * 0.3
      root.current.scale.setScalar(0.85 + 0.15 * Math.min(1, t / 1.2))
    }
    if (core.current) {
      core.current.rotation.x = t * 0.25
      core.current.rotation.z = t * 0.18
    }
    rings.current?.children.forEach((ring, i) => {
      const config = RINGS[i]
      if (config) ring.rotation.z = t * config.speed
    })
  })

  return (
    <>
      <hemisphereLight args={['#bcd0ff', '#050c2b', 1]} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={30} distance={14} color="#fb923c" />

      <group ref={root}>
        <group ref={core}>
          <mesh>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#2f5ae0" metalness={0.7} roughness={0.25} flatShading />
          </mesh>
          <mesh scale={1.04}>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshBasicMaterial color="#fdba74" wireframe transparent opacity={0.55} />
          </mesh>
        </group>

        <group ref={rings}>
          {RINGS.map((ring) => (
            <group key={ring.radius} rotation={ring.tilt as [number, number, number]}>
              <mesh>
                <torusGeometry args={[ring.radius, 0.016, 12, 160]} />
                <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} />
              </mesh>
            </group>
          ))}
        </group>

        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[shell, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#8fb0ff" size={0.04} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
        </points>
      </group>
    </>
  )
}

export default function OrbitScene({ active, onReady }: SceneProps) {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, coarse ? 1.25 : 1.75]}
      camera={{ fov: 38, position: [0, 0, 10], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      resize={{ scroll: false }}
    >
      <Orbit onReady={onReady} />
    </Canvas>
  )
}
