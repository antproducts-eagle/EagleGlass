import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import ErrorBoundary from "./ErrorBoundary";

const ROT_X = -2.5;
const ROT_Y = 0;
const ROT_Z = -1.65;
const SCROLL_STRENGTH = 0.3;

function Model({ src, scrollOffset, onLoaded }: { src: string; scrollOffset: number; onLoaded?: () => void }) {
  const { scene } = useGLTF(src);
  const groupRef = useRef<THREE.Group>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!calledRef.current && onLoaded) {
      calledRef.current = true;
      onLoaded();
    }
  }, [onLoaded]);

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

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = ROT_X + scrollOffset * SCROLL_STRENGTH;
    }
  });

  return (
    <group ref={groupRef} rotation={[ROT_X, ROT_Y, ROT_Z]} scale={1.4}>
      <primitive object={scene} />
    </group>
  );
}

export default function CtaProductCanvas() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = 1 - (rect.bottom / (viewportH + rect.height));
      setScrollOffset(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [loaded, setLoaded] = useState(false);

  return (
    <ErrorBoundary>
      <div ref={containerRef} className="relative w-full" style={{ aspectRatio: "16/7" }}>
        {!loaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #e5e7eb",
                borderTop: "3px solid #111",
                borderRadius: "50%",
                animation: "ctaSpin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes ctaSpin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        <Canvas
          camera={{ position: [0, 0, 1.8], fov: 20 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 2,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
          frameloop="always"
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <directionalLight position={[-3, 3, -3]} intensity={1} />

          <Suspense fallback={null}>
            <Model src="/final.glb" scrollOffset={scrollOffset} onLoaded={() => setLoaded(true)} />
            <Environment preset="city" resolution={512} />
          </Suspense>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}

useGLTF.preload("/final.glb");
