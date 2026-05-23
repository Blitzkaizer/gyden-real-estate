import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navLinks = [
  { id: "properties", label: "Properties" },
  { id: "matcher", label: "Find a Match" },
  { id: "leadership", label: "Leadership" },
  { id: "advisor", label: "AI Advisor" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

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
          background: scrolled ? "rgba(8,8,8,0.97)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(201,169,110,0.12)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button
            onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            id="navbar-logo-btn"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{
                fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 900,
                color: "var(--text)", letterSpacing: "0.12em"
              }}>GYDEN</span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.48rem", letterSpacing: "0.22em",
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
                  fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 500,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: activeSection === link.id ? "var(--gold)" : "var(--text-muted)",
                  transition: "color 0.2s",
                  position: "relative", padding: "4px 0",
                }}
                onMouseEnter={e => { if (activeSection !== link.id) (e.target as HTMLElement).style.color = "var(--text)"; }}
                onMouseLeave={e => { if (activeSection !== link.id) (e.target as HTMLElement).style.color = "var(--text-muted)"; }}
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
                background: "transparent", border: "1px solid var(--gold-border)",
                color: "var(--gold)", fontFamily: "var(--font-sans)", fontSize: "0.75rem",
                fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.25s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--bg)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
            >
              Book Consultation
            </button>
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              style={{
                background: "none", border: "none", color: "var(--gold)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                padding: "8px", marginLeft: "0.5rem"
              }}
              title="Toggle light/dark mode"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", display: "none" }}
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
              background: "rgba(8,8,8,0.98)", backdropFilter: "blur(24px)",
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
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.08 }}
              onClick={toggleTheme}
              style={{
                background: "none", border: "1px solid var(--gold-border)",
                color: "var(--gold)", fontFamily: "var(--font-sans)", fontSize: "0.85rem",
                fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "0.6rem 1.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                marginTop: "1rem"
              }}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </motion.button>
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
