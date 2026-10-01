import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";

export default function ContactTeaser() {
  return (
    <section className="home-contact pt-[116px]" aria-labelledby="home-contact-title">
      <h2 className="home-label">[CONTACT US]</h2>
      <div className="home-contact__content">
        <h3 id="home-contact-title" data-testid="text-home-contact-title">
          YOU MADE IT THIS FAR.<br />
          WE SHOULD PROBABLY TALK.
        </h3>
        <p className="mt-[41px]">Send us the brief, the idea or the beginning of one.<br />We’ll take it from there.</p>
        <Link href="/contact" className="home-button home-button--accent mt-[0px] mb-[0px] pt-[0px] pb-[0px]" data-testid="link-home-lets-chat">
          LET’S CHAT <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}