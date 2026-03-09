import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  // Listen for custom event from CTA buttons
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("open-pricing-modal", open);
    return () => window.removeEventListener("open-pricing-modal", open);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl p-8 md:p-12 w-full max-w-lg shadow-2xl z-10"
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <h2 className="font-display font-semibold text-3xl tracking-tight mb-2">
              Request Pricing
            </h2>
            <p className="text-gray-500 mb-8">
              Get a custom quote tailored to your business needs.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                close();
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Your name"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3260FF]/20 focus:border-[#3260FF] transition-colors"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3260FF]/20 focus:border-[#3260FF] transition-colors"
              />
              <textarea
                placeholder="Tell us about your store..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3260FF]/20 focus:border-[#3260FF] transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-b from-[#3260FF] via-[#1740CE] to-[#0025A5] text-white font-display text-lg py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-shadow cursor-pointer"
              >
                Send Request
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
