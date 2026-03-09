import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div
          key={i}
          className="border-b border-gray-200 last:border-b-0"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between py-6 lg:py-8 text-left cursor-pointer group"
          >
            <span className="font-display font-semibold text-lg md:text-xl lg:text-[24px] leading-[1.15] tracking-tighter pr-8">
              {item.question}
            </span>
            <motion.span
              animate={{ rotate: openIndex === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors text-gray-600"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-6 lg:pb-8 font-display font-medium text-base md:text-lg lg:text-[18px] leading-[1.4] tracking-tighter text-black/60">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
