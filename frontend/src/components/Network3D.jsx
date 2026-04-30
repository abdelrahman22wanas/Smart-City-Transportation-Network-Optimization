import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Stars, Grid } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

function Lighting() {
  return (
    <>
      {/* Ambient fill light */}
      <ambientLight color="#0a1628" intensity={0.3} />

      {/* Cyan key light from above-center */}
      <pointLight
        position={[0, 400, 0]}
        color="#00f5ff"
        intensity={0.8}
        distance={1200}
        castShadow
      />

      {/* Purple accent light from left */}
      <pointLight
        position={[-200, 200, 100]}
        color="#9d00ff"
        intensity={0.4}
        distance={800}
      />

      {/* Blue accent light from right */}
      <pointLight
        position={[200, 200, -100]}
        color="#0066ff"
        intensity={0.4}
        distance={800}
      />
    </>
  );
}

function Environment() {
  return (
    <>
      {/* Distant star field */}
      <Stars radius={600} depth={100} count={3000} factor={4} fade saturation={0.5} />

      {/* Holographic ground grid */}
      <Grid
        args={[1000, 1000]}
        cellSize={20}
        cellThickness={0.3}
        cellColor="#0a1628"
        sectionSize={100}
        sectionThickness={0.8}
        sectionColor="#001a33"
        fadeDistance={800}
        fadeStrength={2}
        fadeFrom={800}
      />
    </>
  );
}

function PostProcessingEffects() {
  return (
    <EffectComposer multisampling={8}>
      {/* Bloom makes all emissive objects glow dramatically */}
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={1.8}
        blendFunction={BlendFunction.SCREEN}
      />

      {/* Subtle chromatic aberration on edges */}
      <ChromaticAberration offset={[0.0005, 0.0005]} blendFunction={BlendFunction.NORMAL} />

      {/* Film grain */}
      <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />

      {/* Vignette darkens the edges */}
      <Vignette darkness={0.6} offset={0.4} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}

export default function Network3D() {
  return (
    <div className="network-3d-container" style={{ width: '100%', height: '100%' }}>
      <Canvas
        gl={{
          antialias: true,
          shadowMap: { enabled: true },
        }}
        style={{ background: '#020408' }}
      >
        {/* Camera setup */}
        <PerspectiveCamera
          makeDefault
          position={[0, 300, 500]}
          fov={60}
          near={1}
          far={5000}
        />

        {/* Lighting */}
        <Lighting />

        {/* Environment (stars, grid) */}
        <Environment />

        {/* Orbit controls for user interaction */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={50}
          maxDistance={1200}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate
          autoRotateSpeed={0.3}
        />

        {/* Post-processing effects */}
        <PostProcessingEffects />

        {/* Placeholder: ready for nodes and edges in next steps */}
      </Canvas>
    </div>
  );
}
