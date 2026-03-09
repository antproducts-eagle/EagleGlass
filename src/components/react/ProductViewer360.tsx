import { useEffect, useRef } from "react";

interface Props {
  modelSrc: string;
  image?: string;
}

// Declare model-viewer as a valid JSX element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean | string;
          "auto-rotate-delay"?: string;
          "rotation-per-second"?: string;
          "camera-controls"?: boolean | string;
          "touch-action"?: string;
          "interaction-prompt"?: string;
          "shadow-intensity"?: string;
          "shadow-softness"?: string;
          "camera-orbit"?: string;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "field-of-view"?: string;
          "environment-image"?: string;
          exposure?: string;
          poster?: string;
          loading?: string;
          reveal?: string;
        },
        HTMLElement
      >;
    }
  }
}

export default function ProductViewer360({ modelSrc, image }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      // Force all materials to OPAQUE to fix alpha transparency issues
      const model = (viewer as any).model;
      if (model) {
        for (const material of model.materials) {
          material.setAlphaMode("OPAQUE");
        }
      }
    };

    viewer.addEventListener("load", handleLoad);
    return () => viewer.removeEventListener("load", handleLoad);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[500px] mx-auto">
      <model-viewer
        ref={viewerRef as any}
        src={modelSrc}
        alt="Eagle Glass packaging"
        auto-rotate=""
        auto-rotate-delay="0"
        rotation-per-second="30deg"
        camera-controls=""
        touch-action="pan-y"
        interaction-prompt="auto"
        shadow-intensity="0.4"
        shadow-softness="1"
        camera-orbit="45deg 75deg 105%"
        min-camera-orbit="auto auto 80%"
        max-camera-orbit="auto auto 200%"
        field-of-view="30deg"
        exposure="1"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          outline: "none",
        }}
      />
    </div>
  );
}
