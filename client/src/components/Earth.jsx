import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import fragmentShader from '../shaders/earth-fragment.glsl';
import vertexShader from '../shaders/earth-vertex.glsl';

// Import your textures
import EarthDayMap from '../assets/EarthDayMap.jpg';
import EarthBumpMap from '../assets/EarthBumpMap.jpg';
import EarthSpecMap from '../assets/EarthSpecMap.jpg';
import EarthNightMap from '../assets/EarthNightMap.jpg';

const Earth = () => {
  const earthRef = useRef();

  // Load textures
  const [colorMap, bumpMap, specMap, nightMap] = useLoader(TextureLoader, [
    EarthDayMap,
    EarthBumpMap,
    EarthSpecMap,
    EarthNightMap,
  ]);

  // Rotate the Earth slowly
  /* useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  }); */


  const shaderMaterial = useMemo(() => {
    const dayTexture = colorMap;
    const nightTexture = nightMap;

    return new THREE.ShaderMaterial({
            uniforms: {
                dayMap: { value: dayTexture },
                nightMap: { value: nightTexture },
                lightDirection: { value: new THREE.Vector3()
  .subVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-8, 4, 12))
  .normalize() },
            },
            vertexShader,
            fragmentShader,
        });
    }, []);

    if (!shaderMaterial) return null;

  return (
    <mesh ref={earthRef} scale={1} position={[5, 0, 0]}>
        <sphereGeometry args={[4.5, 128, 128]} />
        <primitive object={shaderMaterial} attach="material" />
    </mesh>
    
  );
};

export default Earth;
