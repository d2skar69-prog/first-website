import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    num: "01",
    title: "Integrated Production",
    body: "From brief to final delivery. We handle creative strategy, production, and execution — across formats, across platforms.",
  },
  {
    num: "02",
    title: "Motion & Visual",
    body: "VFX, animation, motion graphics. Built for every screen — film, social, live experience.",
  },
  {
    num: "03",
    title: "Branding & Digital Design",
    body: "Visual identity and campaign design rooted in strategy. Systems that scale, not just aesthetics that impress.",
  },
];

export default function Services() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <Navbar />

      <main className="pt-40 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">What we do</p>
            <h1
              className="font-bold tracking-[-0.04em] text-foreground leading-[0.9] mb-16"
              style={{ fontSize: "clamp(56px, 8.5vw, 120px)" }}
            >
              Services.
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 mb-24">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group cursor-pointer border-b border-border pb-8 flex flex-col"
              >
                <div className="text-sm font-mono text-muted-foreground mb-4">{service.num}</div>
                <h3 className="text-2xl md:text-3xl font-medium mb-4 min-h-[4.5rem] md:min-h-[6rem]">
                  <span className="relative inline-block">
                    {service.title}
                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                  </span>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 uppercase">{service.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="border border-border rounded-2xl p-12 bg-card/30 text-center"
          >
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">More detail coming soon</p>
            <p className="text-muted-foreground">Full service pages with case studies are being built.</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
