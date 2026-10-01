import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";
import "./navigationDropdown.css";

const links = [
  { label: "About", href: "/home#about" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/home#services" },
  { label: "Contact", href: "/contact" },
] as const;

type WorkHeaderProps = {
  interactive: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function WorkHeader({ interactive, onOpenChange }: WorkHeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none" aria-label="Work header">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 h-[38vh] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.528) 0%, rgba(0,0,0,0.27) 35%, rgba(0,0,0,0.072) 65%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>
      <div className="flex items-start justify-between px-6 pt-5 md:px-10 md:pt-6">
        <Link
          href="/home"
          aria-label="Run Frenzy — Home"
          data-testid="link-work-logo"
          className="relative block h-[56px] w-[162px] md:h-[76px] md:w-[220px]"
          style={{ pointerEvents: interactive ? "auto" : "none" }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/home/mascot.png`}
            alt="Run Frenzy mascot"
            data-testid="img-work-logo"
            className="block h-[56px] w-[56px] rounded-full object-cover pointer-events-none md:h-[76px] md:w-[76px]"
          />
        </Link>

        <div
          ref={menuRef}
          className="relative"
          style={{ pointerEvents: interactive ? "auto" : "none" }}
        >
          <button
            type="button"
            aria-label={open ? "Close Work navigation" : "Open Work navigation"}
            aria-expanded={open}
            aria-controls="work-header-navigation"
            data-testid="button-work-menu"
            onClick={() => setOpen((current) => !current)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1 text-white transition-colors hover:text-white/75 focus-visible:text-primary focus-visible:outline-none max-md:text-[#6b6b6b] max-md:hover:text-[#6b6b6b] max-md:focus-visible:text-[#6b6b6b]"
          >
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </button>
          {open && (
            <nav
              id="work-header-navigation"
              aria-label="Work navigation"
              className="rf-nav-dropdown rf-nav-dropdown--work gap-[0px] mt-[-9px] mb-[-9px] pt-[0px] pb-[0px] justify-start"
            >
              {links.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  data-testid={`link-work-menu-${label.toLowerCase().replaceAll(" ", "-")}`}
                  onClick={() => setOpen(false)}
                  className="mt-[-4px] mb-[-4px]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}