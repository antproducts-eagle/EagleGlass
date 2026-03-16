import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Layer {
  id: string;
  name: string;
  description: string;
  position: { top: string; left: string };
}

interface Props {
  layers: Layer[];
  image: string;
}

export default function GlassLayerTooltips({ layers, image }: Props) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[600px] lg:max-w-none">
      <img
        src={image}
        alt="6-layer reinforced glass technology"
        className="w-full h-auto"
      />

      {layers.map((layer, index) => {
        const isRight = index % 2 === 1;

        return (
          <div
            key={layer.id}
            className="absolute"
            style={{ top: layer.position.top, left: layer.position.left }}
            onMouseEnter={() => setActiveLayer(layer.id)}
            onMouseLeave={() => setActiveLayer(null)}
            onClick={() =>
              setActiveLayer(activeLayer === layer.id ? null : layer.id)
            }
          >
            {/* Dot */}
            <div className="relative cursor-pointer group">
              <span className="absolute -inset-3 rounded-full bg-white/20 animate-ping" />
              <span className="absolute -inset-2 rounded-full bg-white/10" />
              <span className="relative block w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)] border border-white/80" />
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {activeLayer === layer.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 8 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  className={`absolute z-20 bottom-full mb-4 w-[220px] md:w-[260px] ${
                    isRight ? "left-0 -translate-x-1/4" : "right-0 translate-x-1/4"
                  }`}
                >
                  <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    {/* Layer number */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6200] text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="font-display font-semibold text-sm text-white leading-tight">
                        {layer.name}
                      </p>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed pl-[34px]">
                      {layer.description}
                    </p>
                    {/* Orange accent line */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#FF6200]/50 to-transparent" />
                  </div>

                  {/* Arrow */}
                  <div
                    className={`absolute -bottom-1.5 w-3 h-3 bg-black/80 border-r border-b border-white/10 rotate-45 ${
                      isRight ? "left-6" : "right-6"
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
