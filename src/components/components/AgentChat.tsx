import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { MessageSquare, Send, Sparkles, RefreshCw, AlertCircle, Bookmark } from "lucide-react";
import { ChatMessage } from "../types";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const isFirstMount = useRef(true);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const presetQuestions = [
    { label: "RTS Corridor & Land SA003", prompt: "How does the local RTS transit network impact the central land SA003 plot?" },
    { label: "Highest Rental Yield Asset", prompt: "Which of your Johor Bahru listings offers the highest rental yield and why?" },
    { label: "Gyden Allocation Vibe", prompt: "Explain CEO Gyden Heng's standard model for property asset allocation." },
    { label: "Waterfront Commercial SA001", prompt: "What are the specs and tenant models for Danga Bay Hub SA001?" }
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

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setUserInput("");
    setIsTyping(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages.map(m => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Endpoint returned invalid status code");
      }

      const data = await response.json();
      
      const advisorMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-adv",
        sender: "advisor",
        text: data.response || "I am currently compiling latest quarterly Johore valuation audits. Let's connect further!",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, advisorMsg]);
    } catch (err: any) {
      console.error("Chat fetch error:", err);
      
      // Fallback response for demo
      const fallbackMsg: ChatMessage = {
        id: "fallback-" + Date.now(),
        sender: "advisor",
        text: "Under Gyden Heng's leadership, we prioritize immediate communication. (Demo Mode) The RTS Link Corridor (SA003) and Danga Bay (SA001) are Johor's major growth centers. To discuss customized yields, please verify your server key or submit your strategy via the Contact form below!",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setErrorMessage("System is running in simulated mode. Verify your GEMINI_API_KEY inside the Settings Secrets panel if needed.");
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
    setErrorMessage(null);
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
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-[#080808] px-3.5 py-1.5 rounded-none border border-[var(--gold-border)] mb-3.5">
            <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span className="text-[9px] font-mono text-stone-300 uppercase tracking-widest font-bold">Google Gemini & GREC Insights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-normal font-serif tracking-tight text-white">
            Interactive Investment Advisor
          </h2>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed">
            Gain corporate consultations on acquisitions, yields, and strategic land deeds instantly. Ask anything below or choose one of our predefined client prompts.
          </p>
        </div>

        {/* Chat Console Frame */}
        <div className="bg-[#0c0c0c] border border-stone-850 rounded-none shadow-2xl flex flex-col h-[580px]">
          
          {/* Active Status Header */}
          <div className="bg-[#111111] px-6 py-4 border-b border-stone-850 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-none bg-[var(--gold)] ring-1 ring-stone-950" />
                <div className="bg-stone-900 p-2 rounded-none border border-[var(--gold-border)]">
                  <MessageSquare className="h-4 w-4 text-[var(--gold)]" />
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-white font-mono tracking-widest uppercase">GYDEN IA ARCHIVE PORTAL</h4>
                <p className="text-[9px] text-[var(--gold)] font-mono uppercase tracking-wider mt-0.5">Yield and Asset Allocation Advisory</p>
              </div>
            </div>

            <button
              id="reset-chat-button"
              onClick={resetConversation}
              className="text-[9px] font-mono tracking-widest uppercase text-stone-400 hover:text-[var(--gold)] flex items-center space-x-1.5 px-3 py-1.5 bg-[#080808] border border-stone-800 rounded-none cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Clear Ledger</span>
            </button>
          </div>

          {/* Messages Stream Wrapper */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[380px]">
            {messages.map((msg) => {
              const isAdvisor = msg.sender === "advisor";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3.5 ${
                    isAdvisor ? "justify-start" : "justify-end"
                  }`}
                >
                  {isAdvisor && (
                    <div className="bg-[var(--gold)] text-stone-950 text-[9px] font-mono font-bold h-8 w-8 rounded-none flex items-center justify-center shrink-0">
                      GREC
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-none p-4 text-xs leading-relaxed font-sans ${
                      isAdvisor
                        ? "bg-[#111111] text-stone-200 border border-stone-850"
                        : "bg-[var(--gold)] text-stone-950 font-medium"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1.5 text-right font-mono font-normal ${
                        isAdvisor ? "text-stone-500" : "text-stone-800"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!isAdvisor && (
                    <div className="bg-stone-900 border border-stone-800 text-stone-300 text-[9px] uppercase font-mono font-bold h-8 w-8 rounded-none flex items-center justify-center shrink-0">
                      C
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start space-x-3.5">
                <div className="bg-[var(--gold)] text-stone-950 text-[9px] font-mono font-bold h-8 w-8 rounded-none flex items-center justify-center shrink-0 animate-pulse">
                  GREC
                </div>
                <div className="bg-[#111111] border border-stone-850 rounded-none px-4 py-3 text-xs text-stone-400 font-mono flex items-center space-x-2">
                  <span className="dot animate-bounce">.</span>
                  <span className="dot animate-bounce delay-100">.</span>
                  <span className="dot animate-bounce delay-200">.</span>
                  <span>Scrutinizing asset ledgers...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Preset Prompts Row */}
          <div className="px-6 py-3 bg-[#080808] border-t border-stone-850">
            <span className="text-[8px] font-bold text-stone-500 uppercase block mb-2 font-mono tracking-widest">
              Suggested Client Queries (Auto-fill)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  id={`preset-prompt-${idx}`}
                  disabled={isTyping}
                  onClick={() => handleSendMessage(q.prompt)}
                  className="bg-[#111111] hover:bg-[#161616] text-stone-300 border border-stone-850 hover:border-[var(--gold)] text-[9px] px-3 py-2 rounded-none text-left transition-all font-mono hover:text-[var(--gold)] inline-flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Bookmark className="h-3 w-3 inline text-[var(--gold)]/70" />
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Controller Prompt Input */}
          <div className="p-4 bg-[#111111] border-t border-stone-850 flex items-center gap-3">
            <input
              id="advisor-chat-input"
              type="text"
              placeholder={isTyping ? "Advisor is drafting a response..." : "Ask our Virtual Advisor about RTS growth, allocations..."}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              className="flex-1 bg-[#080808] border border-stone-800 rounded-none px-4 py-3 text-xs text-white placeholder-stone-600 outline-none focus:border-[var(--gold)] transition-all font-sans"
            />
            <button
              id="advisor-send-msg-btn"
              onClick={() => handleSendMessage()}
              disabled={isTyping || !userInput.trim()}
              className="px-5 py-3 bg-[var(--gold)] text-stone-950 font-bold rounded-none hover:bg-[var(--gold-light)] transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Offline simulated warning element */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-stone-900 border border-stone-800 text-[var(--gold)] text-[10px] rounded-none flex items-center space-x-2.5 font-mono tracking-wide">
            <AlertCircle className="h-4 w-4 shrink-0 text-[var(--gold)]" />
            <span>{errorMessage}</span>
          </div>
        )}

      </motion.div>
    </section>
  );
}
