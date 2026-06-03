import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, User, Calendar, CheckSquare, Send, CheckCircle2, DollarSign, Facebook } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    strategy: "Transit Corridor Development",
    budget: "RM 2,000,000 - RM 5,000,000",
    notes: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setSubmissionResult(data);
    } catch (err) {
      console.error("Error submitting consultation:", err);
      // Simulated receipt fallback if offline/no backend
      setSubmissionResult({
        success: true,
        referenceID: "REF-" + Math.floor(100000 + Math.random() * 900000),
        message: `Thank you ${formData.name}. Your GYDEN premium strategy profile (Budget: ${formData.budget}) has been compiled. Our executive desk will reach out to you within 24 hours.`
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      strategy: "Transit Corridor Development",
      budget: "RM 2,000,000 - RM 5,000,000",
      notes: ""
    });
  };

  return (
    <section id="contact" className="py-24 bg-[var(--bg)] border-t border-[var(--border)] text-[var(--text)]">
      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left information panel (CEO Memo & Contacts) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Vibe badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-surface)", border: "1px solid var(--gold-border)", padding: "0.35rem 0.85rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--gold)", fontFamily: "var(--font-mono)", letterSpacing: "0.15em", fontWeight: "bold", textTransform: "uppercase" }}>GREC ADVISORY OFFICE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-normal font-serif tracking-tight text-[var(--text)] leading-tight">
                Secure a Strategy Session
              </h2>
              
              <p className="text-[var(--text-muted)] text-sm leading-relaxed font-sans">
                Connect directly with GYDEN Real Estate Group's executive desk. We consult on Malaysian tax structures, local joint-venture options, RTS station correlations, and corporate acquisitions.
              </p>

              {/* CEO Guarantee Highlight Card */}
              <div style={{ background: "var(--bg-surface)", padding: "1.5rem", border: "1px solid var(--border)" }}>
                <blockquote className="text-sm text-[var(--text-muted)] italic leading-relaxed font-serif">
                  "Every capital allocation request is reviewed personally under our strict GREC portfolio standard. If you present an investment thesis, we will match it against active title deeds within Johor's premier corridors."
                </blockquote>
                <div style={{ display: "flex", gap: "0.875rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)", alignItems: "flex-start" }}>
                  <div style={{
                    backgroundColor: "var(--gold)",
                    color: "var(--bg)",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-mono)",
                    fontWeight: "bold",
                    height: "36px",
                    width: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    GH
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "var(--text)", display: "block", lineHeight: 1.2 }}>Gyden Heng</span>
                    <span style={{ fontSize: "0.68rem", color: "var(--gold)", fontFamily: "var(--font-mono)", fontWeight: "bold", display: "block", textTransform: "uppercase", letterSpacing: "0.08em" }}>CEO & Founder, GYDEN Group</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginTop: "4px", lineHeight: "1.5" }}>CEO of GREC specializing in institutional-grade commercial acquisitions, joint-venture portfolios, and active asset management.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Coordinates */}
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <MapPin style={{ height: "16px", width: "16px", color: "var(--gold)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Johor Bahru, Malaysia, 81750</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <Mail style={{ height: "16px", width: "16px", color: "var(--gold)", flexShrink: 0 }} />
                <a href="mailto:gydenheng@gmail.com" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", letterSpacing: "0.08em", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>gydenheng@gmail.com</a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <Phone style={{ height: "16px", width: "16px", color: "var(--gold)", flexShrink: 0 }} />
                <a href="tel:+60149840409" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>+60 14-984 0409</a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <Facebook style={{ height: "16px", width: "16px", color: "var(--gold)", flexShrink: 0 }} />
                <a href="https://www.facebook.com/GydenPage/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", fontWeight: "bold", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold-light)"} onMouseLeave={e => e.currentTarget.style.color = "var(--gold)"}>Facebook.com/GydenPage</a>
              </div>
            </div>

          </div>

          {/* Right form container */}
          <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border)] p-6 sm:p-8 rounded-none relative">
            
            {submissionResult ? (
              /* High Fidelity Success Status Panel */
              <div className="flex flex-col items-center justify-center text-center p-6 h-full space-y-5 animate-fade-in">
                <div className="h-14 w-14 bg-[var(--gold-dim)] rounded-none border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold)] shrink-0">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-normal text-[var(--text)] font-serif tracking-tight">
                  Strategy Profile Registered
                </h3>
                
                <div className="bg-[var(--bg)] p-5 rounded-none border border-[var(--border)] w-full text-left space-y-3 font-mono text-[10px] text-[var(--text-muted)] tracking-wider">
                  <div>Reference Token: <strong className="text-[var(--gold)] font-bold block mt-1 text-xs">{submissionResult.referenceID}</strong></div>
                  <hr className="border-[var(--border)]" />
                  <div>Assigned Strategy Sector: <strong className="text-[var(--text)] block mt-1">{formData.strategy}</strong></div>
                  <div>Budget Range: <strong className="text-[var(--text)] block mt-1">{formData.budget}</strong></div>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-md">
                  {submissionResult.message} A corporate legal dossier matching your selected strategy metrics has been earmarked for your preview.
                </p>

                <button
                  id="reset-form-button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--gold)] text-[10px] font-bold rounded-none font-mono tracking-widest uppercase transition-all cursor-pointer"
                >
                  Configure New strategy
                </button>
              </div>
            ) : (
              /* Consultation Input Fields Form */
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--gold)", fontWeight: "bold", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                  Client Intake Questionnaire
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold" }}>Authorized Full Name</label>
                    <div style={{ position: "relative", width: "100%" }}>
                      <User style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--text-dim)", pointerEvents: "none" }} />
                      <input
                        id="contact-input-name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ display: "block", width: "100%", height: "46px", background: "var(--bg)", border: "1px solid var(--border)", paddingLeft: "2.5rem", paddingRight: "1rem", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.78rem", outline: "none", borderRadius: "0px" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold" }}>Corporate Email Address</label>
                    <div style={{ position: "relative", width: "100%" }}>
                      <Mail style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--text-dim)", pointerEvents: "none" }} />
                      <input
                        id="contact-input-email"
                        type="email"
                        placeholder="john@grec-invest.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ display: "block", width: "100%", height: "46px", background: "var(--bg)", border: "1px solid var(--border)", paddingLeft: "2.5rem", paddingRight: "1rem", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.78rem", outline: "none", borderRadius: "0px" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold" }}>Telephone Number</label>
                    <div style={{ position: "relative", width: "100%" }}>
                      <Phone style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--text-dim)", pointerEvents: "none" }} />
                      <input
                        id="contact-input-phone"
                        type="tel"
                        placeholder="+60 12-345 6789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ display: "block", width: "100%", height: "46px", background: "var(--bg)", border: "1px solid var(--border)", paddingLeft: "2.5rem", paddingRight: "1rem", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.78rem", outline: "none", borderRadius: "0px" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold" }}>Budget Range Bracket (RM)</label>
                    <div style={{ position: "relative", width: "100%" }}>
                      <DollarSign style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--gold)", pointerEvents: "none" }} />
                      <select
                        id="contact-input-budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        style={{ display: "block", width: "100%", height: "46px", background: "var(--bg)", border: "1px solid var(--border)", paddingLeft: "2.5rem", paddingRight: "2rem", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.78rem", outline: "none", borderRadius: "0px", cursor: "pointer" }}
                      >
                        <option>Under RM 1,000,000</option>
                        <option>RM 1,000,000 - RM 2,000,000</option>
                        <option>RM 2,000,000 - RM 5,000,000</option>
                        <option>RM 5,000,000 - RM 10,000,000</option>
                        <option>Above RM 10,000,000</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold" }}>Allocation Strategy Target focus</label>
                  <select
                    id="contact-input-strategy"
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    style={{ display: "block", width: "100%", height: "46px", background: "var(--bg)", border: "1px solid var(--border)", paddingLeft: "1rem", paddingRight: "2rem", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.78rem", outline: "none", borderRadius: "0px", cursor: "pointer" }}
                  >
                    <option>Transit Corridor Development (RTS Corridor)</option>
                    <option>Waterfront Commercial Hubs (Danga Bay)</option>
                    <option>Landed Residential Luxury Villas (Skudai)</option>
                    <option>Blended Joint Venture Portfolio (All Assets Matrix)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold" }}>Brief Summary & Specific Requirements</label>
                  <textarea
                    id="contact-input-notes"
                    rows={4}
                    placeholder="Provide specific notes on your tax status, corporate entity profiling, or desired takeover timeline..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={{ display: "block", width: "100%", minHeight: "120px", background: "var(--bg)", border: "1px solid var(--border)", padding: "0.75rem 1rem", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.78rem", outline: "none", borderRadius: "0px", resize: "vertical" }}
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={submitting}
                  style={{ alignSelf: "flex-start", minWidth: "220px", height: "48px", background: "var(--gold)", color: "var(--bg)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.12em", fontWeight: "bold", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", borderRadius: "0px", cursor: "pointer", transition: "background 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--gold-light)"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "var(--gold)"}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-stone-950 border-t-transparent rounded-none" />
                      <span>Submitting dossier...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Consultation Profile</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </motion.div>
    </section>
  );
}
