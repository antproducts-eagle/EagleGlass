import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  lang?: string;
  turnstileSiteKey?: string;
  modalTexts?: {
    title?: string;
    description?: string;
    namePlaceholder?: string;
    emailPlaceholder?: string;
    messagePlaceholder?: string;
    submitText?: string;
  };
}

export default function PopupModal({ lang = "en", turnstileSiteKey, modalTexts }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileTokenRef = useRef<string>("");

  const texts = {
    title: modalTexts?.title || "Request Pricing",
    description: modalTexts?.description || "Get a custom quote tailored to your business needs.",
    namePlaceholder: modalTexts?.namePlaceholder || "Your name",
    emailPlaceholder: modalTexts?.emailPlaceholder || "Email address",
    messagePlaceholder: modalTexts?.messagePlaceholder || "Tell us about your store...",
    submitText: modalTexts?.submitText || "Send Request",
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setStatus("idle");
    setErrorMsg("");
  }, []);

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

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("open-pricing-modal", open);
    return () => window.removeEventListener("open-pricing-modal", open);
  }, []);

  // Render Turnstile widget when modal opens
  useEffect(() => {
    if (!isOpen || !turnstileSiteKey || !turnstileRef.current) return;

    const w = window as any;
    const renderWidget = () => {
      if (!turnstileRef.current) return;
      turnstileRef.current.innerHTML = "";
      w.turnstile?.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token: string) => {
          turnstileTokenRef.current = token;
        },
        theme: "light",
        size: "flexible",
      });
    };

    if (w.turnstile) {
      renderWidget();
    } else {
      // Load Turnstile script if not yet loaded
      if (!document.querySelector('script[src*="turnstile"]')) {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.onload = renderWidget;
        document.head.appendChild(script);
      }
    }
  }, [isOpen, turnstileSiteKey]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"), // honeypot
          turnstileToken: turnstileTokenRef.current || undefined,
        }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error, please try again");
      setStatus("error");
    }
  };

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

            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="font-display font-semibold text-2xl tracking-tight mb-2">
                  {lang === "de" ? "Anfrage gesendet!" : lang === "fr" ? "Demande envoyée !" : lang === "nl" ? "Aanvraag verzonden!" : "Request Sent!"}
                </h2>
                <p className="text-gray-500">
                  {lang === "de" ? "Wir melden uns bald bei Ihnen." : lang === "fr" ? "Nous vous répondrons bientôt." : lang === "nl" ? "We nemen snel contact met u op." : "We'll get back to you soon."}
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display font-semibold text-3xl tracking-tight mb-2">
                  {texts.title}
                </h2>
                <p className="text-gray-500 mb-8">
                  {texts.description}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder={texts.namePlaceholder}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3260FF]/20 focus:border-[#3260FF] transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={texts.emailPlaceholder}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3260FF]/20 focus:border-[#3260FF] transition-colors"
                  />
                  <textarea
                    name="message"
                    placeholder={texts.messagePlaceholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3260FF]/20 focus:border-[#3260FF] transition-colors resize-none"
                  />

                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
                  />

                  {/* Cloudflare Turnstile */}
                  {turnstileSiteKey && <div ref={turnstileRef} className="mt-1" />}

                  {errorMsg && (
                    <p className="text-red-500 text-sm">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-[#3260FF] hover:bg-[#2850DD] disabled:opacity-60 text-white font-display text-lg py-4 rounded-xl transition-colors cursor-pointer"
                  >
                    {status === "sending" ? "..." : texts.submitText}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
