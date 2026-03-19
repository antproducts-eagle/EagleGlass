import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  modelSrc: string;
}

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  const groupRef = useRef<THREE.Group>(null);

  // Force all materials to fully opaque
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of materials) {
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2 + Math.PI * 0.1, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function ProductViewer360({ modelSrc }: Props) {
  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto">
      <Canvas
        camera={{ position: [0, 0, 1.5], fov: 30 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 2, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <ambientLight intensity={2.5} />
        <directionalLight position={[5, 5, 5]} intensity={3} />
        <directionalLight position={[-3, 3, -3]} intensity={1.5} />

        <Suspense fallback={null}>
          <Model src={modelSrc} />
          <Environment preset="city" resolution={512} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          autoRotate={true}
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
}
