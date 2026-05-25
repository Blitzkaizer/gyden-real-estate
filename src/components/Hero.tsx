import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import heroBg from "../assets/images/hero_bg.png";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="hero" ref={ref} style={{
      position: "relative", minHeight: "100vh", display: "flex",
      alignItems: "center", overflow: "hidden", background: "var(--bg)"
    }}>
      {/* Parallax Background */}
      <motion.div style={{
        position: "absolute", inset: "-20%", y: bgY,
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        zIndex: 0,
      }} />

      {/* Dark gradient overlays */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to right, rgba(8,8,8,0.92) 40%, rgba(8,8,8,0.55) 100%)"
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", zIndex: 1,
        background: "linear-gradient(to top, var(--bg), transparent)"
      }} />

      {/* Content */}
      <motion.div 
        style={{ opacity, position: "relative", zIndex: 2, width: "100%", paddingTop: "7rem", paddingBottom: "5rem" }} 
        className="container"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: "720px" }}
        >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.8rem" }}
            >
              <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold)" }} />
              <span className="section-label">Johor Bahru · Malaysia · Est. 2017</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-serif)", fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
                fontWeight: 700, lineHeight: 1.1, color: "#FFFFFF",
                marginBottom: "1.5rem", letterSpacing: "-0.01em"
              }}
            >
              The Standard for<br />
              <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Real Estate Excellence</em><br />
              in Johor.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.9 }}
              style={{
                fontSize: "1.05rem", color: "rgba(255, 255, 255, 0.8)", maxWidth: "520px",
                lineHeight: 1.75, marginBottom: "2.5rem"
              }}
            >
              GYDEN Real Estate Group engineers risk-adjusted property portfolios across Johor's highest-growth corridors — from RTS-linked commercial hubs to freehold luxury residences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
            >
              <button
                id="hero-explore-btn"
                onClick={() => document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  padding: "0.85rem 2rem", background: "var(--gold)", color: "var(--bg)",
                  fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold-light)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; }}
              >
                Explore Properties
              </button>
              <button
                id="hero-match-btn"
                onClick={() => document.getElementById("matcher")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  padding: "0.85rem 2rem", background: "transparent", border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#FFFFFF", fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s",
                }}
                onMouseEnter={e => { 
                  (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; 
                  (e.currentTarget as HTMLElement).style.borderColor = "#FFFFFF"; 
                  (e.currentTarget as HTMLElement).style.color = "var(--text)"; 
                }}
                onMouseLeave={e => { 
                  (e.currentTarget as HTMLElement).style.background = "transparent"; 
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.3)"; 
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF"; 
                }}
              >
                Find Your Match
              </button>
            </motion.div>
          </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
          zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px"
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--text-dim)", textTransform: "uppercase" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, var(--gold), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
