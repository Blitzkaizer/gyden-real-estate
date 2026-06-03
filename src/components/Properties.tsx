import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Search, X, SlidersHorizontal, MapPin, TrendingUp, Maximize2, ChevronRight, ChevronLeft, Calendar, FileText, User } from "lucide-react";
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
  googleMap?: string;
  bedrooms?: string;
  bathrooms?: string;
  furnishing?: string;
  tenure?: string;
  lot_type?: string;
  maintenance_fee?: string;
  pic?: string;
  unit_number?: string;
  rental_income?: string;
  remarks?: string;
}

const ALL_PROPERTIES: Property[] = ALL_PROPERTIES_RAW as unknown as Property[];

const PROPERTY_TYPES = ["ALL", ...Array.from(new Set(ALL_PROPERTIES.map(p => p.type.toUpperCase()).filter(Boolean)))].sort();
const LOCATIONS = ["All Locations", ...Array.from(new Set(ALL_PROPERTIES.map(p => p.location.split(",")[0].trim()).filter(Boolean)))].sort();
const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "< RM 500K", min: 0, max: 500000 },
  { label: "RM 500K – 1M", min: 500000, max: 1000000 },
  { label: "RM 1M – 3M", min: 1000000, max: 3000000 },
  { label: "RM 3M – 5M", min: 3000000, max: 5000000 },
  { label: "RM 5M+", min: 5000000, max: Infinity },
];
const STATUS_OPTIONS = ["All Status", "Available", "Under Offer", "Joint Venture", "Sold"];

const statusColor: Record<string, string> = {
  "Available": "#4CAF50", "Under Offer": "#FF9800",
  "Joint Venture": "#2196F3", "Sold": "#9E9E9E",
};

// Global event bus or window level function to open property modal from chat
let globalOpenModal: ((id: string) => void) | null = null;
export function openPropertyDetailsModal(id: string) {
  if (globalOpenModal) {
    globalOpenModal(id);
  }
}

function PropertyModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = property.images && property.images.length > 0 ? property.images : [property.image];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 300, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "1rem",
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)"
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-card)", border: "1px solid var(--border-gold)",
          maxWidth: "750px", width: "100%", maxHeight: "90vh", overflowY: "auto"
        }}
      >
        {/* Media / Screenshot Carousel Header */}
        <div style={{ position: "relative", height: "340px", overflow: "hidden", background: "#050505" }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={imgIndex}
              src={images[imgIndex]}
              alt={`${property.title} - View ${imgIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </AnimatePresence>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 60%)", pointerEvents: "none" }} />
          
          {/* Close Button */}
          <button onClick={onClose} style={{
            position: "absolute", top: "1rem", right: "1rem", background: "rgba(8,8,8,0.7)",
            border: "1px solid var(--border)", color: "var(--text)", padding: "0.4rem",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10
          }}>
            <X size={16} />
          </button>

          {/* Carousel Arrows */}
          {images.length > 1 && (
            <>
              <button onClick={handlePrev} style={{
                position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)",
                background: "rgba(8,8,8,0.6)", border: "1px solid var(--border)", color: "var(--text)",
                padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10
              }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleNext} style={{
                position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                background: "rgba(8,8,8,0.6)", border: "1px solid var(--border)", color: "var(--text)",
                padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10
              }}>
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Carousel Slide Indicators */}
          {images.length > 1 && (
            <div style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 10 }}>
              {images.map((_, idx) => (
                <div
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setImgIndex(idx); }}
                  style={{
                    width: "6px", height: "6px", borderRadius: "50%", cursor: "pointer",
                    background: idx === imgIndex ? "var(--gold)" : "rgba(255,255,255,0.4)",
                    transition: "background 0.3s"
                  }}
                />
              ))}
            </div>
          )}

          {/* Badges Overlay */}
          <div style={{ position: "absolute", bottom: "1.2rem", left: "1.5rem", zIndex: 5 }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", padding: "2px 8px", background: "var(--gold)", color: "var(--bg)", fontWeight: 700 }}>{property.category}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", padding: "2px 8px", background: "rgba(8,8,8,0.7)", color: "var(--gold)", border: "1px solid var(--gold-border)" }}>{property.type}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}>{property.title}</h2>
          </div>
        </div>

        {/* Modal Info Content */}
        <div style={{ padding: "1.75rem" }}>
          {/* Main Specifications Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
            {[
              { label: "Selling Price", value: property.price },
              { label: "Estimated Yield", value: property.yield === "TBC" ? "TBC" : property.yield },
              { label: "Built-up Area", value: property.area },
              { label: "Tenure", value: property.tenure || "Freehold" },
              { label: "Lot Type", value: property.lot_type || "International Lot" },
              { label: "Furnishing", value: property.furnishing || "TBC" }
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 700, color: item.label === "Selling Price" || item.label === "Estimated Yield" ? "var(--gold)" : "var(--text)" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Coordinates and Location info */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={15} color="var(--gold)" />
              <span style={{ fontSize: "0.92rem", color: "var(--text)", fontWeight: 500 }}>{property.location}</span>
            </div>
            {property.googleMap && (
              <a href={property.googleMap} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.08em",
                color: "var(--gold)", border: "1px solid var(--gold-border)", padding: "4px 10px",
                textDecoration: "none", textTransform: "uppercase", transition: "all 0.2s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold-dim)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                View on Google Maps ↗
              </a>
            )}
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            {property.description || `A premium ${property.type.toLowerCase()} situated in the key development hub of ${property.location}. Offers excellent accessibility and solid capital growth prospects in the Johor Bahru real estate corridor.`}
          </p>

          {/* Features list */}
          {property.features && property.features.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Key Features</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {property.features.map(f => (
                  <span key={f} style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.05em", padding: "6px 12px", border: "1px solid var(--border)", color: "var(--text-muted)", background: "var(--bg-surface)" }}>✓ {f}</span>
                ))}
              </div>
            </div>
          )}

          {/* PIC & Unit Information (Internal Desk Info) */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", padding: "1rem", marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.3rem" }}>
                <User size={14} color="var(--gold)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>Advisor in Charge</span>
              </div>
              <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text)" }}>{property.pic || "Gyden Heng"}</span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.3rem" }}>
                <FileText size={14} color="var(--gold)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>Lot / Unit Number</span>
              </div>
              <span style={{ fontSize: "0.92rem", fontWeight: 650, color: "var(--text)", fontFamily: "var(--font-mono)" }}>{property.unit_number || "TBC"}</span>
            </div>
            {property.maintenance_fee && property.maintenance_fee !== "TBC" && (
              <div style={{ gridColumn: "span 2" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.3rem" }}>
                  <Calendar size={14} color="var(--gold)" />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>Maintenance Fee</span>
                </div>
                <span style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>{property.maintenance_fee}</span>
              </div>
            )}
          </div>

          <button
            id={`modal-contact-${property.id}`}
            onClick={() => {
              onClose();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              width: "100%", padding: "0.9rem",
              background: "var(--gold)", color: "var(--bg)", border: "none",
              fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold-light)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; }}
          >
            Enquire About This Property
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PropertyCard({ property, index, onSelect }: { property: Property; index: number; onSelect: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 12) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", overflow: "hidden", transition: "border-color 0.3s" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-border)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
      onClick={onSelect}
      id={`property-card-${property.id}`}
    >
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        <img src={property.image} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
          onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"}
          onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.75) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", gap: "0.4rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", padding: "3px 8px", background: "var(--gold)", color: "var(--bg)", fontWeight: 700 }}>{property.category}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", padding: "3px 8px", background: "rgba(8,8,8,0.85)", color: "var(--gold)", border: "1px solid var(--gold-border)" }}>{property.type}</span>
        </div>
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "3px 8px",
            background: "rgba(8,8,8,0.85)", color: statusColor[property.status] || "#ccc",
            border: `1px solid ${statusColor[property.status] || "#ccc"}40`
          }}>{property.status}</span>
        </div>
      </div>
      <div style={{ padding: "1.4rem" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>{property.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "1rem" }}>
          <MapPin size={11} color="var(--text-muted)" />
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{property.location}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
          {[{ icon: <span style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: 700 }}>RM</span>, label: "Price", value: property.price.replace("RM ", "").replace("RM", "") },
            { icon: <TrendingUp size={11} color="var(--gold)" />, label: "Yield", value: property.yield },
            { icon: <Maximize2 size={11} color="var(--gold)" />, label: "Area", value: property.area }
          ].map(item => (
            <div key={item.label}>
              <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>{item.icon}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text)" }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "6px", color: "var(--gold)", fontSize: "0.82rem", fontWeight: 600 }}>
          <span>View Details</span><ChevronRight size={13} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Properties() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [priceFilter, setPriceFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Pagination
  const [visibleCount, setVisibleCount] = useState(12);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Reset pagination when any filter changes
  useEffect(() => {
    setVisibleCount(12);
  }, [search, typeFilter, locationFilter, priceFilter, statusFilter]);

  // Hook up global open modal function
  useEffect(() => {
    globalOpenModal = (id: string) => {
      const found = ALL_PROPERTIES.find(p => p.id.toLowerCase() === id.toLowerCase());
      if (found) {
        setSelectedProperty(found);
      }
    };
    return () => {
      globalOpenModal = null;
    };
  }, []);

  const filtered = useMemo(() => {
    const priceRange = PRICE_RANGES[priceFilter];
    return ALL_PROPERTIES.filter(p => {
      const matchSearch = !search || 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) || 
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "ALL" || p.type.toUpperCase() === typeFilter.toUpperCase();
      const matchLocation = locationFilter === "All Locations" || p.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchPrice = p.rawPrice >= priceRange.min && p.rawPrice <= priceRange.max;
      const matchStatus = statusFilter === "All Status" || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchType && matchLocation && matchPrice && matchStatus;
    });
  }, [search, typeFilter, locationFilter, priceFilter, statusFilter]);

  const selectStyle: React.CSSProperties = {
    background: "var(--bg-surface)", border: "1.5px solid var(--gold)",
    color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.82rem",
    padding: "0.6rem 1.2rem", cursor: "pointer", appearance: "none" as const,
    WebkitAppearance: "none", outline: "none", minWidth: "160px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
  };

  const visibleProperties = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  return (
    <section id="properties" style={{ padding: "7rem 0", background: "var(--bg)" }}>
      <div className="container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "3.5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
            <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold)" }} />
            <span className="section-label">Portfolio Database</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.1 }}>
              Current Listings
            </h2>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>
              {filtered.length} PROPERT{filtered.length !== 1 ? "IES" : "Y"} FOUND
            </span>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ marginBottom: "3rem" }}
        >
          {/* Search Bar */}
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <Search size={16} color="var(--text-dim)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
            <input
              id="property-search-input"
              type="text"
              placeholder="Search by name, location or property ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "0.9rem 1rem 0.9rem 2.8rem",
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.88rem",
                outline: "none", transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--gold-border)"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}>
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            id="filter-toggle-btn"
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "none", border: "1px solid var(--border)", color: "var(--text-muted)",
              padding: "0.55rem 1rem", fontSize: "0.75rem", cursor: "pointer",
              fontFamily: "var(--font-sans)", letterSpacing: "0.05em"
            }}
          >
            <SlidersHorizontal size={14} />
            {filtersOpen ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filters Row */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                  {/* Type Filter */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Type:</span>
                    {PROPERTY_TYPES.map(t => (
                      <button
                        key={t}
                        id={`type-filter-${t}`}
                        onClick={() => setTypeFilter(t)}
                        style={{
                          padding: "6px 12px", fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                          letterSpacing: "0.08em", cursor: "pointer", border: "1.5px solid",
                          borderColor: typeFilter === t ? "var(--gold)" : "var(--border)",
                          background: typeFilter === t ? "var(--gold-dim)" : "var(--bg-surface)",
                          color: typeFilter === t ? "var(--gold)" : "var(--text-muted)",
                          fontWeight: typeFilter === t ? 700 : 500,
                          transition: "all 0.2s"
                        }}
                      >{t}</button>
                    ))}
                  </div>

                  {/* Location */}
                  <select id="location-filter" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={selectStyle}>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>

                  {/* Price */}
                  <select id="price-filter" value={priceFilter} onChange={e => setPriceFilter(Number(e.target.value))} style={selectStyle}>
                    {PRICE_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
                  </select>

                  {/* Status */}
                  <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>

                  {/* Clear */}
                  <button
                    id="clear-filters-btn"
                    onClick={() => { setSearch(""); setTypeFilter("ALL"); setLocationFilter("All Locations"); setPriceFilter(0); setStatusFilter("All Status"); }}
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", background: "none", border: "none", color: "var(--text)", fontWeight: 600, cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "underline" }}
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Property Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-dim)" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", marginBottom: "0.5rem" }}>No properties match your criteria.</p>
            <p style={{ fontSize: "0.85rem" }}>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {visibleProperties.map((p, i) => (
                <React.Fragment key={p.id}>
                  <PropertyCard property={p} index={i} onSelect={() => setSelectedProperty(p)} />
                </React.Fragment>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filtered.length && (
              <div style={{ textAlign: "center", marginTop: "4rem" }}>
                <button
                  id="load-more-btn"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  style={{
                    padding: "0.85rem 2.2rem", background: "transparent", border: "1px solid var(--border-gold)",
                    color: "var(--gold)", fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold-dim)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  Load More Listings
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Global Property details modal */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
