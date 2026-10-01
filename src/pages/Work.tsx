import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import WorkHeader from "@/components/WorkHeader";
import Footer from "@/components/Footer";
import WorkSection from "@/components/work/WorkSection";
import InfoPanel from "@/components/work/InfoPanel";
import { workProjects, flattenScenes } from "@/data/workProjects";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const UI_TRANSITION = { duration: 0.5, ease: EASE };

export default function Work() {
  const scenes = useMemo(() => flattenScenes(workProjects), []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [uiVisible, setUiVisible] = useState(true);
  const [navInteractive, setNavInteractive] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [nearTop, setNearTop] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const [nearLeft, setNearLeft] = useState(false);
  const [nearRight, setNearRight] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initial auto-show: panel is visible for 3 s on first load only.
  const [panelAutoVisible, setPanelAutoVisible] = useState(true);
  const [initialDone, setInitialDone] = useState(false);

  const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
  const refCallbacks = useRef<Map<number, (el: HTMLElement | null) => void>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable per-index ref callback so React.memo on WorkSection isn't busted
  // by a freshly-allocated closure every render.
  const getRefCallback = useCallback((i: number) => {
    let cb = refCallbacks.current.get(i);
    if (!cb) {
      cb = (el: HTMLElement | null) => {
        const prev = sectionRefs.current.get(i);
        if (prev && observerRef.current) observerRef.current.unobserve(prev);
        if (el) {
          sectionRefs.current.set(i, el);
          observerRef.current?.observe(el);
        } else {
          sectionRefs.current.delete(i);
        }
      };
      refCallbacks.current.set(i, cb);
    }
    return cb;
  }, []);

  useEffect(() => {
    setIsMobile(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
    document.documentElement.classList.add("dark");
  }, []);

  // 3-second initial auto-show — fires exactly once on mount.
  useEffect(() => {
    const timer = setTimeout(() => {
      setPanelAutoVisible(false);
      setInitialDone(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const goToScene = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, scenes.length - 1));
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: clamped * window.innerHeight, behavior: "smooth" });
  }, [scenes.length]);

  // Desktop inactivity + edge tracking
  const resetInactivity = useCallback(() => {
    setUiVisible(true);
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      setUiVisible(false);
      setNearTop(false); setNearLeft(false); setNearRight(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      resetInactivity();
      const { clientX: x, clientY: y } = e;
      const { innerWidth: w, innerHeight: h } = window;
      setNearTop(y < 80);
      setNearBottom(y > h - 140);
      setNearLeft(x < 100);
      setNearRight(x > w - 100);
    };
    const onLeave = () => setNearBottom(false);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    inactivityRef.current = setTimeout(() => setUiVisible(false), 1000);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
    };
  }, [isMobile, resetInactivity]);

  // Mobile touch reveals the controls; scenes change through vertical scrolling.
  const mobileReveal = useCallback(() => {
    setUiVisible(true);
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => setUiVisible(false), 3000);
  }, []);

  // IntersectionObserver — tracks active scene section.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.sectionIndex);
            setActiveIndex(idx);
            setPanelOpen(false);
          }
        }
      },
      { threshold: [0.6] }
    );
    observerRef.current = observer;
    for (const el of sectionRefs.current.values()) observer.observe(el);
    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  // Render window — only mount the active section and its immediate neighbors.
  const RENDER_WINDOW = 1;
  const isInRenderWindow = useCallback(
    (i: number) => Math.abs(i - activeIndex) <= RENDER_WINDOW,
    [activeIndex]
  );

  // Stable close callback for InfoPanel.
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const activeFlat = scenes[activeIndex];
  const activeProject = activeFlat.project;
  const activeScene = activeFlat.scene;
  const hasVideo = activeScene.layout === "hero-video" || activeScene.layout === "vertical-reel"
    || activeScene.layout === "video-photo" || activeScene.layout === "mixed";

  // Derived UI states
  const showNavbar      = nearTop || uiVisible || menuOpen;
  const showTopBar      = nearTop || uiVisible;
  const showLeft        = !isMobile && nearLeft && activeIndex > 0;
  const showRight       = !isMobile && nearRight && activeIndex < scenes.length - 1;
  // Info handle: only show after initial auto-show has completed, and panel isn't already open.
  const showInfoHandle  = isMobile && uiVisible && !panelOpen && initialDone;
  // Panel: show during initial 3s auto-reveal, then only on bottom hover (desktop) or tap (mobile).
  const showPanel       = panelAutoVisible || (initialDone && ((!isMobile && nearBottom) || (isMobile && panelOpen)));
  // Gradient: always a subtle vignette; deeper when panel is visible.
  const gradientActive  = showPanel;

  useEffect(() => {
    if (showNavbar) setNavInteractive(true);
  }, [showNavbar]);

  return (
    <div
      className="relative bg-background text-foreground selection:bg-primary selection:text-white"
      onTouchStart={isMobile ? mobileReveal : undefined}
    >
      {/* Work-only header; keep the existing fade and pointer-access safeguards. */}
      <motion.div className="relative z-50 max-md:absolute max-md:inset-x-0 max-md:top-0" animate={{ opacity: showNavbar ? 1 : 0 }} transition={UI_TRANSITION}
        onAnimationComplete={() => { if (!showNavbar) setNavInteractive(false); }}
        style={{ pointerEvents: showNavbar || navInteractive ? "auto" : "none" }}>
        <WorkHeader interactive={showNavbar || navInteractive} onOpenChange={setMenuOpen} />
      </motion.div>

      {/* Counter + Mute */}
      <motion.div
        className="fixed top-24 md:top-36 left-6 z-40 flex flex-col items-start gap-2 text-xs font-mono tracking-widest uppercase md:left-10"
        animate={{ opacity: showTopBar ? 1 : 0 }} transition={UI_TRANSITION}
        style={{ pointerEvents: "none" }}
      >
        <span className="text-white/60 drop-shadow-sm mix-blend-difference">
          {String(activeIndex + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
        </span>
        {hasVideo && (
          <button onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="grid h-11 w-11 place-items-center text-white/60 hover:text-white transition-colors drop-shadow-sm mix-blend-difference max-md:text-[#6b6b6b] max-md:hover:text-[#6b6b6b] max-md:mix-blend-normal"
            style={{ pointerEvents: showTopBar ? "auto" : "none" }}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </motion.div>

      {/* Left — Prev scene */}
      <AnimatePresence>
        {showLeft && (
          <motion.button key="prev"
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={UI_TRANSITION}
            onClick={() => goToScene(activeIndex - 1)}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 px-3 py-8 group mix-blend-difference max-md:hidden">
            <ChevronLeft className="w-5 h-5 text-white/50 group-hover:text-white transition-colors drop-shadow-sm" />
            <span className="text-[8px] font-mono tracking-widest text-white/30 group-hover:text-white/60 uppercase drop-shadow-sm"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>PREV</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right — Next scene */}
      <AnimatePresence>
        {showRight && (
          <motion.button key="next"
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
            transition={UI_TRANSITION}
            onClick={() => goToScene(activeIndex + 1)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 px-3 py-8 group mix-blend-difference max-md:hidden">
            <span className="text-[8px] font-mono tracking-widest text-white/30 group-hover:text-white/60 uppercase drop-shadow-sm"
              style={{ writingMode: "vertical-rl" }}>NEXT</span>
            <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors drop-shadow-sm" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile info handle — tap to reveal */}
      <AnimatePresence>
        {showInfoHandle && (
          <motion.button key="info-handle"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            transition={UI_TRANSITION}
            onClick={() => setPanelOpen(true)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 px-4 py-2">
            <div className="w-8 h-[2px] bg-white/30 rounded-full" />
            <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase mt-0.5">Info</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Snap scroll container */}
      <div ref={scrollContainerRef}
        className="h-screen max-md:h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}>

        {scenes.map((flat, i) => {
          const key = `${i}-${flat.project.title}-${flat.sceneIndexInProject}`;
          if (!isInRenderWindow(i)) {
            const isLight = flat.scene.layout !== "hero-video";
            return (
              <section key={key} ref={getRefCallback(i)} data-section-index={i}
                className={`relative h-screen max-md:h-[100dvh] w-full snap-start snap-always ${isLight ? "bg-white" : "bg-black max-md:bg-white"}`}
                style={{ contentVisibility: "auto", containIntrinsicSize: "100vw 100vh" }} />
            );
          }
          return (
            <WorkSection key={key}
              scene={flat.scene} title={flat.project.title} sectionIndex={i}
              isActive={activeIndex === i} isMuted={isMuted} isNext={activeIndex + 1 === i}
              registerRef={getRefCallback(i)} />
          );
        })}

        {/* End screen */}
        <section className="h-screen max-md:h-[100dvh] w-full snap-start flex flex-col items-center justify-center text-center px-6 bg-background">
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">Want to work together?</p>
          <h2 className="font-bold tracking-[-0.04em] text-foreground leading-[0.95] mb-8"
            style={{ fontSize: "clamp(40px, 7vw, 88px)" }}>
            Let's make something.
          </h2>
          <Link href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all duration-300 text-lg mb-16">
            Start a project <ArrowUpRight className="w-5 h-5" />
          </Link>
          <div className="w-full"><Footer /></div>
        </section>
      </div>

      {/* Bottom cinematic gradient — always a subtle vignette, deepens when description is visible.
          pointer-events-none so it never blocks video, scroll, or navigation. */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
        style={{ height: "38vh" }}
        animate={{ opacity: gradientActive ? 1 : 0.28 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.12) 65%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Info panel — keyed by project title so AnimatePresence exits/enters on project change */}
      <AnimatePresence mode="wait">
        {showPanel && (
          <InfoPanel
            key={activeProject.title}
            project={activeProject}
            onClose={closePanel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
