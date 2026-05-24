import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  { value: "RM 240M+", label: "Acquisitions Vetted", sub: "Johor & SEA Region" },
  { value: "25% YoY", label: "RTS Corridor Growth", sub: "Projected Capital Growth" },
  { value: "120+", label: "Portfolios Engineered", sub: "Corporate & Private" },
  { value: "6.8%", label: "Average Client Yield", sub: "Blended Commercial & Residential" },
];

function StatCard({ stat, index }: { stat: typeof stats[0], index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: "2.5rem 2rem", borderTop: "1px solid var(--border-gold)",
        position: "relative", overflow: "hidden"
      }}
    >
      <div style={{
        fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: 700, color: "var(--text)", marginBottom: "0.4rem", letterSpacing: "-0.02em"
      }}>
        {stat.value}
      </div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.15em",
        textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.35rem"
      }}>
        {stat.label}
      </div>
      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{stat.sub}</div>
    </motion.div>
  );
}

export default function Metrics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="metrics" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {stats.map((stat, i) => (
            <React.Fragment key={i}>
              <StatCard stat={stat} index={i} />
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
