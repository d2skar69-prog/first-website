import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Animated counter ──────────────────────────────────────────────────────────

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

interface CountUpProps {
  target: number;
  suffix?: string;
  duration?: number; // seconds
  delay?: number;    // seconds stagger
  className?: string;
}

function CountUp({ target, suffix = "", duration = 1.0, delay = 0, className }: CountUpProps) {
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(triggerRef, { once: true, margin: "-60px" });
  const rafRef = useRef<number | null>(null);
  const [display, setDisplay] = useState(reducedMotion ? target : 0);
  const [blurring, setBlurring] = useState(false);

  const runAnimation = useCallback(() => {
    if (reducedMotion) {
      setDisplay(target);
      return;
    }

    setBlurring(true);
    const durationMs = duration * 1000;
    const delayMs = delay * 1000;
    let startTs: number | null = null;

    const tick = (now: number) => {
      if (startTs === null) startTs = now;
      const elapsed = now - startTs;

      if (elapsed < delayMs) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min((elapsed - delayMs) / durationMs, 1);
      // Ease-out quart — fast start, decelerates smoothly to final value
      const eased = 1 - Math.pow(1 - t, 4);
      const current = Math.round(eased * target);
      setDisplay(current);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        setBlurring(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [target, duration, delay, reducedMotion]);

  useEffect(() => {
    if (!inView) return;
    runAnimation();
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, runAnimation]);

  // Subtle motion blur only during fast movement (first 60% of count)
  const progress = target > 0 ? display / target : 1;
  const blurPx = blurring && progress < 0.6 ? 0.8 : 0;

  return (
    <span
      ref={triggerRef}
      className={className}
      style={{
        filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
        transition: blurPx === 0 ? "filter 0.12s ease-out" : undefined,
        display: "inline-block",
        minWidth: "2ch", // prevent layout shift
        tabularNums: true,
      } as React.CSSProperties}
      aria-label={`${target}${suffix}`}
    >
      {display}{suffix}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const STATS: { target: number; suffix: string; label: string; delay: number }[] = [
  { target: 50,   suffix: "+", label: "Brands worked with", delay: 0 },
  { target: 200,  suffix: "+", label: "Projects delivered", delay: 0.08 },
  { target: 2021, suffix: "",  label: "Founded in Mumbai",  delay: 0.16 },
];

export default function About() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <Navbar />

      <main className="pt-40 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">Who we are</p>
            <h1
              className="font-bold tracking-[-0.04em] text-foreground leading-[0.9] mb-16"
              style={{ fontSize: "clamp(56px, 8.5vw, 120px)" }}
            >
              About.
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Run Frenzy is a boutique creative production house based in Mumbai. Since 2021, we've partnered with brands across fashion, entertainment, lifestyle, and sports to create content that moves people.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We sit at the intersection of strategy, storytelling, and production — building work that goes beyond aesthetics to actually mean something.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col gap-8"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="border-b border-border pb-6">
                  <div className="text-4xl font-bold text-primary mb-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    <CountUp
                      target={stat.target}
                      suffix={stat.suffix}
                      duration={1.5}
                      delay={stat.delay}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground font-mono tracking-wider uppercase"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="border border-border rounded-2xl p-12 bg-card/30 text-center"
          >
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">Full story coming soon</p>
            <p className="text-muted-foreground">This page is being built. Check back soon.</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
