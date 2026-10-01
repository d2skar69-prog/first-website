import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AboutIntro from "@/components/home/AboutIntro";
import ClientStrip from "@/components/home/ClientStrip";
import HomeServices from "@/components/home/HomeServices";
import HomeStats from "@/components/home/HomeStats";
import ContactTeaser from "@/components/home/ContactTeaser";
import HomeFooter from "@/components/home/HomeFooter";
import "./RunFrenzy.css";

export default function RunFrenzy() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make sure dark mode is on for this page
    document.documentElement.classList.add("dark");
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    const scrollToSection = (behavior: ScrollBehavior) => {
      const id = window.location.hash.slice(1);
      if (id === "about" || id === "services") {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        document.getElementById(id)?.scrollIntoView({
          behavior: reduceMotion ? "auto" : behavior,
          block: "start",
        });
      }
    };
    const frame = window.requestAnimationFrame(() => scrollToSection("auto"));
    const onHashChange = () => scrollToSection("smooth");
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    // Home keeps its natural document flow; these are boundaries, not sized panels.
    const sceneTwo = document.querySelector<HTMLElement>(".home-scene-two");
    const services = document.querySelector<HTMLElement>(".home-services");
    const stats = document.querySelector<HTMLElement>(".home-stats");
    const contact = document.querySelector<HTMLElement>(".home-contact");
    const sceneThree = document.querySelector<HTMLElement>(".home-scene-three");
    if (!sceneTwo || !services || !stats || !contact || !sceneThree) return;

    const mobile = window.matchMedia("(max-width: 560px)");
    const topOf = (element: HTMLElement) =>
      element.getBoundingClientRect().top + window.scrollY;
    // Keep the Stats bridge reachable even on a viewport taller than the
    // Stats, Contact, and footer combined.
    const originalContactMinHeight = contact.style.minHeight;
    const ensureSceneThreeReachable = () => {
      contact.style.minHeight = originalContactMinHeight;
      if (mobile.matches) return;
      const bridgeTop = topOf(stats) - Math.min(24, window.innerHeight * 0.05);
      const shortage = Math.ceil(
        window.innerHeight -
          (document.documentElement.scrollHeight - bridgeTop),
      );
      if (shortage > 0) {
        contact.style.minHeight = `${contact.offsetHeight + shortage}px`;
      }
    };
    ensureSceneThreeReachable();
    window.addEventListener("resize", ensureSceneThreeReachable);

    const reducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollTo = (top: number) =>
      window.scrollTo({ top, behavior: reducedMotion() ? "auto" : "smooth" });

    const mobileStops = () => [0, topOf(sceneTwo), topOf(sceneThree)];
    const nearestMobileStop = (from: number) => {
      const stops = mobileStops();
      return stops.reduce(
        (closest, stop, index) =>
          Math.abs(stop - from) < Math.abs(stops[closest] - from) ? index : closest,
        0,
      );
    };

    // A tall scene advances at most one viewport per gesture. The first
    // waypoint shows Stats in Scene 2; the final one includes the footer.
    const nextPosition = (direction: number, from = window.scrollY) => {
      if (mobile.matches) {
        const stops = mobileStops();
        const next = Math.max(0, Math.min(stops.length - 1, nearestMobileStop(from) + direction));
        return stops[next];
      }
      const height = window.innerHeight;
      const max = Math.max(0, document.documentElement.scrollHeight - height);
      const servicesTop = topOf(services);
      const contactTop = topOf(contact);
      const aboutLastView = Math.max(0, servicesTop - height);
      const statsView = Math.max(
        servicesTop,
        Math.min(
          topOf(stats) - Math.min(240, height * 0.4),
          contactTop - height,
        ),
      );
      const step = height * 0.8;
      const margin = 28;
      let destination: number;

      if (direction > 0) {
        if (from < servicesTop - margin) {
          destination =
            from < aboutLastView - margin
              ? Math.min(from + step, aboutLastView)
              : servicesTop;
        } else if (from < statsView - margin) {
          destination = Math.min(from + step, statsView);
        } else {
          destination = max; // The single Stats block, Contact, and footer
        }
      } else if (from > statsView + margin) {
        destination = statsView;
      } else if (from > servicesTop + margin) {
        destination = Math.max(servicesTop, from - step);
      } else {
        destination = Math.max(0, from - step);
      }
      return Math.max(0, Math.min(max, destination));
    };

    let wheelTotal = 0;
    let wheelDirection = 0;
    let wheelLocked = false;
    let lastWheelAt = 0;
    let lastStepAt = 0;
    const onWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !event.deltaY ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      event.preventDefault();
      if (event.timeStamp - lastWheelAt > 180) {
        wheelTotal = 0;
        if (event.timeStamp - lastStepAt > (mobile.matches ? 850 : 400)) wheelLocked = false;
      }
      lastWheelAt = event.timeStamp;
      if (wheelLocked) return;

      const direction = Math.sign(event.deltaY);
      if (direction !== wheelDirection) {
        wheelDirection = direction;
        wheelTotal = 0;
      }
      wheelTotal +=
        Math.abs(event.deltaY) *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1);
      if (wheelTotal < 30) return;
      wheelTotal = 0;
      wheelLocked = true;
      lastStepAt = event.timeStamp;
      scrollTo(nextPosition(direction));
    };

    let touch: {
      startX: number;
      startY: number;
      lastY: number;
      startScroll: number;
      target: number | null;
      handling: boolean;
    } | null = null;
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        touch = null;
        return;
      }
      const point = event.touches[0];
      touch = {
        startX: point.clientX,
        startY: point.clientY,
        lastY: point.clientY,
        startScroll: window.scrollY,
        target: null,
        handling: false,
      };
    };
    const onTouchMove = (event: TouchEvent) => {
      const gesture = touch;
      if (!gesture || event.touches.length !== 1) return;
      const point = event.touches[0];
      const vertical = gesture.startY - point.clientY;
      if (!gesture.handling) {
        if (Math.abs(vertical) < 8) return;
        if (Math.abs(point.clientX - gesture.startX) > Math.abs(vertical)) {
          touch = null; // Horizontal swipes never navigate scenes.
          return;
        }
        gesture.target = nextPosition(Math.sign(vertical), gesture.startScroll);
        gesture.handling = true;
      }
      if (!event.cancelable) return;
      event.preventDefault();
      const next = window.scrollY + gesture.lastY - point.clientY;
      gesture.lastY = point.clientY;
      window.scrollTo(
        0,
        Math.max(
          Math.min(gesture.startScroll, gesture.target!),
          Math.min(Math.max(gesture.startScroll, gesture.target!), next),
        ),
      );
    };
    const onTouchEnd = (event: TouchEvent) => {
      const gesture = touch;
      touch = null;
      if (gesture?.handling && gesture.target !== null) {
        const completed = Math.abs(event.changedTouches[0].clientY - gesture.startY) > 35;
        if (completed) {
          scrollTo(gesture.target);
        } else if (mobile.matches) {
          scrollTo(mobileStops()[nearestMobileStop(gesture.startScroll)]);
        }
      }
    };
    const onTouchCancel = () => {
      if (mobile.matches && touch?.handling) {
        scrollTo(mobileStops()[nearestMobileStop(touch.startScroll)]);
      }
      touch = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchCancel);
    return () => {
      window.removeEventListener("resize", ensureSceneThreeReachable);
      contact.style.minHeight = originalContactMinHeight;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [loading]);

  return (
    <div className="home-page">
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

      <Navbar variant="home" />

      <main className={loading ? "home-main home-main--loading" : "home-main"}>
        <div className="home-scene-one">
          <AboutIntro />
          <ClientStrip />
        </div>
        <div className="home-scene-two">
          <HomeServices />
          <HomeStats />
        </div>
        <div className="home-scene-three">
          <ContactTeaser />
          <HomeFooter />
        </div>
      </main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 mb-8"
      >
        <motion.img
          src={`${import.meta.env.BASE_URL}assets/brand/run-frenzy-logo-red.png`}
          alt="Run Frenzy logo"
          className="h-28 w-[min(90vw,420px)] object-cover"
        />
      </motion.div>
      <div className="w-48 h-[2px] bg-secondary overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
