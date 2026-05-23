export default function Footer() {
  const links = [
    { label: "Properties", id: "properties" },
    { label: "Find a Match", id: "matcher" },
    { label: "Leadership", id: "leadership" },
    { label: "AI Advisor", id: "advisor" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <footer id="global-footer" style={{ background: "#050505", borderTop: "1px solid var(--border)", paddingTop: "4rem", paddingBottom: "2rem" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 900, color: "var(--text)", letterSpacing: "0.1em" }}>GYDEN</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.22em", color: "var(--gold)", textTransform: "uppercase", marginTop: "2px" }}>Real Estate Group</div>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.75, maxWidth: "300px" }}>
              Optimized Asset Allocation & One-Stop Real Estate Solutions in Johor Bahru. Engineered under CEO Gyden Heng.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.25rem" }}>Navigation</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {links.map(link => (
                <button
                  key={link.id}
                  id={`footer-${link.id}-btn`}
                  onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })}
                  style={{
                    background: "none", border: "none", padding: 0, textAlign: "left",
                    color: "var(--text-dim)", fontSize: "0.82rem", cursor: "pointer",
                    transition: "color 0.2s", fontFamily: "var(--font-sans)"
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
          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.25rem" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
              <span>Johor Bahru, Malaysia</span>
              <span>info@gydenrec.com</span>
              <span>+60 7-XXX XXXX</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.08em", color: "var(--text-dim)" }}>
            © 2026 GYDEN Real Estate Group (GREC). All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Policy", "Terms of Service", "PDPA Compliance"].map(item => (
              <span key={item} style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.08em", color: "var(--text-dim)", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--gold)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-dim)"}
              >{item}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </footer>
  );
}
