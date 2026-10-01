import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const posts = [
  { tag: "Behind the lens", title: "How we approached the Davidoff Parfums film", date: "Coming soon" },
  { tag: "Process", title: "Our production workflow — from brief to delivery", date: "Coming soon" },
  { tag: "Industry", title: "What great brand content actually looks like in 2025", date: "Coming soon" },
];

export default function Journal() {
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
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">Thoughts & process</p>
            <h1
              className="font-bold tracking-[-0.04em] text-foreground leading-[0.9] mb-16"
              style={{ fontSize: "clamp(56px, 8.5vw, 120px)" }}
            >
              Journal.
            </h1>
          </motion.div>

          <div className="flex flex-col gap-0 mb-24">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 * index }}
                className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-border/50 hover:border-primary transition-colors cursor-pointer gap-4"
              >
                <div>
                  <span className="text-xs font-mono text-primary tracking-wider uppercase mb-2 block">{post.tag}</span>
                  <h3 className="text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors">{post.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground font-mono shrink-0">{post.date}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="border border-border rounded-2xl p-12 bg-card/30 text-center"
          >
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">Articles coming soon</p>
            <p className="text-muted-foreground">We're putting our thoughts into writing. Check back soon.</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
