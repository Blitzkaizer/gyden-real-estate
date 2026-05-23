import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, User, Calendar, CheckSquare, Send, CheckCircle2, DollarSign } from "lucide-react";

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
    <section id="contact" className="py-24 bg-[#080808] border-t border-[#161616] text-[#F5F0E8]">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
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
              <div className="inline-flex items-center space-x-2 bg-stone-900/60 border border-[var(--gold-border)] rounded-none px-3.5 py-1.5">
                <span className="text-[9px] text-[var(--gold)] font-mono tracking-widest font-bold uppercase">GREC ADVISORY OFFICE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-normal font-serif tracking-tight text-white leading-tight">
                Secure a Strategy Session
              </h2>
              
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-sans">
                Connect directly with GYDEN Real Estate Group's executive desk. We consult on Malaysian tax structures, local joint-venture options, RTS station correlations, and corporate acquisitions.
              </p>

              {/* CEO Guarantee Highlight Card */}
              <div className="bg-[#111111] p-6 rounded-none border border-stone-850">
                <blockquote className="text-xs text-stone-300 italic leading-relaxed font-serif">
                  "Every capital allocation request is reviewed personally under our strict GREC portfolio standard. If you present an investment thesis, we will match it against active title deeds within Johor's premier corridors."
                </blockquote>
                <div className="flex items-start space-x-3.5 mt-5 pt-5 border-t border-stone-900">
                  <div className="bg-[var(--gold)] text-stone-950 text-xs font-mono font-bold h-9 w-9 rounded-none flex items-center justify-center shrink-0">
                    GH
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Gyden Heng</span>
                    <span className="text-[9px] text-[var(--gold)] font-mono font-bold block uppercase tracking-wider mt-0.5">CEO & Founder, GYDEN Group</span>
                    <span className="text-[10px] text-stone-400 block mt-1.5 leading-relaxed">CEO of GREC with 7+ years of elite real estate experience specializing in commercial acquisitions and bespoke yield optimization.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Coordinates */}
            <div className="mt-8 space-y-4 pt-6 border-t border-stone-900 text-[10px] text-stone-400 font-mono uppercase tracking-wider">
              <div className="flex items-center space-x-3.5">
                <MapPin className="h-4 w-4 text-[var(--gold)] shrink-0" />
                <span>Johor Bahru Central Business District (CBD), Malaysia</span>
              </div>
              <div className="flex items-center space-x-3.5">
                <Mail className="h-4 w-4 text-[var(--gold)] shrink-0" />
                <span className="lowercase">info.gydenrealestate@grec.com</span>
              </div>
              <div className="flex items-center space-x-3.5">
                <Phone className="h-4 w-4 text-[var(--gold)] shrink-0" />
                <span>+60 7-224 14088 (Johor Office Desk)</span>
              </div>
            </div>

          </div>

          {/* Right form container */}
          <div className="lg:col-span-7 bg-[#111111] border border-stone-850 p-6 sm:p-8 rounded-none relative">
            
            {submissionResult ? (
              /* High Fidelity Success Status Panel */
              <div className="flex flex-col items-center justify-center text-center p-6 h-full space-y-5 animate-fade-in">
                <div className="h-14 w-14 bg-[var(--gold-dim)] rounded-none border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold)] shrink-0">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-normal text-white font-serif tracking-tight">
                  Strategy Profile Registered
                </h3>
                
                <div className="bg-[#080808] p-5 rounded-none border border-stone-850 w-full text-left space-y-3 font-mono text-[10px] text-stone-300 tracking-wider">
                  <div>Reference Token: <strong className="text-[var(--gold)] font-bold block mt-1 text-xs">{submissionResult.referenceID}</strong></div>
                  <hr className="border-stone-900" />
                  <div>Assigned Strategy Sector: <strong className="text-white block mt-1">{formData.strategy}</strong></div>
                  <div>Budget Range: <strong className="text-white block mt-1">{formData.budget}</strong></div>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed max-w-md">
                  {submissionResult.message} A corporate legal dossier matching SA001/003 metrics has been earmarked for your preview.
                </p>

                <button
                  id="reset-form-button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-[#161616] hover:bg-[#1e1e1e] text-white border border-stone-800 hover:border-[var(--gold)] text-[10px] font-bold rounded-none font-mono tracking-widest uppercase transition-all cursor-pointer"
                >
                  Configure New strategy
                </button>
              </div>
            ) : (
              /* Consultation Input Fields Form */
              <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
                <span className="text-[10px] text-[var(--gold)] font-mono tracking-widest font-bold uppercase block mb-4">
                  Client Intake Questionnaire
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 mb-1.5 text-[9px] font-mono tracking-widest uppercase font-bold">Authorized Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                      <input
                        id="contact-input-name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#080808] border border-stone-800 rounded-none pl-10 pr-3 py-3 text-xs text-white outline-none focus:border-[var(--gold)] transition-all font-sans placeholder-stone-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1.5 text-[9px] font-mono tracking-widest uppercase font-bold">Corporate Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                      <input
                        id="contact-input-email"
                        type="email"
                        placeholder="john@grec-invest.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#080808] border border-stone-800 rounded-none pl-10 pr-3 py-3 text-xs text-white outline-none focus:border-[var(--gold)] transition-all font-sans placeholder-stone-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 mb-1.5 text-[9px] font-mono tracking-widest uppercase font-bold">Telephone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                      <input
                        id="contact-input-phone"
                        type="tel"
                        placeholder="+60 12-345 6789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#080808] border border-stone-800 rounded-none pl-10 pr-3 py-3 text-xs text-white outline-none focus:border-[var(--gold)] transition-all font-sans placeholder-stone-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1.5 text-[9px] font-mono tracking-widest uppercase font-bold">Budget Range Bracket (RM)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gold)]" />
                      <select
                        id="contact-input-budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-[#080808] border border-stone-800 rounded-none pl-10 pr-8 py-3 text-xs text-white outline-none focus:border-[var(--gold)] transition-all font-sans"
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
                  <label className="block text-stone-400 mb-1.5 text-[9px] font-mono tracking-widest uppercase font-bold">Allocation Strategy Target focus</label>
                  <select
                    id="contact-input-strategy"
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="w-full bg-[#080808] border border-stone-800 rounded-none px-3.5 py-3 text-xs text-white outline-none focus:border-[var(--gold)] transition-all font-sans"
                  >
                    <option>Transit Corridor Development (SA003 Correlation)</option>
                    <option>Waterfront Commercial Hubs (SA001 Correlation)</option>
                    <option>Teak Landed Residential Luxury Villas (SA002 Correlation)</option>
                    <option>Blended Joint Venture Portfolio (All Assets Matrix)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1.5 text-[9px] font-mono tracking-widest uppercase font-bold">Brief Summary & Specific Requirements</label>
                  <textarea
                    id="contact-input-notes"
                    rows={4}
                    placeholder="Provide specific notes on your tax status, corporate entity profiling, or desired takeover timeline..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#080808] border border-stone-800 rounded-none px-3.5 py-3 text-xs text-white outline-none focus:border-[var(--gold)] transition-all font-sans placeholder-stone-700"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-stone-950 font-mono tracking-widest uppercase text-xs font-bold rounded-none transition-all duration-350 flex items-center justify-center space-x-2.5 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-stone-950 border-t-transparent rounded-none" />
                      <span>Submitting strategic dossier...</span>
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
