import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Metrics from "./components/Metrics";
import Properties from "./components/Properties";
import PropertyMatcher from "./components/PropertyMatcher";
import Leadership from "./components/Leadership";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

const SECTIONS = ["hero", "metrics", "properties", "matcher", "leadership", "contact"];

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Navbar
        activeSection={activeSection}
        onNavigate={(id) => {
          setActiveSection(id);
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <main>
        <Hero />
        <Metrics />
        <Properties />
        <PropertyMatcher />
        <Leadership />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
