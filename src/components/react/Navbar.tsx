import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Locale } from "../../i18n/config";

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  links: NavLink[];
  ctaText: string;
  currentLocale: Locale;
  locales: { code: Locale; label: string; path: string }[];
}

export default function Navbar({ links, ctaText, currentLocale, locales }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const currentLabel = locales.find((l) => l.code === currentLocale)?.label || "English";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/images/logo.png" alt="Eagle Glass" className="h-8 lg:h-9" />
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-display font-medium text-sm tracking-tight text-black/70 hover:text-black transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-black/70 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
              >
                <span className="uppercase text-xs font-semibold">{currentLocale}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${langOpen ? "rotate-180" : ""}`}>
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px] overflow-hidden"
                  >
                    {locales.map((locale) => (
                      <a
                        key={locale.code}
                        href={locale.path}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                          locale.code === currentLocale
                            ? "text-[#3260FF] bg-blue-50"
                            : "text-black/70 hover:text-black hover:bg-gray-50"
                        }`}
                        onClick={() => setLangOpen(false)}
                      >
                        <span className="uppercase text-xs font-semibold w-5">{locale.code}</span>
                        <span>{locale.label}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <button
              onClick={() => window.dispatchEvent(new Event("open-pricing-modal"))}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #3260FF 0%, #1740CE 50%, #0025A5 100%)",
              }}
            >
              {ctaText}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center cursor-pointer"
            aria-label="Menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-black origin-center"
            />
            <motion.span
              animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-5 h-[2px] bg-black"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-black origin-center"
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white"
          >
            <div className="pt-20 px-6 flex flex-col h-full">
              <div className="flex flex-col gap-2 flex-1">
                {links.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setIsOpen(false)}
                    className="font-display font-semibold text-3xl tracking-tighter py-3 text-black hover:text-[#3260FF] transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}

                {/* Mobile language switcher */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-black/40 font-medium mb-3">Language</p>
                  <div className="flex flex-wrap gap-2">
                    {locales.map((locale) => (
                      <a
                        key={locale.code}
                        href={locale.path}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                          locale.code === currentLocale
                            ? "bg-[#3260FF] text-white"
                            : "bg-gray-100 text-black/70 hover:bg-gray-200"
                        }`}
                      >
                        {locale.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="pb-8 pt-6">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new Event("open-pricing-modal"));
                  }}
                  className="w-full py-4 rounded-full text-base font-semibold text-white cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #3260FF 0%, #1740CE 50%, #0025A5 100%)",
                  }}
                >
                  {ctaText}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
