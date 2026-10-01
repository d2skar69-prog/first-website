import { Instagram, Linkedin } from "lucide-react";
import { SiSubstack } from "react-icons/si";
import { SUBSTACK_URL } from "@/lib/constants";

export default function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer__brand">
        <span className="home-footer__logo-frame">
          <img
            src={`${import.meta.env.BASE_URL}assets/brand/run-frenzy-logo-red.png`}
            alt="Run Frenzy"
            className="pl-[13px] pr-[13px] ml-[-2px] mr-[-2px] mt-[5px] mb-[5px]" />
        </span>
        <span className="home-footer__desktop-location">Mumbai — Est. 2023</span>
      </div>
      <div className="home-footer__right">
        <small className="hidden home-footer__mobile-copy ml-[0px] mr-[0px] pl-[0px] pr-[0px] pt-[0px] pb-[0px] text-right text-[7px]">2026 Run Frenzy. All rights reserved.</small>
        <span className="hidden home-footer__mobile-location">Mumbai - Est. 2023</span>
        <nav aria-label="Social links" className="home-footer__social">
          <a href="https://www.instagram.com/runfrenzyofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="link-home-instagram"><Instagram /></a>
          <a href="https://www.linkedin.com/company/run-frenzy/posts/?feedView=all" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-testid="link-home-linkedin"><Linkedin /></a>
          <a href={SUBSTACK_URL} target="_blank" rel="noreferrer" aria-label="Substack" data-testid="link-home-substack"><SiSubstack /></a>
        </nav>
        <small className="home-footer__desktop-copy">2026 Run Frenzy. All rights reserved.</small>
      </div>
    </footer>
  );
}