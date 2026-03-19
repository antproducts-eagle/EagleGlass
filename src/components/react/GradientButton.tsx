import { motion } from "motion/react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  openModal?: boolean;
  className?: string;
}

export default function GradientButton({ children, onClick, openModal, className = "" }: Props) {
  const handleClick = () => {
    if (onClick) onClick();
    if (openModal) window.dispatchEvent(new Event("open-pricing-modal"));
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(50, 96, 255, 0.3)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        bg-gradient-to-b from-[#3260FF] via-[#1740CE] to-[#0025A5]
        text-white font-display text-lg md:text-xl
        px-8 py-4 rounded-lg cursor-pointer
        inline-flex items-center justify-center
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
