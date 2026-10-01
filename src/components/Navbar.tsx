import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { SUBSTACK_URL } from "@/lib/constants";
import "./navigationDropdown.css";

export default function Navbar({ variant = "default" }: { variant?: "default" | "home" }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const homeMenuRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (variant !== "home" || !mobileOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!homeMenuRef.current?.contains(event.target as Node)) setMobileOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [variant, mobileOpen]);

  const links = [
    { name: "Home", href: "/home" },
    { name: "Work", href: "/work" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  if (variant === "home") {
    const homeLinks = [
      { name: "ABOUT", href: "/home#about", section: "about" },
      { name: "WORK", href: "/work" },
      { name: "SERVICES", href: "/home#services", section: "services" },
      { name: "CONTACT", href: "/contact" },
    ];
    const scrollToSection = (section: string) => {
      window.requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById(section)?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    };

    return (
      <header className="home-header">
        <Link href="/home" className="home-header__mascot" aria-label="Run Frenzy Home" data-testid="link-home-logo">
          <img src={`${import.meta.env.BASE_URL}assets/home/mascot.png`} alt="" />
        </Link>
        <nav className="home-header__nav" aria-label="Home navigation">
          {homeLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => link.section && scrollToSection(link.section)} data-testid={`link-home-nav-${link.name.toLowerCase()}`}>
              {link.name}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="home-header__cta" data-testid="link-home-start-project">
          <span>START A<br />PROJECT</span>
          <ArrowUpRight aria-hidden="true" />
        </Link>
        <div className="home-header__menu" ref={homeMenuRef}>
          <button
            type="button"
            className="home-header__menu-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="home-mobile-navigation"
            data-testid="button-home-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
          {mobileOpen && (
            <nav id="home-mobile-navigation" className="rf-nav-dropdown gap-[0px] mt-[-9px] mb-[-9px] pt-[0px] pb-[0px] justify-start" aria-label="Mobile Home navigation">
              {homeLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setMobileOpen(false);
                    if (link.section) scrollToSection(link.section);
                  }}
                  data-testid={`link-home-mobile-${link.name.toLowerCase()}`}
                  className="mt-[-4px] mb-[-4px]">
                  {link.name[0] + link.name.slice(1).toLowerCase()}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/home" className="flex items-center">
          <span className="block h-11 w-[46px] overflow-hidden md:h-14 md:w-[59px]">
            <img src="/logo.png" alt="Run Frenzy logo" className="block h-11 w-auto max-w-none object-contain md:h-14" />
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${location === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              {link.name}
            </Link>
          ))}
          <a
            href={SUBSTACK_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
          >
            Journal
          </a>
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors gap-1.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Start a project <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                >
                  {link.name}
                </Link>
              ))}
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-medium text-foreground py-2 border-b border-border/50"
              >
                Journal
              </a>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center px-5 py-3 mt-4 bg-primary text-white text-base font-medium rounded-full gap-2"
              >
                Start a project <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
