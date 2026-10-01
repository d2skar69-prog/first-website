import { memo } from "react";
import { motion } from "framer-motion";
import type { WorkProject } from "@/data/workProjects";

// Content renders directly over the bottom gradient — no card, no blur, no border.
// Memoized — only re-renders when the active project changes.

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function InfoPanelImpl({
  project,
  onClose,
}: {
  project: WorkProject;
  onClose: () => void;
}) {
  const fadeUp = (delay: number) => ({
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay, ease: EASE } },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.65, ease: [0.4, 0, 1, 1] } }}
      className="fixed bottom-0 left-0 right-0 z-40 px-6 md:px-10 pb-7 md:pb-9"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <motion.div variants={fadeUp(0.08)} initial="hidden" animate="visible"
        className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-mono tracking-widest text-primary/80 uppercase drop-shadow-sm">
          {project.category}
        </span>
        <h3 className="text-base md:text-lg font-bold tracking-tight text-white leading-tight normal-case drop-shadow-sm">
          {project.title}
        </h3>
      </motion.div>

      {/* Mobile close */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-2 right-4 text-white/30 text-[10px] font-mono tracking-widest uppercase"
      >
        ✕
      </button>
    </motion.div>
  );
}

const InfoPanel = memo(InfoPanelImpl);
export default InfoPanel;
