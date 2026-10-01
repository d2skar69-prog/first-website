import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const stats = [
  { number: "30+", label: "BRANDS WORKED WITH" },
  { number: "150+", label: "PROJECTS DELIVERED" },
  { number: "200+", label: "MINUTES OF CONTENT" },
  { number: "2023", label: "FOUNDED IN MUMBAI" },
] as const;

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

function useMobileHome(): boolean {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 560px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const handler = (event: MediaQueryListEvent) => setMobile(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

function CountUp({
  target, suffix, delay, mobile, sceneVisible,
}: {
  target: number; suffix: string; delay: number; mobile: boolean; sceneVisible: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(triggerRef, { once: true, margin: "-60px" });
  const rafRef = useRef<number | null>(null);
  const mobileStarted = useRef(false);
  const [display, setDisplay] = useState(reducedMotion ? target : 0);
  const [blurring, setBlurring] = useState(false);

  const runAnimation = useCallback(() => {
    if (reducedMotion) {
      setDisplay(target);
      return;
    }

    setBlurring(true);
    const durationMs = 1.5 * 1000;
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
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(eased * target));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        setBlurring(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [target, delay, reducedMotion]);

  useEffect(() => {
    if (mobile) {
      if (reducedMotion) {
        mobileStarted.current = true;
        setDisplay(target);
        setBlurring(false);
        return;
      }
      if (!sceneVisible || mobileStarted.current) return;
      mobileStarted.current = true;
    } else if (!inView) {
      return;
    }
    runAnimation();
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [mobile, sceneVisible, inView, reducedMotion, target, runAnimation]);

  const progress = target > 0 ? display / target : 1;
  const blurPx = blurring && progress < 0.6 ? 0.8 : 0;

  return (
    <span
      ref={mobile ? undefined : triggerRef}
      style={{
        filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
        transition: blurPx === 0 ? "filter 0.12s ease-out" : undefined,
        display: "inline-block",
        minWidth: "2ch",
        tabularNums: true,
      } as React.CSSProperties}
      aria-label={`${target}${suffix}`}
    >
      {display}{suffix}
    </span>
  );
}

export default function HomeStats() {
  const mobile = useMobileHome();
  const [sceneVisible, setSceneVisible] = useState(false);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobile || sceneVisible) return;
    const scene = statsRef.current?.closest(".home-scene-two");
    if (!scene) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.5) {
        setSceneVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(scene);
    return () => observer.disconnect();
  }, [mobile, sceneVisible]);

  return (
    <section ref={statsRef} className="home-stats" aria-label="Run Frenzy in numbers">
      <dl className="home-stats__grid">
        {stats.map(({ number, label }, index) => (
          <div className="home-stat" key={number}>
            <dt data-testid={`text-home-stat-${number.replace("+", "plus")}`}>
              <CountUp target={parseInt(number, 10)} suffix={number.endsWith("+") ? "+" : ""} delay={index * 0.08} mobile={mobile} sceneVisible={sceneVisible} />
            </dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}