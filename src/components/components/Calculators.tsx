import { useState } from "react";
import { motion } from "motion/react";
import { Coins, LineChart, Shield, Landmark, Sliders, Info, Briefcase } from "lucide-react";
import { InvestmentInputs, AssetAllocation } from "../types";

export default function Calculators() {
  // Investment Yield States
  const [inputs, setInputs] = useState<InvestmentInputs>({
    principal: 500000,
    monthlyContribution: 5000,
    durationYears: 10,
    targetYield: 6.8, // %
    capitalGrowthExpectation: 4.5, // %
  });

  // Allocation Sliders State
  const [allocationShares, setAllocationShares] = useState({
    commercial: 50,
    residential: 30,
    development: 10,
    cash: 10,
  });

  const handleSliderChange = (key: string, value: number) => {
    setAllocationShares((prev) => {
      const updated = { ...prev, [key]: value };
      const sum = updated.commercial + updated.residential + updated.development + updated.cash;
      
      // Normalization to ensure lock total behaves beautifully if needed
      // Or simply let them adjust relatively. Here we adjust the slider but let's show status warnings if sum !== 100
      return updated;
    });
  };

  // Math: Compound interest + compounding contributions
  const totalYieldRate = inputs.targetYield / 100;
  const totalCapitalRate = inputs.capitalGrowthExpectation / 100;
  const combinedAnnualReturn = totalYieldRate + totalCapitalRate; // Blended target growth

  let growthDataset: { year: number; yieldEarned: number; capitalGrowth: number; principalVal: number; totalPortfolio: number }[] = [];
  let currentPrincipal = inputs.principal;
  let accumulatedYield = 0;
  let accumulatedCapitalGrowth = 0;

  for (let year = 1; year <= inputs.durationYears; year++) {
    const annualContribution = inputs.monthlyContribution * 12;
    
    // Principal grows by direct capital appreciation
    const yearCapGrowth = currentPrincipal * totalCapitalRate;
    // Yield earned on current asset base
    const yearYieldEarned = (currentPrincipal + annualContribution / 2) * totalYieldRate; // compounded mid-year estimate

    const prevPrincipal = currentPrincipal;
    currentPrincipal += annualContribution;
    accumulatedYield += yearYieldEarned;
    accumulatedCapitalGrowth += yearCapGrowth;

    const totalPortfolio = currentPrincipal + accumulatedYield + accumulatedCapitalGrowth;

    growthDataset.push({
      year,
      yieldEarned: Math.round(accumulatedYield),
      capitalGrowth: Math.round(accumulatedCapitalGrowth),
      principalVal: Math.round(currentPrincipal),
      totalPortfolio: Math.round(totalPortfolio)
    });
  }

  const finalSum = growthDataset[growthDataset.length - 1]?.totalPortfolio || inputs.principal;
  const totalInvestedFunds = inputs.principal + (inputs.monthlyContribution * 12 * inputs.durationYears);
  const totalGain = finalSum - totalInvestedFunds;

  // Asset allocation computations linked to current principal
  const allocationSum = allocationShares.commercial + allocationShares.residential + allocationShares.development + allocationShares.cash;
  const allocationModel: AssetAllocation[] = [
    {
      class: "Core Commercial Yield Assets",
      percentage: allocationShares.commercial,
      description: "Waterfront corporate hubs & high-traffic retail parcels (e.g. SA001) securing monthly cashflow.",
      value: Math.round((inputs.principal * allocationShares.commercial) / 100),
      color: "from-emerald-400 to-emerald-500"
    },
    {
      class: "Bespoke Landed Freehold Residential",
      percentage: allocationShares.residential,
      description: "Teak luxury villas inside premium gated estates (e.g. SA002) acting as multi-gen safety anchors.",
      value: Math.round((inputs.principal * allocationShares.residential) / 100),
      color: "from-teal-500 to-emerald-600"
    },
    {
      class: "Transit-Corridor Joint Ventures",
      percentage: allocationShares.development,
      description: "Development-density plots close to high-speed rail lines / RTS links (e.g. SA003) maximizing capital multiples.",
      value: Math.round((inputs.principal * allocationShares.development) / 100),
      color: "from-lime-400 to-emerald-500"
    },
    {
      class: "Contingency Reserves (Cash/REITs)",
      percentage: allocationShares.cash,
      description: "Liquid wealth caches prepared for opportunist acquisitions or sudden macroeconomic interest pivots.",
      value: Math.round((inputs.principal * allocationShares.cash) / 100),
      color: "from-stone-600 to-stone-500"
    }
  ];

  return (
    <section id="strategies" className="py-24 bg-stone-950 border-t border-stone-900 text-stone-100 relative">
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
        {/* Module Header */}
        <div className="border-b border-stone-900 pb-12 mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase block mb-2">
              FINANCIAL ENGINEERING LAB
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-100 font-sans">
              Optimized Wealth Allocation Modeling
            </h2>
            <p className="text-stone-400 mt-2 text-sm max-w-2xl">
              CEO Gyden Heng rejects speculation. Use our active math terminal to construct sound property portfolios that blend long-term capital inflation resistance with liquid monthly distributions.
            </p>
          </div>
          <div className="flex justify-center shrink-0">
            <span className="text-stone-300 text-xs bg-stone-900 border border-stone-850 p-3 rounded-lg font-mono">
              Model parameters: RM base, Johor RTS growth rate adjusted
            </span>
          </div>
        </div>

        {/* Outer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* SECTION 1: INVESTMENT COMPOUND SIMULATOR */}
          <div id="investment" className="bg-stone-900/40 border border-stone-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <LineChart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-sans text-stone-100">Cumulative Strategy Simulator</h3>
                <span className="text-xs text-stone-500 font-mono">Evaluate blending rental yields and capital growth assets</span>
              </div>
            </div>

            {/* Config Sliders & Inputs */}
            <div className="space-y-4 text-xs font-sans">
              <div>
                <div className="flex justify-between text-stone-300 font-medium mb-1.5 font-mono">
                  <span>Initial Property Capital (RM)</span>
                  <span className="text-emerald-400 font-bold">RM {inputs.principal.toLocaleString()}</span>
                </div>
                <input
                  id="calc-input-principal"
                  type="range"
                  min="100000"
                  max="5000000"
                  step="50000"
                  value={inputs.principal}
                  onChange={(e) => setInputs({ ...inputs, principal: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-stone-300 font-medium mb-1.5 font-mono">
                  <span>Monthly Corporate Supplement</span>
                  <span className="text-emerald-400 font-bold">RM {inputs.monthlyContribution.toLocaleString()}/mo</span>
                </div>
                <input
                  id="calc-input-monthly"
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={inputs.monthlyContribution}
                  onChange={(e) => setInputs({ ...inputs, monthlyContribution: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-400 font-mono mb-1">Duration (Years)</label>
                  <select
                    id="calc-input-duration"
                    value={inputs.durationYears}
                    onChange={(e) => setInputs({ ...inputs, durationYears: parseInt(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-2 text-stone-200 outline-none focus:border-emerald-500/50"
                  >
                    {[3, 5, 10, 15, 20, 30].map((y) => (
                      <option key={y} value={y}>{y} Years</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 font-mono mb-1">Rental Yield (%)</label>
                  <input
                    id="calc-input-yield"
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={inputs.targetYield}
                    onChange={(e) => setInputs({ ...inputs, targetYield: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-2 text-stone-200 font-mono focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-mono mb-1">Capital Growth (%)</label>
                  <input
                    id="calc-input-growth"
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={inputs.capitalGrowthExpectation}
                    onChange={(e) => setInputs({ ...inputs, capitalGrowthExpectation: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-2 text-stone-200 font-mono focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Result summary dashboard */}
            <div className="mt-8 bg-stone-950 rounded-xl p-5 border border-stone-850">
              <span className="text-[10px] text-stone-500 font-mono uppercase tracking-widest block">Projected Portfolio Assessment</span>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-3">
                <div className="border-r border-stone-900 pr-2">
                  <span className="text-2xl font-bold font-mono text-emerald-400 block tracking-tight">
                    RM {finalSum.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mt-0.5 block">Portfolio Balance ({inputs.durationYears} Yr)</span>
                </div>
                <div>
                  <span className="text-lg font-bold font-mono text-emerald-500 block">
                    +RM {totalGain.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-400 uppercase font-mono mt-1 block">Accumulated Gains</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-900 text-[11px] leading-relaxed text-stone-450 grid grid-cols-2 gap-2 text-stone-400 font-mono">
                <div>Total Invested Funds: <strong className="text-stone-200">RM {totalInvestedFunds.toLocaleString()}</strong></div>
                <div>Compounded CAGR: <strong className="text-stone-200">{((inputs.targetYield + inputs.capitalGrowthExpectation)).toFixed(1)}% Blended</strong></div>
              </div>
            </div>

            {/* Dynamic projection table */}
            <div className="mt-6">
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block mb-2 tracking-widest">
                Growth Progression Timeline
              </span>
              <div className="max-h-44 overflow-y-auto border border-stone-850 rounded-lg text-xs font-mono text-stone-400">
                <table className="w-full text-left">
                  <thead className="bg-stone-950 text-[10px] text-stone-500 sticky top-0 uppercase border-b border-stone-850">
                    <tr>
                      <th className="px-3 py-2">Year</th>
                      <th className="px-3 py-2">Invested Cap</th>
                      <th className="px-3 py-2">Accumulated Yield</th>
                      <th className="px-3 py-2">Acc Growth</th>
                      <th className="px-3 py-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-900">
                    {growthDataset.filter((_, idx) => idx % 2 === 0 || idx === growthDataset.length - 1).map((row) => (
                      <tr key={row.year} className="hover:bg-stone-900/60 transition-colors">
                        <td className="px-3 py-2 text-stone-300 font-bold">Yr {row.year}</td>
                        <td className="px-3 py-2">RM {row.principalVal.toLocaleString()}</td>
                        <td className="px-3 py-2 text-emerald-300">RM {row.yieldEarned.toLocaleString()}</td>
                        <td className="px-3 py-2 text-emerald-400">RM {row.capitalGrowth.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-stone-200 font-bold">RM {row.totalPortfolio.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* SECTION 2: ASSET ALLOCATION STRATEGY */}
          <div id="allocation" className="bg-stone-900/40 border border-stone-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-sans text-stone-100">Gyden Allocation Matrix</h3>
                <span className="text-xs text-stone-500 font-mono">Engineer asset classes matching current capital setup</span>
              </div>
            </div>

            {/* Sliders panel */}
            <div className="space-y-4 text-xs font-sans">
              <div>
                <div className="flex justify-between items-center text-stone-300 mb-1 font-mono">
                  <span>Transit-Corridor Commercial (SA001/SA003)</span>
                  <span className="text-emerald-400 font-bold">{allocationShares.commercial}%</span>
                </div>
                <input
                  id="alloc-slider-commercial"
                  type="range"
                  min="0"
                  max="100"
                  value={allocationShares.commercial}
                  onChange={(e) => handleSliderChange("commercial", parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-stone-300 mb-1 font-mono">
                  <span>Bespoke Handed Freehold Residential (SA002)</span>
                  <span className="text-emerald-400 font-bold">{allocationShares.residential}%</span>
                </div>
                <input
                  id="alloc-slider-residential"
                  type="range"
                  min="0"
                  max="100"
                  value={allocationShares.residential}
                  onChange={(e) => handleSliderChange("residential", parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-stone-300 mb-1 font-mono">
                  <span>High-appreciation Development Lots</span>
                  <span className="text-emerald-400 font-bold">{allocationShares.development}%</span>
                </div>
                <input
                  id="alloc-slider-development"
                  type="range"
                  min="0"
                  max="100"
                  value={allocationShares.development}
                  onChange={(e) => handleSliderChange("development", parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-stone-300 mb-1 font-mono">
                  <span>Contingency Reserves & Reits</span>
                  <span className="text-emerald-400 font-bold">{allocationShares.cash}%</span>
                </div>
                <input
                  id="alloc-slider-cash"
                  type="range"
                  min="0"
                  max="100"
                  value={allocationShares.cash}
                  onChange={(e) => handleSliderChange("cash", parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>
            </div>

            {/* Total check warning */}
            <div className={`mt-5 p-3 rounded-lg flex items-center justify-between text-xs font-mono font-medium ${
              allocationSum === 100 
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}>
              <span>Allocation Share Sum: <strong>{allocationSum}%</strong></span>
              <span>{allocationSum === 100 ? "✓ Balanced Portfolio (Optimum)" : "⚠ Adjusted sum must equal 100%"}</span>
            </div>

            {/* Generated Allocation Visual List */}
            <div className="mt-6 space-y-3 font-sans">
              <span className="text-[10px] text-stone-400 font-mono tracking-widest font-bold uppercase block">
                Calculated Capital Division on Base (RM {inputs.principal.toLocaleString()})
              </span>

              {allocationModel.map((item, idx) => (
                <div key={idx} className="bg-stone-950 p-4 rounded-xl border border-stone-850 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`h-2.5 w-2.5 rounded bg-gradient-to-r ${item.color}`} />
                      <h4 className="text-xs font-bold text-stone-200 font-sans">{item.class}</h4>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <span className="text-xs font-bold text-stone-100 block">
                      RM {item.value.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{item.percentage}% Share</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CEO Advisor tip */}
            <div className="mt-5 p-4 rounded-xl bg-stone-950 border border-stone-850 text-xs text-stone-400 flex items-start space-x-3 leading-relaxed">
              <Info className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-300">Gyden Portfolio Tip:</strong> In Johor Bahru's high-yield RTS developments (SA003) and primary waterfront units (SA001), maintaining a 50% Commercial / 30% Luxury residential lock has historically yielded capital inflation protection with substantial liquidity cash flows.
              </div>
            </div>

          </div>

        </div>

      </motion.div>
    </section>
  );
}
