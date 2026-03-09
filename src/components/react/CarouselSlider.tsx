import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: true,
    },
    [
      AutoScroll({
        speed: 0.8,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 lg:gap-6">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[240px] md:w-[280px] lg:w-[340px] h-[300px] md:h-[340px] lg:h-[400px] rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 flex flex-col justify-end relative overflow-hidden"
              style={{
                backgroundColor: slide.backgroundColor,
                color: slide.textColor === "light" ? "#fff" : "#121212",
              }}
            >
              {/* Inner shadow */}
              <div
                className="absolute inset-0 rounded-[inherit] pointer-events-none"
                style={{ boxShadow: "inset 0px -14px 60px 0px rgba(0,0,0,0.08)" }}
              />

              <div className="relative z-10">
                {slide.stat && (
                  <p className="font-display font-semibold text-5xl md:text-6xl lg:text-[90px] tracking-tighter leading-none mb-3">
                    {slide.stat}
                  </p>
                )}
                <p className="font-display font-semibold text-xl md:text-2xl lg:text-[28px] tracking-tight leading-[1.1]">
                  {slide.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fade gradient on right */}
      <div className="absolute top-0 right-0 w-16 lg:w-28 h-full pointer-events-none" style={{ background: "linear-gradient(to left, rgb(240,240,240) 0%, transparent 100%)" }} />

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
