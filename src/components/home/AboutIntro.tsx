import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";

export default function AboutIntro() {
  return (
    <section id="about" className="home-about" aria-labelledby="home-about-title">
      <p className="home-label">[ABOUT]</p>
      <h1 id="home-about-title" className="home-about__statement" data-testid="text-home-about-statement">
        <span className="home-copy-line home-accent">RUN FRENZY IS A CREATIVE PRODUCTION HOUSE FOR </span>
        <span className="home-copy-line"><span className="home-accent">IDEAS THAT REFUSE TO SIT STILL. </span>WE WORK ACROSS </span>
        <span className="home-copy-line">CREATIVE DIRECTION, PRODUCTION, MOTION DESIGN, </span>
        <span className="home-copy-line">BRANDING AND EVENT STRATEGY—BRINGING THE </span>
        <span className="home-copy-line">RIGHT PEOPLE AND THE RIGHT THINKING TOGETHER </span>
        <span className="home-copy-line">TO <span className="home-accent">CREATE CONTENT AND EXPERIENCES WORTH </span></span>
        <span className="home-copy-line home-accent">PAYING ATTENTION TO.</span>
      </h1>
      <Link href="/work" className="home-button home-button--dark" data-testid="link-home-our-work">
        OUR WORK <ArrowUpRight aria-hidden="true" />
      </Link>
    </section>
  );
}