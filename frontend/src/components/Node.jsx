import React from 'react';
import { IcosahedronGeometry } from 'three';
import { coordinateToWorld, getNodeRadius, getNodeColor } from '../data/cairoNetwork';

export default function Node({ node }) {
  const pos = coordinateToWorld(node.lat, node.lng);
  const radius = getNodeRadius(node.population);
  const color = getNodeColor(node.type);

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      {/* Core icosahedron */}
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[radius, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Glow ring (torus) */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[radius * 1.6, 0.4, 8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Point light for glow */}
      <pointLight
        color={color}
        intensity={0.6}
        distance={60}
      />
    </group>
  );
}
