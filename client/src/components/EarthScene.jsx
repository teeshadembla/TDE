import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Earth from "./Earth.jsx";

const ZoomingCamera = () => {
  const zoomRef = useRef(5); // Store mutable zoom value without triggering re-renders
  const directionRef = useRef(1); // Store zoom direction

  useFrame((state) => {
    const speed = 0.02;
    zoomRef.current += speed * directionRef.current;

    if (zoomRef.current > 10) directionRef.current = -1;
    if (zoomRef.current < 7.5) directionRef.current = 1;

    state.camera.position.z = zoomRef.current;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};

const EarthScene = () => {
  return (
    <div className="h-screen w-screen relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} onCreated={({ gl, scene }) => {
    gl.setClearColor("black"); // sets the background color of the WebGL canvas
  }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[-8, 4, -12]} intensity={2} color="#ffffff" />
        
        <ZoomingCamera />

        <mesh position={[-8, 4, -12]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial color="#dbeafe" toneMapped={false} />
        </mesh>

        <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade />
        <Earth />
        <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} intensity={3} />
        </EffectComposer>
      </Canvas>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex items-center bg-black/40  justify-center bg-gradient-to-l from-black/70 via-transparent to-transparent pointer-events-none">
        <div className="text-white text-center max-w-3xl px-4 scale-150 ml-0 md:scale-[2] transform">
            <h1 className="font-montserrat text-5xl font-bold p-4 mb-6">
            Our Mission
            </h1>
            <p className="text-2xl font-serif font-semibold">
            Driving Technological Convergence Toward a Human-Centered Digital Economy
            </p>
        </div>
    </div>
    </div>

  );
};

export default EarthScene;
