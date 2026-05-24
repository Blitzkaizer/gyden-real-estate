export default function Footer() {
  const links = [
    { label: "Properties", id: "properties" },
    { label: "Find a Match", id: "matcher" },
    { label: "Leadership", id: "leadership" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <footer id="global-footer" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", paddingTop: "4rem", paddingBottom: "2.5rem" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }} className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 900, color: "var(--text)", letterSpacing: "0.1em" }}>GYDEN</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.22em", color: "var(--gold)", textTransform: "uppercase", marginTop: "2px" }}>Real Estate Group</div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.75, maxWidth: "360px" }}>
              Optimized Asset Allocation & One-Stop Real Estate Solutions in Johor Bahru. Engineered under CEO Gyden Heng.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-nav">
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.25rem", fontWeight: 700 }}>Navigation</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-start" }}>
              {links.map(link => (
                <button
                  key={link.id}
                  id={`footer-${link.id}-btn`}
                  onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })}
                  style={{
                    background: "none", border: "none", padding: 0, textAlign: "left",
                    color: "var(--text-dim)", fontSize: "0.85rem", cursor: "pointer",
                    transition: "color 0.2s", fontFamily: "var(--font-sans)", display: "block"
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--gold)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-dim)"}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.25rem", fontWeight: 700 }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
              <span>Johor Bahru, Malaysia, 81750</span>
              <a href="mailto:gydenheng@gmail.com" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s", wordBreak: "break-all" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}>gydenheng@gmail.com</a>
              <a href="tel:+60149840409" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}>+60 14-984 0409</a>
              <a href="https://www.facebook.com/GydenPage/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "none", fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: "bold", marginTop: "0.5rem", display: "inline-flex", alignItems: "center", gap: "4px", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold-light)"} onMouseLeave={e => e.currentTarget.style.color = "var(--gold)"}>
                Facebook Page
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom" style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.08em", color: "var(--text-dim)" }}>
            © 2026 GYDEN Real Estate Group (GREC). All rights reserved.
          </span>
          <div className="footer-bottom-links" style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Policy", "Terms of Service", "PDPA Compliance"].map(item => (
              <span key={item} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.08em", color: "var(--text-dim)", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--gold)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-dim)"}
              >{item}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2.5rem !important; }
          .footer-brand { grid-column: span 2; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .footer-brand { grid-column: span 1; }
          .footer-bottom { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .footer-bottom-links { justify-content: center !important; }
        }
      `}</style>
    </footer>
  );
}
