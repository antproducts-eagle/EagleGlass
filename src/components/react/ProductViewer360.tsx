import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import ErrorBoundary from "./ErrorBoundary";

interface Props {
  modelSrc: string;
}

function Model({ src, onLoaded }: { src: string; onLoaded: () => void }) {
  const { scene } = useGLTF(src);
  const groupRef = useRef<THREE.Group>(null);
  const calledRef = useRef(false);

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

  useEffect(() => {
    if (!calledRef.current) {
      calledRef.current = true;
      onLoaded();
    }
  }, [onLoaded]);

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2 + Math.PI * 0.1, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid #e5e7eb",
          borderTop: "3px solid #111",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ProductViewer360({ modelSrc }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <ErrorBoundary
      fallback={
        <div className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center bg-gray-50">
          <p style={{ color: "#888", fontSize: 14 }}>3D viewer unavailable</p>
        </div>
      }
    >
      <div className="relative w-full aspect-square max-w-[500px] mx-auto">
        {!loaded && <LoadingSpinner />}
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
            <Model src={modelSrc} onLoaded={() => setLoaded(true)} />
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
    </ErrorBoundary>
  );
}

useGLTF.preload("/final.glb");
