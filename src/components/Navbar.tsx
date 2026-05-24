import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navLinks = [
  { id: "properties", label: "Properties" },
  { id: "matcher", label: "Find a Match" },
  { id: "leadership", label: "Leadership" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        id="navbar"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? "0.9rem 0" : "1.4rem 0",
          background: scrolled ? "var(--bg-surface)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          {/* Logo */}
          <button
            onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            id="navbar-logo-btn"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{
                fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 900,
                color: scrolled ? "var(--text)" : "#FFFFFF", letterSpacing: "0.12em",
                transition: "color 0.3s ease"
              }}>GYDEN</span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.22em",
                color: "var(--gold)", textTransform: "uppercase"
              }}>Real Estate Group</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2.5rem" }} className="desktop-nav">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-${link.id}-btn`}
                onClick={() => handleNav(link.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 500,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: activeSection === link.id ? "var(--gold)" : (scrolled ? "var(--text-muted)" : "rgba(255, 255, 255, 0.8)"),
                  transition: "color 0.2s",
                  position: "relative", padding: "4px 0",
                }}
                onMouseEnter={e => { if (activeSection !== link.id) (e.target as HTMLElement).style.color = scrolled ? "var(--text)" : "#FFFFFF"; }}
                onMouseLeave={e => { if (activeSection !== link.id) (e.target as HTMLElement).style.color = scrolled ? "var(--text-muted)" : "rgba(255, 255, 255, 0.8)"; }}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span layoutId="nav-underline" style={{
                    position: "absolute", bottom: -2, left: 0, right: 0,
                    height: "1px", background: "var(--gold)"
                  }} />
                )}
              </button>
            ))}
            <button
              id="nav-consult-btn"
              onClick={() => handleNav("contact")}
              style={{
                padding: "0.55rem 1.4rem",
                background: "transparent", border: scrolled ? "1px solid var(--gold-border)" : "1px solid var(--gold)",
                color: scrolled ? "var(--gold)" : "#FFFFFF", fontFamily: "var(--font-sans)", fontSize: "0.8rem",
                fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.25s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "#FFFFFF"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = scrolled ? "var(--gold)" : "#FFFFFF"; }}
            >
              Book Consultation
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            style={{ background: "none", border: "none", color: scrolled ? "var(--text)" : "#FFFFFF", cursor: "pointer", display: "none", transition: "color 0.3s ease" }}
            className="mobile-menu-btn"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "var(--bg-surface)", backdropFilter: "blur(24px)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "2rem",
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            >
              <X size={24} />
            </button>
            {navLinks.map((link, i) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleNav(link.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700,
                  color: "var(--text)", letterSpacing: "0.02em",
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
