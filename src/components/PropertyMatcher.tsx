import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { openPropertyDetailsModal } from "./Properties";
import ALL_PROPERTIES_RAW from "../data/properties_data.json";

interface Property {
  id: string;
  title: string;
  type: string;
  category: string;
  price: string;
  rawPrice: number;
  area: string;
  location: string;
  yield: string;
  status: string;
  description: string;
  features: string[];
  image: string;
  images: string[];
  bedrooms?: string;
  bathrooms?: string;
}

const ALL_PROPERTIES = ALL_PROPERTIES_RAW as unknown as Property[];

const steps = [
  {
    id: "purpose", label: "Purpose", question: "What is your intention?",
    options: ["Buy", "Rent", "Invest", "Joint Venture"]
  },
  {
    id: "type", label: "Property Type", question: "What type of property are you looking for?",
    options: ["Apartment", "Condominium", "Terrace House", "Semi-D", "Bungalow", "Shop Lot", "Land", "Any Type"]
  },
  {
    id: "budget", label: "Budget", question: "What is your budget range?",
    options: ["< RM 500K", "RM 500K – 1M", "RM 1M – 3M", "RM 3M – 5M", "RM 5M+", "Open Budget"]
  },
  {
    id: "location", label: "Location", question: "Preferred area in Johor?",
    options: ["Johor Bahru Central", "Danga Bay", "Medini", "Kulai", "Desaru", "Seri Alam", "Mount Austin", "Flexible"]
  },
  {
    id: "rooms", label: "Rooms", question: "Number of rooms needed (if residential)?",
    options: ["Studio", "1 Room", "2 Rooms", "3 Rooms", "4 Rooms", "5 Rooms+", "Not Applicable"]
  },
];

export default function PropertyMatcher() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [matched, setMatched] = useState<Property[] | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleAnswer = (value: string) => {
    const step = steps[currentStep];
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Execute matchmaking algorithm
      const results = ALL_PROPERTIES.filter(p => {
        // 1. Purpose Match
        const purpose = newAnswers.purpose;
        const isRent = p.price.toLowerCase().includes("rent") || (p.rental_income && p.rental_income !== "TBC");
        const isSales = !isRent;
        const matchPurpose = 
          purpose === "Rent" ? isRent :
          purpose === "Buy" ? isSales :
          purpose === "Joint Venture" ? p.status.toLowerCase() === "joint venture" :
          true; // "Invest" matches anything
          
        // 2. Type Match
        const type = newAnswers.type;
        let matchType = true;
        if (type !== "Any Type") {
          const pTypeLower = p.type.toLowerCase();
          if (type === "Apartment") matchType = pTypeLower.includes("apartment") || pTypeLower.includes("soho") || pTypeLower.includes("flat");
          else if (type === "Condominium") matchType = pTypeLower.includes("condo") || pTypeLower.includes("apartment") || pTypeLower.includes("residence");
          else if (type === "Terrace House") matchType = pTypeLower.includes("terrace") || pTypeLower.includes("gardenlink") || pTypeLower.includes("townhouse") || pTypeLower.includes("link");
          else if (type === "Semi-D") matchType = pTypeLower.includes("semi") || pTypeLower.includes("semi-d");
          else if (type === "Bungalow") matchType = pTypeLower.includes("bungalow") || pTypeLower.includes("villa");
          else if (type === "Shop Lot") matchType = pTypeLower.includes("shop") || pTypeLower.includes("office") || pTypeLower.includes("retail");
          else if (type === "Land") matchType = pTypeLower.includes("land") || pTypeLower.includes("industrial") || pTypeLower.includes("agriculture");
        }

        // 3. Budget Match
        const budget = newAnswers.budget;
        let matchBudget = true;
        if (budget !== "Open Budget") {
          if (budget === "< RM 500K") matchBudget = p.rawPrice > 0 && p.rawPrice < 500000;
          else if (budget === "RM 500K – 1M") matchBudget = p.rawPrice >= 500000 && p.rawPrice <= 1000000;
          else if (budget === "RM 1M – 3M") matchBudget = p.rawPrice >= 1000000 && p.rawPrice <= 3000000;
          else if (budget === "RM 3M – 5M") matchBudget = p.rawPrice >= 3000000 && p.rawPrice <= 5000000;
          else if (budget === "RM 5M+") matchBudget = p.rawPrice >= 5000000;
        }

        // 4. Location Match
        const loc = newAnswers.location;
        let matchLocation = true;
        if (loc !== "Flexible") {
          const cleanLoc = loc.replace(" Central", "").toLowerCase();
          matchLocation = p.location.toLowerCase().includes(cleanLoc) || p.title.toLowerCase().includes(cleanLoc);
        }

        // 5. Rooms Match
        const rooms = newAnswers.rooms;
        let matchRooms = true;
        if (rooms !== "Not Applicable" && p.bedrooms) {
          if (rooms === "Studio") {
            matchRooms = p.bedrooms.toLowerCase().includes("studio") || p.bedrooms === "1";
          } else {
            const numRooms = parseInt(rooms);
            if (!isNaN(numRooms)) {
              // Convert "3+1" to 3
              const pRooms = parseInt(p.bedrooms);
              matchRooms = !isNaN(pRooms) && pRooms >= numRooms;
            }
          }
        }

        return matchPurpose && matchType && matchBudget && matchLocation && matchRooms;
      });

      // Limit matching results to top 5 to keep view elegant and readable
      setMatched(results.slice(0, 5));
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
              Answer a few quick questions and we'll instantly match you with matching properties in our 300-plot portfolio.
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
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: i <= currentStep ? "var(--gold)" : "var(--text-dim)" }}>{s.label}</span>
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
                          fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.08em",
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
                <button onClick={goBack} disabled={currentStep === 0} style={{ background: "none", border: "none", color: currentStep === 0 ? "var(--text-dim)" : "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "0.85rem", cursor: currentStep === 0 ? "default" : "pointer" }}>
                  ← Back
                </button>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
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
                  {matched.length > 0 ? (
                    <>We found <strong style={{ color: "var(--gold)" }}>{matched.length}</strong> matching {matched.length === 1 ? "property" : "properties"} for you</>
                  ) : (
                    <>No exact matches found. Showing recommendations</>
                  )}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {(matched.length > 0 ? matched : ALL_PROPERTIES.slice(0, 3)).map((p, i) => (
                  <motion.div
                     key={p.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     style={{ display: "flex", gap: "1.2rem", background: "var(--bg-card)", border: "1px solid var(--border)", padding: "1rem", alignItems: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-gold)"; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                     onClick={() => openPropertyDetailsModal(p.id)}
                  >
                    <img src={p.image} alt={p.title} style={{ width: "90px", height: "70px", objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "3px 8px", background: "var(--gold)", color: "var(--bg)", fontWeight: 700 }}>{p.category}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "3px 8px", border: "1px solid var(--gold-border)", color: "var(--gold)" }}>{p.type}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.3rem" }}>{p.title}</div>
                      <div style={{ display: "flex", gap: "1.5rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--gold)", fontWeight: 600 }}>{p.price}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{p.yield === "TBC" ? "Capital Growth Focus" : `${p.yield} Yield`}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); openPropertyDetailsModal(p.id); }}
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
                    color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "0.78rem", cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--text-muted)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                >
                  Start Over
                </button>
                <button
                  id="matcher-contact-btn"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  style={{
                    padding: "0.75rem 1.5rem", background: "var(--gold)", border: "none",
                    color: "var(--bg)", fontFamily: "var(--font-sans)", fontSize: "0.78rem",
                    fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", transition: "background 0.2s"
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold-light)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; }}
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
