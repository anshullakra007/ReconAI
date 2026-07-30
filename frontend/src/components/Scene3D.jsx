import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleNetwork() {
  const ref = useRef();
  
  const sphere = useMemo(() => {
    // Generate a dense sphere of particles (10,000 points)
    const points = new Float32Array(10000 * 3);
    for (let i = 0; i < 10000; i++) {
      // Create a dense cloud
      const r = 20 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y -= delta * 0.05;
    ref.current.rotation.x -= delta * 0.02;
    
    // Subtle mouse interaction
    const targetX = (state.pointer.x * Math.PI) / 10;
    const targetY = (state.pointer.y * Math.PI) / 10;
    
    ref.current.rotation.y += 0.05 * (targetX - ref.current.rotation.y);
    ref.current.rotation.x += 0.05 * (targetY - ref.current.rotation.x);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#38bdf8"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={['#000000', 5, 25]} />
        <ParticleNetwork />
      </Canvas>
    </div>
  );
}
