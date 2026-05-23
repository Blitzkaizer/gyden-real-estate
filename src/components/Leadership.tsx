import { useRef } from "react";
import { motion, useInView } from "motion/react";
import ceoImg from "../assets/images/gyden_heng_1779540471996.jpg";

const credentials = [
  { value: "7+", label: "Years Experience" },
  { value: "RM 240M+", label: "Acquisitions Vetted" },
  { value: "120+", label: "Portfolios Built" },
];

export default function Leadership() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="leadership" style={{ padding: "7rem 0", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div
          ref={ref}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}
          className="leadership-grid"
        >
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
              <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold)" }} />
              <span className="section-label">Leadership</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              fontWeight: 700, color: "var(--text)", lineHeight: 1.1, marginBottom: "0.5rem"
            }}>
              Gyden Heng
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "2rem" }}>
              Founder & Chief Executive Officer
            </p>

            <div style={{ width: "48px", height: "1px", background: "var(--gold)", marginBottom: "2rem" }} />

            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.85, marginBottom: "1.25rem" }}>
              With over 7 years of deep expertise in Johor Bahru's evolving real estate landscape, Gyden Heng founded GYDEN Real Estate Group with a singular mission — to deliver institutional-grade property intelligence and asset allocation to private and corporate investors.
            </p>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.85, marginBottom: "2.5rem" }}>
              His portfolio spans commercial waterfront developments, freehold luxury residences, and the rapidly appreciating RTS Transit Corridor — areas where GREC's CEO-direct vetting process ensures clients access only the highest-quality acquisitions.
            </p>

            {/* Credentials */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
              {credentials.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                >
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 700, color: "var(--gold)", marginBottom: "0.3rem" }}>{c.value}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-dim)" }}>{c.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{
                marginTop: "2.5rem", padding: "1.5rem", borderLeft: "2px solid var(--gold)",
                background: "var(--bg-surface)"
              }}
            >
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1rem", color: "var(--text)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                "Every allocation thesis must meet our rigorous validation criteria. Discipline and precision are the foundation of every portfolio we build."
              </p>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase" }}>— Gyden Heng, CEO</span>
            </motion.blockquote>
          </motion.div>

          {/* Right: Portrait */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative" }}
          >
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={ceoImg}
                alt="Gyden Heng — GREC CEO & Founder"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top", display: "block" }}
              />
              {/* Gold frame accent */}
              <div style={{
                position: "absolute", bottom: "-12px", right: "-12px",
                width: "60%", height: "60%",
                border: "1px solid var(--gold-border)",
                pointerEvents: "none", zIndex: -1
              }} />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                position: "absolute", bottom: "2rem", left: "-1.5rem",
                background: "var(--bg-card)", border: "1px solid var(--border-gold)",
                padding: "1rem 1.4rem"
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "0.25rem" }}>GREC CEO & Founder</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>Gyden Heng</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>7+ Years · Johor Bahru</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .leadership-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
}
