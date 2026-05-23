import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import sa001Img from "../assets/images/property_sa001.png";
import sa002Img from "../assets/images/property_sa002.png";
import sa003Img from "../assets/images/property_sa003.png";

const steps = [
  {
    id: "purpose", label: "Purpose", question: "What is your intention?",
    options: ["Buy", "Rent", "Invest", "Joint Venture"]
  },
  {
    id: "type", label: "Property Type", question: "What type of property?",
    options: ["APT", "CONDO", "SR", "FLAT", "TERRACE", "SEMI-D", "BUNGALOW", "SOHO", "OFFICE", "RETAIL", "INDUSTRIAL"]
  },
  {
    id: "budget", label: "Budget", question: "What is your budget range?",
    options: ["< RM 500K", "RM 500K – 1M", "RM 1M – 3M", "RM 3M – 5M", "RM 5M+", "Open Budget"]
  },
  {
    id: "location", label: "Location", question: "Preferred location in Johor?",
    options: ["Johor Bahru Central", "Danga Bay", "Skudai", "Iskandar Puteri", "Medini", "Senai", "Flexible"]
  },
  {
    id: "rooms", label: "Rooms", question: "Number of rooms needed?",
    options: ["Studio", "1 Room", "2 Rooms", "3 Rooms", "4 Rooms", "5 Rooms+", "Not Applicable"]
  },
];

const MATCH_DATA = [
  { id: "SA001", title: "Danga Bay Commercial Hub", type: "RETAIL", price: "RM 4,200,000", yield: "6.8%", image: sa001Img, tags: ["Invest", "RETAIL", "RM 3M – 5M", "Danga Bay"] },
  { id: "SA002", title: "Skudai Luxury Villa", type: "BUNGALOW", price: "RM 2,850,000", yield: "4.5%", image: sa002Img, tags: ["Buy", "BUNGALOW", "RM 1M – 3M", "Skudai"] },
  { id: "SA003", title: "JB Central Office Plot", type: "INDUSTRIAL", price: "RM 7,900,000", yield: "8.2%", image: sa003Img, tags: ["Invest", "Joint Venture", "INDUSTRIAL", "RM 5M+", "Johor Bahru Central"] },
];

export default function PropertyMatcher() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [matched, setMatched] = useState<typeof MATCH_DATA | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleAnswer = (value: string) => {
    const step = steps[currentStep];
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Match
      const userTags = Object.values(newAnswers) as string[];
      const results = MATCH_DATA.filter(p =>
        p.tags.some(tag => userTags.some(ut => tag.toLowerCase().includes(ut.toLowerCase()) || ut.toLowerCase().includes(tag.toLowerCase())))
      );
      setMatched(results.length > 0 ? results : MATCH_DATA);
    }
  };

  const reset = () => { setAnswers({}); setCurrentStep(0); setMatched(null); };
  const goBack = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  return (
    <section id="matcher" style={{ padding: "7rem 0", background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: "760px", margin: "0 auto" }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1rem" }}>
              <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold)" }} />
              <span className="section-label">Smart Matching Engine</span>
              <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 700, color: "var(--text)", marginBottom: "1rem" }}>
              Find Your Perfect Property
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
              Answer a few quick questions and we'll match you with the best properties in our portfolio.
            </p>
          </div>

          {/* Wizard */}
          {!matched ? (
            <div>
              {/* Progress Bar */}
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2.5rem" }}>
                {steps.map((s, i) => (
                  <div key={s.id} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ height: "2px", background: i <= currentStep ? "var(--gold)" : "var(--border)", transition: "background 0.4s" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: i <= currentStep ? "var(--gold)" : "var(--text-dim)" }}>{s.label}</span>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                >
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", marginBottom: "1.8rem" }}>
                    {steps[currentStep].question}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                    {steps[currentStep].options.map(opt => (
                      <button
                        key={opt}
                        id={`matcher-${steps[currentStep].id}-${opt}`}
                        onClick={() => handleAnswer(opt)}
                        style={{
                          padding: "0.7rem 1.2rem", background: "transparent",
                          border: `1px solid ${answers[steps[currentStep].id] === opt ? "var(--gold)" : "var(--border)"}`,
                          color: answers[steps[currentStep].id] === opt ? "var(--gold)" : "var(--text-muted)",
                          fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em",
                          cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                        onMouseLeave={e => {
                          if (answers[steps[currentStep].id] !== opt) {
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                          }
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <button onClick={goBack} disabled={currentStep === 0} style={{ background: "none", border: "none", color: currentStep === 0 ? "var(--text-dim)" : "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "0.8rem", cursor: currentStep === 0 ? "default" : "pointer" }}>
                  ← Back
                </button>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
            </div>
          ) : (
            /* Results */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
                <CheckCircle2 size={20} color="var(--gold)" />
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--text)" }}>
                  We found <strong style={{ color: "var(--gold)" }}>{matched.length}</strong> matching {matched.length === 1 ? "property" : "properties"} for you
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {matched.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ display: "flex", gap: "1.2rem", background: "var(--bg-card)", border: "1px solid var(--border-gold)", padding: "1rem", alignItems: "center" }}
                  >
                    <img src={p.image} alt={p.title} style={{ width: "90px", height: "70px", objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", padding: "2px 7px", background: "var(--gold)", color: "var(--bg)", fontWeight: 700 }}>{p.id}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", padding: "2px 7px", border: "1px solid var(--gold-border)", color: "var(--gold)" }}>{p.type}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.3rem" }}>{p.title}</div>
                      <div style={{ display: "flex", gap: "1.5rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: 600 }}>{p.price}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.yield} Yield</span>
                      </div>
                    </div>
                    <button
                      onClick={() => document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" })}
                      style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer" }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  id="matcher-reset-btn"
                  onClick={reset}
                  style={{
                    padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid var(--border)",
                    color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "0.78rem", cursor: "pointer"
                  }}
                >
                  Start Over
                </button>
                <button
                  id="matcher-contact-btn"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  style={{
                    padding: "0.75rem 1.5rem", background: "var(--gold)", border: "none",
                    color: "var(--bg)", fontFamily: "var(--font-sans)", fontSize: "0.78rem",
                    fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em"
                  }}
                >
                  Speak to an Advisor →
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
