import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import "./navigationDropdown.css";

const links = [
  { label: "Home", href: "/home" },
  { label: "About Us", href: "/home#about" },
  { label: "Services", href: "/home#services" },
  { label: "Work", href: "/work" },
] as const;

export default function ContactHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50" aria-label="Contact header">
      <div className="flex items-start justify-between px-6 pt-5 md:px-10 md:pt-6">
        <Link
          href="/home"
          aria-label="Run Frenzy — Home"
          className="pointer-events-auto relative block h-[56px] w-[162px] md:h-[76px] md:w-[220px]"
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/brand/run-frenzy-logo-red.png`}
            alt="Run Frenzy"
            className="pointer-events-none absolute block h-auto max-w-none"
            style={{ width: "171.64%", left: "-35.23%", top: "-89.75%" }}
          />
        </Link>

        <div
          ref={menuRef}
          className="pointer-events-auto relative"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
          }}
        >
          <button
            ref={triggerRef}
            type="button"
            aria-label={open ? "Close Contact navigation" : "Open Contact navigation"}
            aria-expanded={open}
            aria-controls="contact-header-navigation"
            onClick={() => setOpen((current) => !current)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-none border-0 bg-transparent p-0 text-white shadow-none transition-colors hover:text-white/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e55a36]"
          >
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </button>
          {open && (
            <nav
              id="contact-header-navigation"
              aria-label="Contact navigation"
              className="rf-nav-dropdown"
            >
              {links.map(({ label, href }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}>
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