// _components/WebGLBackground.jsx
'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingMeshSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.12;
      meshRef.current.rotation.y = t * 0.18;
      // Gentle floating oscillation
      meshRef.current.position.y = Math.sin(t * 0.6) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[2.5, 0, -2]}>
      {/* 3D Wireframe Icosahedron */}
      <icosahedronGeometry args={[2.4, 2]} />
      <meshStandardMaterial
        wireframe
        color="#38BDF8"       /* Light blue / Cyan accent */
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

function AmbientParticles({ count = 60 }) {
  const pointsRef = useRef();
  
  const [positions] = React.useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 12;     // x
      pos[i + 1] = (Math.random() - 0.5) * 8;  // y
      pos[i + 2] = (Math.random() - 0.5) * 6;  // z
    }
    return pos;
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#0284C7"       /* Primary Sky-Blue */
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function WebGLBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#E0F2FE" />
        <FloatingMeshSphere />
        <AmbientParticles />
      </Canvas>
    </div>
  );
}