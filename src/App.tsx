import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PropertiesList from "./components/PropertiesList";
import Calculators from "./components/Calculators";
import AgentChat from "./components/AgentChat";
import ContactForm from "./components/ContactForm";
import { Property } from "./types";
import { Briefcase, MapPin, Building, ShieldCheck, Mail, ShieldAlert } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("hero");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Fetch properties from our dedicated Express API routes
  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await fetch("/api/properties");
        if (!response.ok) {
          throw new Error("Failed to consult property server directories.");
        }
        const data = await response.json();
        setProperties(data.properties || []);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        // Fallback properties matching exact Gyden website
        setProperties([
          {
            id: "SA001",
            title: "Danga Bay Commercial Hub",
            category: "Commercial",
            price: "RM 4,200,000",
            rawPrice: 4200000,
            area: "8,500 sqft",
            location: "Danga Bay, Johor Bahru",
            yield: "6.8%",
            status: "Available / Premium",
            description: "Centrally located multi-level retail and office plot featuring waterfront views and direct expressway connectivity. Excellent for corporate headquarters, high-traffic showrooms, or co-working setups.",
            documents: [
              { name: "Investment Brochure.pdf", type: "Brochure", size: "2.4 MB", previewContent: "GYDEN Real Estate Group (GREC). Danga Bay Commercial Plot SA001. Valuation: RM 4.2M. Projected yearly growth: ~7.2%. Footfall: 15,000 daily average." }
            ],
            features: ["Waterfront View", "Main Road Frontage", "3-Phase Power"]
          },
          {
            id: "SA002",
            title: "Skudai Luxury Villa",
            category: "Residential",
            price: "RM 2,850,000",
            rawPrice: 2850000,
            area: "6,200 sqft",
            location: "Skudai Elite Heights, Johor Bahru",
            yield: "4.5%",
            status: "Under Offer / Exclusive",
            description: "An elegant, bespoke 5-bedroom luxury villa with smart-home systems and a landscaped infinity plunge pool. Built with top-grade Burmese teak and Italian marble.",
            documents: [
              { name: "SA002 Land_Title_Deed.pdf", type: "Legal Deed", size: "4.1 MB", previewContent: "Geran Hakmilik Kekal (Freehold Land Title). Lot Number 14088, Mukim Pulai. Area: 7,500 sqft plot size." }
            ],
            features: ["Freehold Title", "Gated & Guarded", "Private Plunge Pool"]
          },
          {
            id: "SA003",
            title: "JB Central Office Plot",
            category: "Industrial / Land",
            price: "RM 7,900,000",
            rawPrice: 7900000,
            area: "2.1 Acres",
            location: "Johor Bahru CBD Central",
            yield: "8.2% (Development Potential)",
            status: "Available for Joint Venture",
            description: "An ultra-rare premium commercial land zone in the direct heart of the Johor Bahru Central region, ideal for corporate high-rise development or high-density logistics warehousing.",
            documents: [
              { name: "RTS_Link_Feasibility_Analysis.pdf", type: "Analysis", size: "5.5 MB", previewContent: "GREC Research Division: Economic impacts of the Johor RTS Corridor on Lot SA003 Central. Expected capital appreciation: +25% minimum." }
            ],
            features: ["RTS Link Corridor", "Commercial High-Density Zoning"]
          }
        ]);
      } finally {
        setLoadingProperties(false);
      }
    }
    loadProperties();
  }, []);

  const handleExploreProperties = () => {
    setActiveTab("properties");
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConsultAdvisor = () => {
    setActiveTab("advisor");
    document.getElementById("advisor")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 selection:bg-emerald-500 selection:text-stone-950 font-sans">
      {/* Premium Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Single-Scroll Layout sections */}
      <main className="relative">
        <Hero 
          onExploreProperties={handleExploreProperties} 
          onConsultAdvisor={handleConsultAdvisor} 
        />
        
        <Calculators />
        
        <PropertiesList 
          properties={properties} 
          loading={loadingProperties} 
        />
        
        <AgentChat />
        
        <ContactForm />
      </main>

      {/* Footer System */}
      <footer id="global-footer" className="bg-stone-950 border-t border-stone-900 py-12 relative z-10 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center select-none -ml-4">
                <svg viewBox="0 0 240 70" className="h-[52px] w-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="120" y="34" textAnchor="middle" fill="#FFFFFF" fontFamily="'Inter', 'Space Grotesk', system-ui, sans-serif" fontWeight="900" fontSize="34" letterSpacing="1">GYDEN</text>
                  <path d="M 22 47.5 Q 41 46.2 60 47.5 Q 41 48.8 22 47.5 Z" fill="#E5e7eb" opacity="0.9" />
                  <text x="120" y="51.5" textAnchor="middle" fill="#E5e7eb" fontFamily="'Inter', system-ui, sans-serif" fontWeight="700" fontSize="8" letterSpacing="2.8" opacity="0.95">REAL ESTATE GROUP</text>
                  <path d="M 180 47.5 Q 199 46.2 218 47.5 Q 199 48.8 180 47.5 Z" fill="#E5e7eb" opacity="0.9" />
                </svg>
              </div>
              <p className="text-stone-500 leading-relaxed max-w-sm">
                Optimized Asset Allocation & One-Stop Real Estate Solutions in Johor Bahru. Re-engineered under CEO Gyden Heng.
              </p>
            </div>

            <div className="md:col-span-4 font-mono space-y-2">
              <span className="text-[10px] text-stone-500 uppercase font-bold block mb-3">Sectors & Capabilities</span>
              <ul className="space-y-1">
                <li>• Commercial Waterfront Hubs (SA001)</li>
                <li>• High-Growth Transit Corridors (SA003)</li>
                <li>• Freehold Premium Residential Plots (SA002)</li>
                <li>• Real-Time Asset Allocation Modeling</li>
              </ul>
            </div>

            <div className="md:col-span-4 font-mono space-y-2">
              <span className="text-[10px] text-stone-500 uppercase font-bold block mb-3">Regulatory Archive Guard</span>
              <div className="bg-stone-900/50 p-3.5 rounded-lg border border-stone-850 space-y-2 text-[10px] leading-relaxed text-stone-450 text-stone-400">
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-bold">GREC Audit Compliance Verified</span>
                </div>
                <span>Asset pricing conforms directly to raw developer agreements and legal freehold mandates in Johor, Malaysia.</span>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-stone-605 text-stone-500">
            <span>© 2026 GYDEN Real Estate Group (GREC). All rights reserved.</span>
            <div className="flex space-x-4">
              <span className="hover:text-emerald-400 cursor-pointer">Security Protocol v4.3</span>
              <span>•</span>
              <span className="hover:text-emerald-400 cursor-pointer">Johor Representative Desk Portal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
