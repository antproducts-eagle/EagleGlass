import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Slide {
  title: string;
  stat?: string;
  backgroundColor: string;
  textColor: "dark" | "light";
}

interface Props {
  slides: Slide[];
}

export default function CarouselSlider({ slides }: Props) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setActive((prev) => (prev + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => go(1), 4000);
    return () => clearInterval(timer);
  }, [paused, go]);

  const variants = {
    enter: (d: number) => ({ y: d > 0 ? 40 : -40, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d: number) => ({ y: d > 0 ? -40 : 40, opacity: 0 }),
  };

  const slide = slides[active];
  const color = slide.textColor === "light" ? "#fff" : "#121212";

  return (
    <div
      className="flex flex-col flex-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-[28px] lg:rounded-[40px] flex-1 min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute inset-0 flex flex-col justify-end p-6 lg:p-10"
            style={{ backgroundColor: slide.backgroundColor, color }}
          >
            {/* Inner shadow */}
            <div
              className="absolute inset-0 rounded-[inherit] pointer-events-none"
              style={{ boxShadow: "inset 0px -14px 60px 0px rgba(0,0,0,0.08)" }}
            />
            <div className="relative z-10">
              {slide.stat && (
                <p className="font-display font-semibold text-7xl md:text-8xl lg:text-[120px] tracking-tighter leading-none mb-4">
                  {slide.stat}
                </p>
              )}
              <p className="font-display font-semibold text-2xl md:text-3xl lg:text-[38px] tracking-tight leading-[1.1]">
                {slide.title}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-between">
        {/* Progress dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > active ? 1 : -1);
                setActive(i);
              }}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === active ? 32 : 12 }}
            >
              <span className="absolute inset-0 bg-black/15 rounded-full" />
              {i === active && (
                <motion.span
                  className="absolute inset-0 bg-[#FF6200] rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: paused ? 99999 : 4, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => go(-1)}
            className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors duration-200 cursor-pointer"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => go(1)}
            className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors duration-200 cursor-pointer"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
