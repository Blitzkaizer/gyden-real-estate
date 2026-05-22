import { motion } from "motion/react";
import { ShieldCheck, Award, Users, BarChart3, ChevronDown, CheckCircle, MapPin } from "lucide-react";
import gydenHengImg from "../assets/images/gyden_heng_1779446997273.jpg";

interface HeroProps {
  onExploreProperties: () => void;
  onConsultAdvisor: () => void;
}

export default function Hero({ onExploreProperties, onConsultAdvisor }: HeroProps) {
  const coreStats = [
    { label: "Acquisitions Vetted", value: "RM 240M+", desc: "Johor & SEA region" },
    { label: "RTS Corridor Growth", value: "25% YoY", desc: "Projected Central JB cap" },
    { label: "Allocations Engineered", value: "120+", desc: "Corporate & private portfolios" },
    { label: "Strategic Client Yield", value: "6.8% Average", desc: "Commercial & residential blended" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <header id="hero" className="relative min-h-screen pt-28 flex flex-col justify-center bg-stone-950 text-stone-100 overflow-hidden">
      {/* Decorative premium radial shadow glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/5 to-amber-700/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-gradient-to-tr from-stone-800/20 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Main Hero Copy - Column 7 */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Top Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-stone-900 border border-stone-800 rounded-full px-3 py-1.5 w-fit"
            >
              <span className="flex h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                Official Portfolio Workspace & Legal Archive
              </span>
            </motion.div>

            {/* Title / Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-stone-100 leading-tight"
            >
              Optimized <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Asset Allocation</span> & One-Stop Real Estate Solutions
            </motion.h1>

            {/* CEO Credit and Concept */}
            <motion.p 
              variants={itemVariants}
              className="text-stone-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans"
            >
              Founded by the CEO, <strong className="text-amber-400 font-semibold text-stone-200">Gyden Heng</strong>. GYDEN Real Estate Group (GREC) engineers robust risk-adjusted portfolios within fast-growing commercial, luxury residential, and industrial nodes. We secure direct developer pricing and handle full-cycle acquisition documents.
            </motion.p>

            {/* Two Tier CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <button
                id="hero-explore-properties-btn"
                onClick={onExploreProperties}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center cursor-pointer"
              >
                Inspect Portfolio Database
              </button>
              <button
                id="hero-ai-advisor-btn"
                onClick={onConsultAdvisor}
                className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 font-semibold rounded-lg hover:text-amber-300 transition-all duration-200 text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Consult IA Investment Advisor</span>
              </button>
            </motion.div>

            {/* Brand pillars */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 pt-6 border-t border-stone-900"
            >
              <div className="flex items-center space-x-2 text-stone-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-mono">Assessed Title Deeds</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-400">
                <Award className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-xs font-mono">Vetted Legal Annexes</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-400">
                <Users className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-xs font-mono">CEO Direct Veto</span>
              </div>
            </motion.div>

          </div>

          {/* Interactive Portal Overview Widget / CEO Portrait Card - Column 5 */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 relative"
          >
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/15 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              {/* Highlight Overlay Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-300 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-stone-500/5 rounded-full blur-2xl group-hover:bg-amber-500/5 transition-all duration-300 pointer-events-none" />

              {/* Professional Card Header */}
              <div className="flex items-center justify-between border-b border-stone-850 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-wider text-amber-400 uppercase font-bold">
                    Executive Portfolio Desk
                  </span>
                </div>
                <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                  VERIFIED DEEDS
                </div>
              </div>

              {/* CEO Portrait Header & Physical/Asset Strategy Profile */}
              <div className="flex flex-col space-y-4">
                <div className="relative w-full h-[390px] rounded-xl overflow-hidden border border-stone-800 bg-stone-950 shadow-inner group-hover:border-amber-500/20 transition-all duration-300">
                  <img 
                    src={gydenHengImg} 
                    alt="GYDEN CEO Gyden Heng"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
                  />
                  {/* Floating Identity Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent p-4 flex flex-col justify-end">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest block font-bold">GREC CEO & FOUNDER</span>
                        <h3 className="text-lg font-bold tracking-tight text-white font-sans">Gyden Heng</h3>
                      </div>
                      <div className="bg-amber-500/20 backdrop-blur-md px-2 py-0.5 rounded border border-amber-500/35 text-[9px] font-mono font-bold text-amber-300 uppercase">
                        Exp: 7+ Years
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive CEO Quote & Discipline Statement */}
                <div className="bg-stone-900/45 p-4 rounded-xl border border-stone-850 relative z-10">
                  <p className="text-xs text-stone-300 leading-relaxed font-sans italic">
                    "Every asset allocation thesis must meet our rigorous validation criteria. Consistent discipline and precise risk analysis are the foundation of high-performing portfolios."
                  </p>
                  <span className="text-[9px] font-mono font-bold tracking-wider text-amber-400 uppercase mt-2 block text-right">— Executive Desk Code</span>
                </div>

                {/* Key Metrics Dashboard & Vitals Grid */}
                <div className="grid grid-cols-2 gap-3 py-1">
                  <div className="bg-stone-950 p-2.5 rounded border border-stone-850">
                    <span className="text-[9px] font-mono text-stone-500 uppercase block tracking-wider">Leadership Status</span>
                    <span className="text-xs font-bold text-stone-200">CEO of GREC</span>
                  </div>
                  <div className="bg-stone-950 p-2.5 rounded border border-stone-850">
                    <span className="text-[9px] font-mono text-stone-500 uppercase block tracking-wider">Acquisition Vetting</span>
                    <span className="text-xs font-bold text-amber-400">Direct Nominee Veto</span>
                  </div>
                </div>

                {/* Workspace Verification Badges */}
                <div className="space-y-2">
                  <h4 className="text-[10px] text-amber-400 uppercase font-bold tracking-widest font-mono">Active Johor Real Estate Grids</h4>
                  
                  <div className="flex items-center justify-between text-xs text-stone-300 bg-stone-900/40 p-2.5 rounded border border-stone-850 hover:bg-stone-800/40 transition-colors">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>Johor RTS Transit Corridor Map</span>
                    </div>
                    <span className="text-[9px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold uppercase">SA003 Active</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-300 bg-stone-900/40 p-2.5 rounded border border-stone-850 hover:bg-stone-800/40 transition-colors">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>Freehold Water-Front Hub Index</span>
                    </div>
                    <span className="text-[9px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold uppercase">SA001 Vetted</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Bottom Core Stats Grid */}
        <motion.section 
          id="grec-metrics" 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-16 mt-16 border-t border-stone-900"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {coreStats.map((stat, i) => (
            <div key={i} className="bg-stone-900/40 border border-stone-900 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-sans text-stone-100 block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-amber-400 font-mono tracking-wider block mt-1 uppercase text-[10px]">
                  {stat.label}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-2 font-sans border-l-2 border-stone-800 pl-2 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </motion.section>

        {/* Animated Chevron Indicator */}
        <div className="flex justify-center pt-8 pointer-events-none mt-4">
          <ChevronDown className="h-5 w-5 text-stone-500 animate-bounce" />
        </div>

      </div>
    </header>
  );
}
