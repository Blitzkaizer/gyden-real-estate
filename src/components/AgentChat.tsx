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
    <section id="advisor" className="py-24 bg-stone-900 border-t border-stone-800 text-stone-100">
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
        {/* Advising Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-stone-950 px-3 py-1.5 rounded-full border border-stone-850 mb-3.5">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-mono text-stone-300">Google Gemini & GREC Insights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Interactive Investment Advisor
          </h2>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed">
            Gain corporate consultations on acquisitions, yields, and strategic land deeds instantly. Ask anything below or choose one of our predefined client prompts.
          </p>
        </div>

        {/* Chat Console Frame */}
        <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
          
          {/* Active Status Header */}
          <div className="bg-stone-900/90 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-stone-950" />
                <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
                  <MessageSquare className="h-4.5 w-4.5 text-emerald-400" />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-100 font-mono tracking-wide">GYDEN IA ARCHIVE PORTAL</h4>
                <p className="text-[10px] text-stone-405 text-stone-400">Yield and Asset Allocation Advisory</p>
              </div>
            </div>

            <button
              id="reset-chat-button"
              onClick={resetConversation}
              className="text-[11px] font-mono text-stone-450 text-stone-400 hover:text-emerald-400 flex items-center space-x-1.5 px-2.5 py-1 rounded bg-stone-950 border border-stone-850 cursor-pointer"
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
                    <div className="bg-emerald-500 text-stone-950 text-[10px] font-mono font-bold h-7.5 w-7.5 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                      GREC
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-xl p-4 text-xs leading-relaxed font-sans ${
                      isAdvisor
                        ? "bg-stone-900 text-stone-250 border border-stone-870 text-stone-300"
                        : "bg-emerald-500 text-stone-950 font-medium"
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
                    <div className="bg-stone-800 text-stone-300 text-[10px] uppercase font-mono font-bold h-7.5 w-7.5 rounded-lg flex items-center justify-center shrink-0">
                      C
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start space-x-3.5">
                <div className="bg-emerald-500 text-stone-950 text-[10px] font-mono font-bold h-7.5 w-7.5 rounded-lg flex items-center justify-center shrink-0 animate-pulse">
                  GREC
                </div>
                <div className="bg-stone-900 border border-stone-850 rounded-xl px-4 py-3 text-xs text-stone-400 font-mono flex items-center space-x-2">
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
          <div className="px-6 py-2 bg-stone-950 border-t border-stone-900">
            <span className="text-[9px] font-bold text-stone-500 uppercase block mb-1.5 font-mono">
              Suggested Client Queries (Auto-fill)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  id={`preset-prompt-${idx}`}
                  disabled={isTyping}
                  onClick={() => handleSendMessage(q.prompt)}
                  className="bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-850 text-[10px] px-2.5 py-1.5 rounded-lg text-left transition-colors font-mono hover:text-emerald-400 inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Bookmark className="h-3 w-3 inline text-emerald-500/70" />
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Controller Prompt Input */}
          <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center gap-3">
            <input
              id="advisor-chat-input"
              type="text"
              placeholder={isTyping ? "Advisor is drafting a response..." : "Ask our Virtual Advisor about RTS growth, allocations..."}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-stone-150 text-xs focus:outline-none focus:border-emerald-500/50 transition-all font-sans text-stone-200"
            />
            <button
              id="advisor-send-msg-btn"
              onClick={() => handleSendMessage()}
              disabled={isTyping || !userInput.trim()}
              className="px-4 py-2.5 bg-emerald-500 text-stone-950 font-bold rounded-lg hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Offline simulated warning element */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2.5 font-mono">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

      </motion.div>
    </section>
  );
}
