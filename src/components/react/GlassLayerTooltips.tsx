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
      {/* Glass layers image */}
      <img
        src={image}
        alt="6-layer reinforced glass technology"
        className="w-full h-auto"
      />

      {/* Hotspot zones */}
      {layers.map((layer) => (
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
          {/* Pulse dot */}
          <div className="relative cursor-pointer">
            <span className="absolute -inset-3 rounded-full bg-[#FF6200]/20 animate-ping" />
            <span className="relative block w-4 h-4 rounded-full bg-[#FF6200] border-2 border-white shadow-lg" />
          </div>

          {/* Tooltip */}
          <AnimatePresence>
            {activeLayer === layer.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-3 w-[260px] md:w-[300px]"
              >
                <div className="bg-white/90 backdrop-blur-md border border-black/10 rounded-2xl p-5 shadow-xl">
                  <p className="font-display font-semibold text-base mb-1">
                    {layer.name}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {layer.description}
                  </p>
                </div>
                {/* Arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white/90 border-r border-b border-black/10 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
