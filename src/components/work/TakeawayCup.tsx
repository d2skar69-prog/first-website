import { motion } from "framer-motion";

export default function TakeawayCup({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.svg
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      width="16" height="20" viewBox="0 0 16 20" fill="none"
      className={filled ? "text-primary" : "text-white/20"}
    >
      <rect x="1" y="0.5" width="14" height="2.5" rx="1.25" fill="currentColor" />
      <path d="M2.5 3H13.5L12 18.5H4L2.5 3Z" fill="currentColor" />
      <rect x="3.5" y="10" width="9" height="2" rx="0.5"
        fill={filled ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.06)"} />
    </motion.svg>
  );
}
