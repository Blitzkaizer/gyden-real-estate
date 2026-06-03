import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Sparkles, RefreshCw, AlertCircle, Bookmark, ChevronRight, X, Minimize2 } from "lucide-react";
import { openPropertyDetailsModal } from "./Properties";
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
  bedrooms?: string;
  bathrooms?: string;
  pic?: string;
  rental_income?: string;
}

const ALL_PROPERTIES = ALL_PROPERTIES_RAW as unknown as Property[];

export interface ChatMessage {
  id: string;
  sender: "user" | "advisor";
  text: string;
  timestamp: Date;
  recommendedProperties?: Property[];
}

const searchProperties = (query: string): Property[] => {
  const q = query.toLowerCase();
  
  // Parse dynamic limit if specified by user (default is 3, capped at 10)
  let limit = 3;
  const countMatch = q.match(/(?:show|list|get|display|return|want)\s*(?:me\s*)?(?:some\s*)?(\d+)/i) || 
                     q.match(/(\d+)\s*(?:cheap|luxury|property|properties|listing|listings|apartment|condo|yield|villa|house|flat|shop|land)/i);
  if (countMatch) {
    const parsed = parseInt(countMatch[1]);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 10) {
      limit = parsed;
    }
  }
  
  // Specific ID Match (e.g., SA001)
  const idMatch = q.match(/sa\d+/i);
  if (idMatch) {
    const found = ALL_PROPERTIES.find(p => p.id.toLowerCase() === idMatch[0].toLowerCase());
    return found ? [found] : [];
  }
  
  let matches = [...ALL_PROPERTIES];
  let filterApplied = false;
  
  // Filter by location
  const locations = ["medini", "skudai", "danga bay", "kulai", "desaru", "permas jaya", "mount austin", "senai", "seri alam", "taman daya", "tasek", "johor bahru"];
  let matchedLocation = false;
  for (const loc of locations) {
    if (q.includes(loc)) {
      if (!matchedLocation) {
        matches = [];
        matchedLocation = true;
        filterApplied = true;
      }
      matches = [...matches, ...ALL_PROPERTIES.filter(p => p.location.toLowerCase().includes(loc) || p.title.toLowerCase().includes(loc))];
    }
  }
  
  // Remove duplicates from matches if location was matched
  if (matchedLocation) {
    matches = Array.from(new Set(matches.map(p => p.id))).map(id => ALL_PROPERTIES.find(p => p.id === id)!);
  }
  
  // Filter by budget
  if (q.includes("under") || q.includes("below") || q.includes("less") || q.includes("<") || q.includes("limit")) {
    const kMatch = q.match(/(\d+)\s*k/);
    const mMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:m|mil|million)/);
    const numMatch = q.match(/rm\s*(\d+[\d,]*)/);
    
    let budgetLimit = Infinity;
    if (kMatch) budgetLimit = parseInt(kMatch[1]) * 1000;
    else if (mMatch) budgetLimit = parseFloat(mMatch[1]) * 1000000;
    else if (numMatch) budgetLimit = parseInt(numMatch[1].replace(/,/g, ""));
    
    if (budgetLimit !== Infinity) {
      matches = matches.filter(p => p.rawPrice > 0 && p.rawPrice <= budgetLimit);
      filterApplied = true;
    }
  }
  
  // Filter by bedrooms
  const roomMatch = q.match(/(\d+)\s*(?:bedroom|room)/);
  if (roomMatch) {
    const rooms = parseInt(roomMatch[1]);
    matches = matches.filter(p => {
      const pRooms = parseInt(p.bedrooms || "0");
      return pRooms === rooms;
    });
    filterApplied = true;
  } else if (q.includes("studio")) {
    matches = matches.filter(p => p.bedrooms?.toLowerCase().includes("studio") || p.bedrooms === "1");
    filterApplied = true;
  }
  
  // Filter by yield
  if (q.includes("yield") || q.includes("roi") || q.includes("returns") || q.includes("income")) {
    matches = matches.filter(p => p.yield !== "TBC");
    matches.sort((a, b) => {
      const yA = parseFloat(a.yield) || 0;
      const yB = parseFloat(b.yield) || 0;
      return yB - yA;
    });
    filterApplied = true;
  }
  
  // Filter by type
  const types = ["apartment", "condominium", "condo", "terrace", "semi d", "semi-d", "bungalow", "villa", "shop", "land", "retail", "office", "industrial"];
  for (const t of types) {
    if (q.includes(t)) {
      const matchTerm = t === "condo" ? "condominium" : t;
      matches = matches.filter(p => p.type.toLowerCase().includes(matchTerm) || p.category.toLowerCase().includes(matchTerm));
      filterApplied = true;
      break;
    }
  }

  // Try direct text match on titles if no filter was explicitly applied
  if (!filterApplied) {
    const textMatches = ALL_PROPERTIES.filter(p => 
      q.includes(p.title.toLowerCase()) || 
      p.title.toLowerCase().split(" ").some(word => word.length > 3 && q.includes(word))
    );
    if (textMatches.length > 0) {
      matches = textMatches;
      filterApplied = true;
    }
  }

  // Check if they asked for cheap / affordable / cheapest / budget / low-cost
  const isCheapQuery = q.includes("cheap") || q.includes("affordable") || q.includes("lowest") || 
                       q.includes("budget-friendly") || q.includes("low-cost") || q.includes("low cost") || 
                       q.includes("low price") || q.includes("low-price") || q.includes("low priced") || 
                       q.includes("low-priced") || q.includes("budget") || q.includes("inexpensive") || 
                       q.includes("economical") || q.includes("reasonable");
  if (isCheapQuery) {
    matches = matches.filter(p => p.rawPrice > 0);
    matches.sort((a, b) => a.rawPrice - b.rawPrice);
    filterApplied = true;
  }

  // Check if they asked for expensive / luxury / premium / highest
  const isExpensiveQuery = q.includes("expensive") || q.includes("luxury") || q.includes("premium") || 
                           q.includes("highest price") || q.includes("highest-price") || q.includes("exclusive") || 
                           q.includes("high end") || q.includes("high-end") || q.includes("prestigious") || 
                           q.includes("elite") || q.includes("top tier") || q.includes("top-tier") || 
                           q.includes("priciest") || q.includes("most expensive");
  if (isExpensiveQuery) {
    matches = matches.filter(p => p.rawPrice > 0);
    matches.sort((a, b) => b.rawPrice - a.rawPrice);
    filterApplied = true;
  }
  
  // If NO filters or keywords were matched, and it's not a generic request for lists/recommendations
  const isGenericQuery = q.includes("property") || q.includes("properties") || q.includes("listing") || q.includes("portfolio") || q.includes("show me") || q.includes("what do you have") || q.includes("recommend");
  
  if (!filterApplied && !isGenericQuery) {
    return []; // Return empty matches for off-topic/non-real-estate queries
  }
  
  return matches.slice(0, limit); // Return top matches up to limit
};

const generateAdvisorResponse = (query: string, matches: Property[]): string => {
  const q = query.toLowerCase();
  
  // Default answers
  if (q.includes("hello") || q.includes("hi ") || q.includes("welcome") || q.includes("greetings")) {
    return "Greetings. I am your Virtual Investment Advisor, trained directly on CEO Gyden Heng's real estate models, Johor Bahru RTS corridor indicators, and optimal asset allocation. \n\nHow can I assist you in configuring your property portfolio today?";
  }
  if (q.includes("gyden") || q.includes("allocation") || q.includes("model")) {
    return "CEO Gyden Heng's standard model for property asset allocation prioritizes 60% high-yield commercial/retail hubs, 30% strategic residential assets near transit nodes (e.g. RTS corridor), and 10% liquidity cache. This ensures robust cash flow and high capital appreciation.";
  }
  if (q.includes("rts") || q.includes("transit") || q.includes("rail") || q.includes("train")) {
    return "The Rapid Transit System (RTS) Link connecting Johor Bahru to Singapore is Johor's primary capital growth catalyst. Properties within a 3km radius (like Medini Signature or Danga Bay hubs) are projected to experience 15-20% capital appreciation upon transit launch.";
  }
  if (q.includes("fee") || q.includes("legal") || q.includes("cost") || q.includes("vetting")) {
    return "GYDEN offers a complete 'One-Stop Solution' for acquisitions. Our corporate desk manages developer vetting, legal documentation reviews, title searches, and property valuation assessments to ensure zero-risk transactions.";
  }

  // Off-topic check
  const locations = ["medini", "skudai", "danga bay", "kulai", "desaru", "permas jaya", "mount austin", "senai", "seri alam", "taman daya", "tasek", "johor bahru"];
  const realEstateKeywords = ["property", "properties", "listing", "house", "apartment", "condo", "villa", "land", "shop", "rent", "buy", "invest", "yield", "roi", "price", "budget", "rm", "million", "location", "rts", "gyden", "bedroom", "bathroom", "yield", "rate", "developer", "fee", "cost", "tenure", "grec", "acquisition", "leasing", "acquisitions", "allocation", "calculator", "finance", "loan"];
  const isOffTopic = !realEstateKeywords.some(kw => q.includes(kw)) && !locations.some(loc => q.includes(loc));
  if (isOffTopic) {
    return "I am your GYDEN Real Estate Virtual Advisor, specializing in Johor Bahru acquisitions, RTS transit corridor insights, and portfolio yields. I cannot consult on external topics (such as weather, general knowledge, or climate). \n\nHow may I assist you with your property investments in Johor today?";
  }

  // If we matched properties, synthesize a highly personalized, data-driven answer
  if (matches.length > 0) {
    let response = "Based on our 300 Johor portfolios, I have conducted an asset analysis for your request:\n\n";
    
    // Check location match
    const matchedLocs = locations.filter(loc => q.includes(loc));
    if (matchedLocs.length > 0) {
      const locNames = matchedLocs.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(" & ");
      response += `• **Strategic Location (${locNames})**: We are targeting premium assets in the high-growth ${locNames} corridors. This area is highly favored for RTS corridor expansion or high-density residential leasing.\n`;
    }
    
    // Check yield match
    if (q.includes("yield") || q.includes("roi") || q.includes("returns")) {
      response += `• **Yield Maximization**: Checked portfolios with optimized cash flow profiles. The properties selected offer active rental yields or are positioned in zones with projected 5%+ yields.\n`;
    }
    
    // Check budget match
    if (q.includes("under") || q.includes("below") || q.includes("less") || q.includes("<")) {
      response += `• **Capital Preservation**: Filtered for properties below your specified price ceiling to maintain strict capital allocation budgets.\n`;
    }
    
    // Check type match
    const types = ["apartment", "condominium", "condo", "terrace", "semi d", "semi-d", "bungalow", "villa", "shop", "land", "retail", "office", "industrial"];
    const matchedTypes = types.filter(t => q.includes(t));
    if (matchedTypes.length > 0) {
      const typeName = matchedTypes.map(t => t === "condo" ? "Condominium" : t.charAt(0).toUpperCase() + t.slice(1)).join(" & ");
      response += `• **Asset Class Focus (${typeName})**: Selected premium ${typeName} units matching your yield and size specifications.\n`;
    }
    
    const propNames = matches.map(p => p.title).join(", ");
    response += `\nI have matched the following portfolios for your review: **${propNames}**.\n\nWould you like me to coordinate a site vetting, compile a full yield prospectus, or connect you to CEO Gyden Heng's desk?`;
    
    return response;
  }

  return "I have scanned our Johor databases, but could not pinpoint an exact listing matching all those parameters. Try asking for specific areas (e.g. 'Medini'), yields ('yields above 5%'), or price levels ('under 500k'). Alternatively, I can connect you directly to our CEO's advisory desk.";
};

export default function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "advisor",
      text: "Welcome to GYDEN Real Estate Group (GREC). I am your Virtual Investment Advisor, trained directly on CEO Gyden Heng's real estate models, Johor Bahru RTS corridor indicators, and optimal asset allocation. \n\nHow can I assist you in configuring your property portfolio today?",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of the chat container on new messages (prevents viewport scroll hijacking)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const presetQuestions = [
    { label: "Medini Yields > 5%", prompt: "Show me properties in Medini with yields above 5%" },
    { label: "Apartment in Prima Regency", prompt: "Show me listings in Prima Regency" },
    { label: "Gyden Allocation Vibe", prompt: "Explain CEO Gyden Heng's standard model for property asset allocation." },
    { label: "RTS Transit Impact", prompt: "How does the local RTS transit network impact property growth?" }
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || userInput;
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customText) setUserInput("");
    setIsTyping(true);

    const matches = searchProperties(textToSend);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
          relevantProperties: matches
        })
      });

      if (!response.ok) {
        throw new Error(`Server status error: ${response.status}`);
      }

      const data = await response.json();

      const advisorMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-adv",
        sender: "advisor",
        text: data.response,
        timestamp: new Date(),
        recommendedProperties: matches.length > 0 ? matches : undefined
      };

      setMessages((prev) => [...prev, advisorMsg]);
    } catch (err) {
      console.warn("Gemini Chatbot offline/error, falling back to local advisor engine:", err);
      const advisorResponse = generateAdvisorResponse(textToSend, matches);

      const advisorMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-adv",
        sender: "advisor",
        text: advisorResponse,
        timestamp: new Date(),
        recommendedProperties: matches.length > 0 ? matches : undefined
      };

      setMessages((prev) => [...prev, advisorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        id: "reset-init",
        sender: "advisor",
        text: "Conversation refreshed. I am prepared to consult on Johor water-fronts, Skudai luxury villas, and capital allocation frameworks. How can GYDEN GREC serve you?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <section id="advisor" style={{ padding: "7rem 0", background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Advising Header */}
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3rem auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--bg)", px: "14px", py: "6px", border: "1px solid var(--border-gold)", marginBottom: "1rem" }}>
            <Sparkles size={13} color="var(--gold)" />
            <span style={{ fontSize: "0.55rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Google Gemini & GREC Insights</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.8rem" }}>
            Interactive Investment Advisor
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Gain corporate consultations on acquisitions, yields, and strategic land deeds instantly. Ask anything below or choose one of our predefined client prompts.
          </p>
        </div>

        {/* Chat Console Frame */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "600px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
          
          {/* Active Status Header */}
          <div style={{ background: "var(--bg-surface)", padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", bottom: 0, right: 0, display: "block", height: "8px", width: "8px", background: "var(--gold)", border: "1px solid var(--bg)" }} />
                <div style={{ background: "var(--bg)", padding: "6px", border: "1px solid var(--border-gold)" }}>
                  <MessageSquare size={16} color="var(--gold)" />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>GYDEN IA ARCHIVE PORTAL</h4>
                <p style={{ fontSize: "0.55rem", color: "var(--gold)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>Yield and Asset Allocation Advisory</p>
              </div>
            </div>

            <button
              id="reset-chat-button"
              onClick={resetConversation}
              style={{
                fontSize: "0.58rem", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--text-muted)", background: "var(--bg)", border: "1px solid var(--border)",
                padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <RefreshCw size={11} />
              <span>Clear Ledger</span>
            </button>
          </div>

          {/* Messages Stream Wrapper */}
          <div
            ref={messagesContainerRef}
            style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem", background: "var(--bg)" }}
          >
            {messages.map((msg) => {
              const isAdvisor = msg.sender === "advisor";
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex", alignItems: "start", gap: "14px",
                    justifyContent: isAdvisor ? "flex-start" : "flex-end"
                  }}
                >
                  {isAdvisor && (
                    <div style={{ background: "var(--gold)", color: "var(--bg)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", fontWeight: 700, height: "32px", width: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      GREC
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: "75%", padding: "1.2rem", fontSize: "0.92rem", lineHeight: 1.6,
                      background: isAdvisor ? "var(--bg-surface)" : "var(--gold)",
                      color: isAdvisor ? "var(--text)" : "var(--bg)",
                      border: isAdvisor ? "1.5px solid var(--border)" : "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}
                  >
                    <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>
                    
                    {/* Render Interactive Listing Cards inside Chat */}
                    {isAdvisor && msg.recommendedProperties && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "0.8rem" }}>
                        {msg.recommendedProperties.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => openPropertyDetailsModal(p.id)}
                            style={{
                              display: "flex", gap: "1rem", background: "var(--bg-surface)",
                              border: "1.5px solid var(--border)", padding: "0.8rem", alignItems: "center",
                              cursor: "pointer", transition: "border-color 0.2s",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                          >
                            <img src={p.image} alt={p.title} style={{ width: "72px", height: "54px", objectFit: "cover", flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--gold)", textTransform: "uppercase", fontWeight: 750, letterSpacing: "0.05em" }}>{p.category} • {p.type}</div>
                              <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "2px 0" }}>{p.title}</div>
                              <div style={{ fontSize: "0.82rem", color: "var(--text)", fontWeight: 500 }}>{p.price} • Yield: <strong style={{ color: "var(--gold)" }}>{p.yield === "TBC" ? "Capital Growth" : p.yield}</strong></div>
                            </div>
                            <ChevronRight size={16} color="var(--gold)" />
                          </div>
                        ))}
                      </div>
                    )}

                    <span
                      style={{
                        fontSize: "0.68rem", display: "block", marginTop: "6px", textAlign: "right",
                        fontFamily: "var(--font-mono)", color: isAdvisor ? "var(--text-dim)" : "rgba(8,8,8,0.7)"
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!isAdvisor && (
                    <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border)", color: "var(--text)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", fontWeight: 750, height: "32px", width: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      CLIENT
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: "flex", alignItems: "start", gap: "14px" }}>
                <div style={{ background: "var(--gold)", color: "var(--bg)", fontSize: "0.55rem", fontFamily: "var(--font-mono)", fontWeight: 700, height: "32px", width: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  GREC
                </div>
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", px: "1rem", py: "0.8rem", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span className="dot animate-pulse">.</span>
                  <span className="dot animate-pulse delay-100">.</span>
                  <span className="dot animate-pulse delay-200">.</span>
                  <span>Scrutinizing asset ledgers...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Preset Prompts Row */}
          <div style={{ padding: "1rem 1.5rem", background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text)", textTransform: "uppercase", display: "block", marginBottom: "0.6rem", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
              Suggested Client Queries (Auto-fill)
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  id={`preset-prompt-${idx}`}
                  disabled={isTyping}
                  onClick={() => handleSendMessage(q.prompt)}
                  style={{
                    background: "var(--bg-surface)", color: "var(--text)",
                    border: "1.5px solid var(--gold)", fontSize: "0.74rem", padding: "8px 14px",
                    cursor: "pointer", fontFamily: "var(--font-mono)", textTransform: "uppercase",
                    letterSpacing: "0.05em", display: "inline-flex", alignItems: "center", gap: "6px",
                    fontWeight: 600, transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold-dim)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-light)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; }}
                >
                  <Bookmark size={12} color="var(--gold)" />
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Controller Prompt Input */}
          <div style={{ padding: "1rem", background: "var(--bg-surface)", borderTop: "1px solid var(--border)", display: "flex", gap: "0.8rem" }}>
            <input
              id="advisor-chat-input"
              type="text"
              placeholder={isTyping ? "Advisor is drafting a response..." : "Ask our Virtual Advisor about RTS growth, allocations..."}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              style={{
                flex: 1, background: "var(--bg-surface)", border: "1.5px solid var(--gold)",
                fontSize: "0.92rem", color: "var(--text)",
                outline: "none", transition: "border-color 0.2s", borderRadius: 0,
                padding: "0.8rem 1.2rem",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)"
              }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--gold-light)"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--gold)"}
            />
            <button
              id="advisor-send-msg-btn"
              onClick={() => handleSendMessage()}
              disabled={isTyping || !userInput.trim()}
              style={{
                px: "1.2rem", py: "0.8rem", background: "var(--gold)", color: "var(--bg)",
                fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 1.2rem"
              }}
              onMouseEnter={e => { if (!isTyping && userInput.trim()) (e.currentTarget as HTMLElement).style.background = "var(--gold-light)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; }}
            >
              <Send size={15} />
            </button>
          </div>

        </div>

      </motion.div>
    </section>
  );
}

export function FloatingAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "f-init",
      sender: "advisor",
      text: "Hello. I am your Virtual Investment Advisor. Ask me anything about our 300 Johor properties, estimated rental yields, or RTS expansion corridors.",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || userInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: "f-msg-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customText) setUserInput("");
    setIsTyping(true);

    const matches = searchProperties(textToSend);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
          relevantProperties: matches
        })
      });

      if (!response.ok) {
        throw new Error(`Server status error: ${response.status}`);
      }

      const data = await response.json();

      const advisorMsg: ChatMessage = {
        id: "f-msg-" + Date.now() + "-adv",
        sender: "advisor",
        text: data.response,
        timestamp: new Date(),
        recommendedProperties: matches.length > 0 ? matches : undefined
      };

      setMessages((prev) => [...prev, advisorMsg]);
    } catch (err) {
      console.warn("Gemini Chatbot (floating) offline/error, falling back to local advisor engine:", err);
      const advisorResponse = generateAdvisorResponse(textToSend, matches);

      const advisorMsg: ChatMessage = {
        id: "f-msg-" + Date.now() + "-adv",
        sender: "advisor",
        text: advisorResponse,
        timestamp: new Date(),
        recommendedProperties: matches.length > 0 ? matches : undefined
      };

      setMessages((prev) => [...prev, advisorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Bubble Toggle Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed", bottom: "2rem", right: "2rem", zIndex: 250,
          height: "56px", width: "56px", borderRadius: "50%", background: "var(--gold)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", transition: "transform 0.3s ease"
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={20} color="var(--bg)" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={20} color="var(--bg)" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              position: "fixed", bottom: "6.5rem", right: "2rem", zIndex: 250,
              width: "360px", height: "480px", background: "var(--bg-card)",
              border: "1px solid var(--border-gold)", boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              display: "flex", flexDirection: "column", overflow: "hidden"
            }}
          >
            {/* Header */}
            <div style={{ background: "var(--bg-surface)", padding: "0.8rem 1.2rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={13} color="var(--gold)" />
                <span style={{ fontSize: "0.62rem", fontFamily: "var(--font-mono)", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Virtual Advisor Desk</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
                <Minimize2 size={14} />
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={messagesContainerRef}
              style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem", background: "var(--bg)" }}
            >
              {messages.map((msg) => {
                const isAdvisor = msg.sender === "advisor";
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isAdvisor ? "flex-start" : "flex-end" }}>
                    <div
                      style={{
                        maxWidth: "85%", padding: "1rem", fontSize: "0.88rem", lineHeight: 1.6,
                        background: isAdvisor ? "var(--bg-surface)" : "var(--gold)",
                        color: isAdvisor ? "var(--text)" : "var(--bg)",
                        border: isAdvisor ? "1.5px solid var(--border)" : "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                      }}
                    >
                      <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>

                      {isAdvisor && msg.recommendedProperties && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.8rem", borderTop: "1px solid var(--border)", paddingTop: "0.6rem" }}>
                          {msg.recommendedProperties.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => { setIsOpen(false); openPropertyDetailsModal(p.id); }}
                              style={{
                                display: "flex", gap: "0.8rem", background: "var(--bg-surface)",
                                border: "1.5px solid var(--border)", padding: "0.6rem", alignItems: "center",
                                cursor: "pointer", transition: "border-color 0.2s",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
                              }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                            >
                              <img src={p.image} alt={p.title} style={{ width: "56px", height: "42px", objectFit: "cover", flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--gold)", textTransform: "uppercase", fontWeight: 700 }}>{p.category} • {p.type}</div>
                                <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "1px 0" }}>{p.title}</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text)" }}>{p.price}</div>
                              </div>
                              <ChevronRight size={14} color="var(--gold)" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", px: "0.8rem", py: "0.5rem", fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "3px" }}>
                    <span className="dot animate-pulse">.</span>
                    <span className="dot animate-pulse delay-100">.</span>
                    <span className="dot animate-pulse delay-200">.</span>
                    <span>Searching database...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div style={{ padding: "0.8rem", background: "var(--bg-surface)", borderTop: "1px solid var(--border)", display: "flex", gap: "6px" }}>
              <input
                type="text"
                placeholder={isTyping ? "Advisor is thinking..." : "Search yields, locations, or plots..."}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
                style={{
                  flex: 1, background: "var(--bg-surface)", border: "1.5px solid var(--gold)",
                  fontSize: "0.85rem", color: "var(--text)", outline: "none",
                  padding: "0.6rem 1rem"
                }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isTyping || !userInput.trim()}
                style={{
                  background: "var(--gold)", color: "var(--bg)", border: "none",
                  padding: "0 1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <Send size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
