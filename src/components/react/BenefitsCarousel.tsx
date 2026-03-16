import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Card {
  title: string;
  description?: string;
  image: string;
}

interface Props {
  cards: Card[];
}

export default function BenefitsCarousel({ cards }: Props) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setActive((prev) => (prev + dir + cards.length) % cards.length);
    },
    [cards.length],
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => go(1), 4000);
    return () => clearInterval(timer);
  }, [paused, go]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-[32px] lg:rounded-[40px] bg-[#f1f1f1] border border-black/5 aspect-[4/3]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-0"
          >
            <img
              src={cards[active].image}
              alt={cards[active].title}
              className="w-full h-full object-cover"
            />
            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

            {/* Card text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-display font-semibold text-xl md:text-2xl lg:text-[28px] leading-tight tracking-tight text-white">
                {cards[active].title}
              </p>
              {cards[active].description && (
                <p className="mt-2 text-sm md:text-base text-white/70 leading-relaxed max-w-[400px]">
                  {cards[active].description}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        {/* Progress dots */}
        <div className="flex gap-2">
          {cards.map((_, i) => (
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
            className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => go(1)}
            className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
