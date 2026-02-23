
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SnowFieldProps {
  count?: number;
  isConsoleOpen: boolean;
}

const SnowField: React.FC<SnowFieldProps> = ({ count = 1200, isConsoleOpen }) => {
  const mesh = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);
  
  // Create a persistent store for particle data
  const { positions, velocities, phases, originalZ } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const pha = new Float32Array(count);
    const oZ = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spread them in a wide box
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      oZ[i] = pos[i * 3 + 2];
      vel[i] = 0.005 + Math.random() * 0.01; // Slower default speed for "Softness"
      pha[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, velocities: vel, phases: pha, originalZ: oZ };
  }, [count]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const posAttr = mesh.current.geometry.attributes.position;
    
    // Interactive Targets
    const colorTarget = isConsoleOpen ? new THREE.Color("#60a5fa") : new THREE.Color("#ffffff");
    const opacityTarget = isConsoleOpen ? 0.9 : 0.4;
    const rotSpeed = isConsoleOpen ? 0.8 : 0.05;

    // Smoothly transition material properties
    if (materialRef.current) {
      materialRef.current.color.lerp(colorTarget, 0.05);
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, opacityTarget, 0.05);
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      if (isConsoleOpen) {
        // WARP MODE: Particles fly toward the camera (Z-axis)
        posAttr.array[i3 + 2] += delta * 25; // High speed forward
        
        // Slight radial expansion to create "tunnel" feel
        posAttr.array[i3] *= 1.01;
        posAttr.array[i3 + 1] *= 1.01;

        // Reset if they pass the camera or go too far out
        if (posAttr.array[i3 + 2] > 10 || Math.abs(posAttr.array[i3]) > 25) {
          posAttr.array[i3 + 2] = -15;
          posAttr.array[i3] = (Math.random() - 0.5) * 10;
          posAttr.array[i3 + 1] = (Math.random() - 0.5) * 10;
        }
      } else {
        // SOFT GENTLE MODE: Normal falling
        posAttr.array[i3 + 1] -= velocities[i];
        
        // Gentle horizontal sway
        posAttr.array[i3] += Math.sin(time * 0.3 + phases[i]) * 0.002;

        // Reset if they fall below screen
        if (posAttr.array[i3 + 1] < -10) {
          posAttr.array[i3 + 1] = 10;
          posAttr.array[i3] = (Math.random() - 0.5) * 30;
          posAttr.array[i3 + 2] = (Math.random() - 0.5) * 15;
        }
        
        // Slowly bring Z back to original if coming out of warp
        posAttr.array[i3 + 2] = THREE.MathUtils.lerp(posAttr.array[i3 + 2], originalZ[i], 0.02);
      }

      // Mouse reactivity (always active but subtle)
      posAttr.array[i3] += (state.mouse.x * 0.002);
    }
    
    posAttr.needsUpdate = true;
    mesh.current.rotation.z += delta * rotSpeed * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const ThreeBackground: React.FC<{ isConsoleOpen: boolean }> = ({ isConsoleOpen }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020202]">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <SnowField isConsoleOpen={isConsoleOpen} />
        <ambientLight intensity={1.5} />
      </Canvas>
      {/* Background atmosphere */}
      <div className={`absolute inset-0 transition-all duration-1000 ${isConsoleOpen ? 'bg-blue-900/10 scale-110' : 'bg-transparent scale-100'}`}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]"></div>
    </div>
  );
};

export default ThreeBackground;
