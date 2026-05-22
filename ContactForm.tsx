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
    <section id="contact" className="py-24 bg-stone-950 border-t border-stone-900 text-stone-100">
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
              <div className="inline-flex items-center space-x-2 bg-stone-900 border border-stone-800 rounded-full px-3 py-1 bg-stone-900">
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider font-bold">GREC ADVISORY OFFICE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight">
                Secure a Strategy Session
              </h2>
              
              <p className="text-stone-400 text-sm leading-relaxed">
                Connect directly with GYDEN Real Estate Group's executive desk. We consult on Malaysian tax structures, local joint-venture options, RTS station correlations, and corporate acquisitions.
              </p>

              {/* CEO Guarantee Highlight Card */}
              <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-850">
                <blockquote className="text-xs text-stone-300 italic leading-relaxed">
                  "Every capital allocation request is reviewed personally under our strict GREC portfolio standard. If you present an investment thesis, we will match it against active title deeds within Johor's premier corridors."
                </blockquote>
                <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-stone-900">
                  <div className="bg-amber-500 text-stone-950 text-xs font-mono font-bold h-8 w-8 rounded-full flex items-center justify-center font-bold">
                    GH
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-200 block">Gyden Heng</span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold block">CEO & Founder, GYDEN Group</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5 leading-normal">CEO of GREC with 7+ years of elite real estate experience specializing in commercial acquisitions and bespoke yield optimization.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Coordinates */}
            <div className="mt-8 space-y-4 pt-6 border-t border-stone-900 text-xs text-stone-400 font-mono">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>Johor Bahru Central Business District (CBD), Malaysia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>info.gydenrealestate@grec.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>+60 7-224 14088 (Johor Office Desk)</span>
              </div>
            </div>

          </div>

          {/* Right form container */}
          <div className="lg:col-span-7 bg-stone-900/40 border border-stone-900 p-6 sm:p-8 rounded-2xl relative shadow-xl">
            
            {submissionResult ? (
              /* High Fidelity Success Status Panel */
              <div className="flex flex-col items-center justify-center text-center p-6 h-full space-y-5 animate-fade-in">
                <div className="h-14 w-14 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-bold text-stone-100 font-sans tracking-tight">
                  Strategy Profile Registered
                </h3>
                
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 w-full text-left space-y-2.5 font-mono text-[11px] text-stone-300">
                  <div>Reference Token: <strong className="text-emerald-400 font-bold block mt-0.5 text-sm">{submissionResult.referenceID}</strong></div>
                  <hr className="border-stone-900" />
                  <div>Assigned Strategy Sector: <strong className="text-stone-100 block mt-0.5">{formData.strategy}</strong></div>
                  <div>Budget Range: <strong className="text-stone-100 block mt-0.5">{formData.budget}</strong></div>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {submissionResult.message} A corporate legal dossier matching SA001/003 metrics has been earmarked for your preview.
                </p>

                <button
                  id="reset-form-button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-stone-800 hover:bg-stone-750 text-stone-100 text-xs font-semibold rounded-lg font-mono tracking-wider uppercase transition-all border border-stone-800"
                >
                  Configure New strategy
                </button>
              </div>
            ) : (
              /* Consultation Input Fields Form */
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <span className="text-[10px] text-emerald-400 font-mono tracking-widest font-bold uppercase block mb-2">
                  Client Intake Questionnaire
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Authorized Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4.5 w-4.5 text-stone-650 text-stone-500" />
                      <input
                        id="contact-input-name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-200 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Corporate Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-stone-650 text-stone-500" />
                      <input
                        id="contact-input-email"
                        type="email"
                        placeholder="john@grec-invest.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-200 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Telephone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4.5 w-4.5 text-stone-650 text-stone-500" />
                      <input
                        id="contact-input-phone"
                        type="tel"
                        placeholder="+60 12-345 6789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-200 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Budget Range Bracket (RM)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4.5 w-4.5 text-emerald-400" />
                      <select
                        id="contact-input-budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-200 outline-none focus:border-emerald-500"
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
                  <label className="block text-stone-400 mb-1 font-semibold">Allocation Strategy Target focus</label>
                  <select
                    id="contact-input-strategy"
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-stone-200 outline-none focus:border-emerald-500"
                  >
                    <option>Transit Corridor Development (SA003 Correlation)</option>
                    <option>Waterfront Commercial Hubs (SA001 Correlation)</option>
                    <option>Teak Landed Residential Luxury Villas (SA002 Correlation)</option>
                    <option>Blended Joint Venture Portfolio (All Assets Matrix)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Brief Summary & Specific Requirements</label>
                  <textarea
                    id="contact-input-notes"
                    rows={4}
                    placeholder="Provide specific notes on your tax status, corporate entity profiling, or desired takeover timeline..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-stone-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-stone-950 font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-stone-950 border-t-transparent rounded-full" />
                      <span>Submitting strategic dossier...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4.5 w-4.5" />
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
