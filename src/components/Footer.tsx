import { Instagram, Linkedin } from "lucide-react";
import { SiVimeo, SiBehance, SiSubstack } from "react-icons/si";
import { SUBSTACK_URL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
          <img src="/logo.png" alt="Run Frenzy logo" className="h-10 md:h-12 w-auto object-contain" />
          <span className="text-sm text-muted-foreground">Mumbai — Est. 2021</span>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-6 text-muted-foreground">
            <a href="https://www.instagram.com/runfrenzyofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-colors"><SiVimeo className="w-5 h-5" /></a>
            <a href="#" className="hover:text-primary transition-colors"><SiBehance className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/company/run-frenzy/posts/?feedView=all" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={SUBSTACK_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <SiSubstack className="w-5 h-5" />
            </a>
          </div>
          <span className="text-xs text-muted-foreground/50">© 2026 Run Frenzy. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
