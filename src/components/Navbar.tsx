import { useState, useEffect } from "react";
import { Building2, TrendingUp, Inbox, Calendar, MessageSquare, ChevronRight, Menu, X } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Executive Desk", icon: Building2 },
    { id: "strategies", label: "Investment Strategies", icon: TrendingUp },
    { id: "allocation", label: "Asset Allocation", icon: Inbox },
    { id: "properties", label: "Property & Document Database", icon: Calendar },
    { id: "advisor", label: "Interactive Advisor", icon: MessageSquare },
  ];

  return (
    <nav
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-stone-900/95 backdrop-blur-md shadow-lg border-b border-stone-800 py-3"
          : "bg-gradient-to-b from-stone-950/80 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Text */}
          <div className="flex items-center cursor-pointer select-none" onClick={() => setActiveTab("hero")}>
            <svg viewBox="0 0 240 70" className="h-[52px] w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="120" y="34" textAnchor="middle" fill="#FFFFFF" fontFamily="'Inter', 'Space Grotesk', system-ui, sans-serif" fontWeight="900" fontSize="34" letterSpacing="1.5">GYDEN</text>
              <path d="M 22 47.5 Q 41 46.2 60 47.5 Q 41 48.8 22 47.5 Z" fill="#E5E7EB" opacity="0.9" />
              <text x="120" y="51.5" textAnchor="middle" fill="#E5E7EB" fontFamily="'Inter', system-ui, sans-serif" fontWeight="700" fontSize="8" letterSpacing="2.8" opacity="0.95">REAL ESTATE GROUP</text>
              <path d="M 180 47.5 Q 199 46.2 218 47.5 Q 199 48.8 180 47.5 Z" fill="#E5E7EB" opacity="0.9" />
            </svg>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none ${
                    isActive
                       ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.12)]"
                       : "text-stone-300 hover:text-amber-400 hover:bg-stone-800/40"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Call / Contact Button */}
          <div className="hidden md:block">
            <button
              id="cta-contact-button"
              onClick={() => {
                setActiveTab("contact");
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-200 flex items-center space-x-1 cursor-pointer"
            >
              <span>Schedule Advisor</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-stone-400 hover:text-stone-100 hover:bg-stone-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-navigation-panel" className="md:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-4 space-y-1 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400 font-semibold border-l-2 border-amber-500 pl-3.5"
                    : "text-stone-300 hover:bg-stone-800/50 hover:text-amber-400"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            id="mobile-nav-contact"
            onClick={() => {
              setActiveTab("contact");
              setIsOpen(false);
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-center rounded-lg shadow-md block cursor-pointer"
          >
            Schedule Consultation (GREC)
          </button>
        </div>
      )}
    </nav>
  );
}
