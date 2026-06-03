import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Ensure Gemini Client is initialized safely
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;
if (key) {
  ai = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined. AI Consultant will operate in mock/offline mode.");
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Load properties from JSON database
let properties: any[] = [];
try {
  const jsonPath = path.join(process.cwd(), "src/data/properties_data.json");
  if (fs.existsSync(jsonPath)) {
    properties = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log(`Successfully loaded ${properties.length} properties from JSON database.`);
  } else {
    console.error("Properties JSON file not found at:", jsonPath);
  }
} catch (e) {
  console.error("Failed to load properties JSON:", e);
}

// Profile database for system instruction statistics
let propertyStatsSummary = "";
if (properties.length > 0) {
  const totalCount = properties.length;
  const types: Record<string, number> = {};
  const locations: Record<string, number> = {};
  let validPrices = 0;
  let totalPrice = 0;
  let maxPrice = 0;
  let minPrice = Infinity;
  let yieldsCount = 0;
  let totalYield = 0;

  properties.forEach((p: any) => {
    if (p.type) types[p.type] = (types[p.type] || 0) + 1;
    const loc = p.location ? p.location.split(",")[0].trim() : "Other";
    locations[loc] = (locations[loc] || 0) + 1;
    
    if (p.rawPrice && p.rawPrice > 0) {
      validPrices++;
      totalPrice += p.rawPrice;
      if (p.rawPrice > maxPrice) maxPrice = p.rawPrice;
      if (p.rawPrice < minPrice) minPrice = p.rawPrice;
    }

    if (p.yield && p.yield !== "TBC") {
      const yVal = parseFloat(p.yield);
      if (!isNaN(yVal)) {
        yieldsCount++;
        totalYield += yVal;
      }
    }
  });

  const avgPrice = validPrices > 0 ? Math.round(totalPrice / validPrices) : 0;
  const avgYield = yieldsCount > 0 ? (totalYield / yieldsCount).toFixed(2) : "0";

  propertyStatsSummary = `
PROPERTY PORTFOLIO METRICS:
- Total Properties Registered: ${totalCount}
- Key Geographic Areas: ${Object.entries(locations).map(([k, v]) => `${k} (${v} listings)`).slice(0, 10).join(", ")}
- Common Asset Classes: ${Object.entries(types).map(([k, v]) => `${k} (${v})`).slice(0, 8).join(", ")}
- Pricing Scale: RM ${minPrice.toLocaleString()} to RM ${maxPrice.toLocaleString()} (Average Unit Value: RM ${avgPrice.toLocaleString()})
- Portfolio Average Yield: ${avgYield}%
`;
}

// Investment advisory prompt context
const systemPrompt = `You are the Virtual AI Investment Advisor of GYDEN Real Estate Group (GREC). GYDEN is founded by CEO Gyden Heng, a visionary real estate leader specializing in high-performing property asset allocation, yield optimization, and one-stop real estate solutions in Malaysia and Southeast Asia (with key dominance in Johor Bahru property hubs, RTS corridor, and luxury residential real estate).

Your tone: Professional, analytical, extremely polite, data-driven, and client-centric. You communicate like an investment advisor from Goldman Sachs or Blackstone. Do not use overhyped marketing buzzwords; rely on statistics, capital appreciation logic, and yield metrics.

${propertyStatsSummary}

If someone asks questions about investment strategy, you should mention the local RTS Link high-growth corridor in Johor, capital growth models vs rental yield assets, and explain GYDEN's unique "One-Stop Solutions" philosophy (handling acquisition, corporate profiling, legal document vetting, and active leasing management).

Keep your formatting clean and structured using markdown. Propose matching properties when appropriate and explain why they align with the client's investment criteria.`;

// Local fallback response generator if Gemini fails (e.g. leaked API key, quota issues)
function generateLocalFallback(query: string, matches: any[]): string {
  const q = query.toLowerCase();
  
  // Default answers
  if (q.includes("hello") || q.includes("hi ") || q.includes("greetings") || q.includes("welcome")) {
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

  // Check if query is completely off-topic
  const locations = ["medini", "skudai", "danga bay", "kulai", "desaru", "permas jaya", "mount austin", "senai", "seri alam", "taman daya", "tasek", "johor bahru"];
  const realEstateKeywords = ["property", "properties", "listing", "house", "apartment", "condo", "villa", "land", "shop", "rent", "buy", "invest", "yield", "roi", "price", "budget", "rm", "million", "location", "rts", "gyden", "bedroom", "bathroom", "yield", "rate", "developer", "fee", "cost", "tenure", "grec", "acquisition", "leasing", "acquisitions", "allocation", "calculator", "finance", "loan"];
  const isOffTopic = !realEstateKeywords.some(kw => q.includes(kw)) && !locations.some(loc => q.includes(loc));
  if (isOffTopic) {
    return "I am your GYDEN Real Estate Virtual Advisor, specializing in Johor Bahru acquisitions, RTS transit corridor insights, and portfolio yields. I cannot consult on external topics (such as weather, general knowledge, or climate). \n\nHow may I assist you with your property investments in Johor today?";
  }

  // Synthesize structured data-driven fallback if properties are matched
  if (matches && matches.length > 0) {
    let response = "Based on our 300 Johor portfolios, I have conducted an asset analysis for your request:\n\n";
    
    // Check location
    const matchedLocs = locations.filter(loc => q.includes(loc));
    if (matchedLocs.length > 0) {
      const locNames = matchedLocs.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(" & ");
      response += `• **Strategic Location (${locNames})**: We are targeting premium assets in the high-growth ${locNames} corridors. This area is highly favored for RTS corridor expansion or high-density residential leasing.\n`;
    }
    
    // Check yield
    if (q.includes("yield") || q.includes("roi") || q.includes("returns")) {
      response += `• **Yield Maximization**: Checked portfolios with optimized cash flow profiles. The properties selected offer active rental yields or are positioned in zones with projected 5%+ yields.\n`;
    }
    
    // Check budget
    if (q.includes("under") || q.includes("below") || q.includes("less") || q.includes("<")) {
      response += `• **Capital Preservation**: Filtered for properties below your specified price ceiling to maintain strict capital allocation budgets.\n`;
    }

    // Check cheap
    const isCheap = q.includes("cheap") || q.includes("affordable") || q.includes("lowest") || 
                    q.includes("budget-friendly") || q.includes("low-cost") || q.includes("low cost") || 
                    q.includes("low price") || q.includes("low-price") || q.includes("low priced") || 
                    q.includes("low-priced") || q.includes("budget") || q.includes("inexpensive") || 
                    q.includes("economical") || q.includes("reasonable");
    if (isCheap) {
      response += `• **Value Optimization**: Prioritized properties with the lowest acquisition costs for capital efficiency.\n`;
    }
    
    // Check expensive
    const isExpensive = q.includes("expensive") || q.includes("luxury") || q.includes("premium") || 
                        q.includes("highest price") || q.includes("highest-price") || q.includes("exclusive") || 
                        q.includes("high end") || q.includes("high-end") || q.includes("prestigious") || 
                        q.includes("elite") || q.includes("top tier") || q.includes("top-tier") || 
                        q.includes("priciest") || q.includes("most expensive");
    if (isExpensive) {
      response += `• **Premium Asset Selection**: Targeted premium high-end properties with high capital growth potential.\n`;
    }
    
    // Check type
    const types = ["apartment", "condominium", "condo", "terrace", "semi d", "semi-d", "bungalow", "villa", "shop", "land", "retail", "office", "industrial"];
    const matchedTypes = types.filter(t => q.includes(t));
    if (matchedTypes.length > 0) {
      const typeName = matchedTypes.map(t => t === "condo" ? "Condominium" : t.charAt(0).toUpperCase() + t.slice(1)).join(" & ");
      response += `• **Asset Class Focus (${typeName})**: Selected premium ${typeName} units matching your yield and size specifications.\n`;
    }
    
    const titles = matches.map(p => p.title).join(", ");
    response += `\nI have matched the following portfolios for your review: **${titles}**.\n\nWould you like me to coordinate a site vetting, compile a full yield prospectus, or connect you to CEO Gyden Heng's desk?`;
    
    return response;
  }

  return "I have scanned our Johor databases, but could not pinpoint an exact listing matching all those parameters. Try asking for specific areas (e.g. 'Medini', 'Kulai'), yields ('yields above 5%'), or budget levels (e.g. 'under 500k'). Alternatively, I can connect you directly to our CEO's advisory desk.";
}

// API routes first
app.get("/api/properties", (req, res) => {
  res.json({ properties });
});

// Chat with Gemini Advisor
app.post("/api/chat", async (req, res) => {
  const { message, chatHistory = [], relevantProperties = [] } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Handle case where API Client initialization was skipped
  if (!ai) {
    console.log("Gemini client not initialized. Falling back to local responder.");
    const fallbackText = generateLocalFallback(message, relevantProperties);
    return res.json({ response: fallbackText, fallback: true });
  }

  try {
    // Construct relevant property context to supply alongside the user prompt
    let propertyContext = "";
    if (relevantProperties && relevantProperties.length > 0) {
      propertyContext = "CONTEXT PROPERTIES FROM DATABASE MATCHING USER SEARCH:\n";
      relevantProperties.forEach((p: any) => {
        propertyContext += `- ID: ${p.id}, Title: ${p.title}, Type: ${p.type}, Location: ${p.location}, Price: ${p.price}, Yield: ${p.yield}, Area: ${p.area}, Status: ${p.status}, Description: ${p.description || "N/A"}\n`;
      });
      propertyContext += "\nIf these properties fit the user's inquiry, refer to them professionally in your advice. Hide any raw 'SA...' ID code prefix from the titles. Reference the properties by title.\n\n";
    }

    // Map existing chat history into Gemini Chat format
    const formattedHistory = chatHistory.slice(-6).map((h: any) => {
      return {
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      };
    });

    // Formulate final message with context prepended
    const fullUserMessage = propertyContext 
      ? `${propertyContext}USER INQUIRY: ${message}` 
      : message;

    console.log("Sending chat prompt to Gemini API...");
    
    // Create Gemini Chat Session
    const activeChat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
      history: formattedHistory.length > 0 ? formattedHistory : undefined
    });

    const response = await activeChat.sendMessage({ message: fullUserMessage });
    res.json({ response: response.text, fallback: false });
  } catch (err: any) {
    console.error("Gemini API Error, executing graceful fallback:", err.message);
    const fallbackText = generateLocalFallback(message, relevantProperties);
    res.json({ 
      response: fallbackText, 
      fallback: true,
      errorMsg: err.message
    });
  }
});

// Submit consultation form
app.post("/api/consultation", (req, res) => {
  const { name, email, phone, strategy, budget, notes } = req.body;
  console.log("New Consultation Request received:", { name, email, phone, strategy, budget, notes });
  res.json({ 
    success: true, 
    message: `Thank you ${name}. Your GYDEN premium strategy profile (Budget: ${budget}) has been compiled. Our executive desk or CEO Gyden Heng will reach out to you within 24 hours.`,
    referenceID: "REF-" + Math.floor(100000 + Math.random() * 900000)
  });
});

// Serve frontend assets
async function bootstrap() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.log("Starting GYDEN GREC in development (Vite Middleware) mode.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting GYDEN GREC in production (Static Assets) mode.");
    const distPath = fs.existsSync(path.join(__dirname, "index.html"))
      ? __dirname
      : path.join(process.cwd(), "dist");

    console.log(`Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GYDEN GREC Full-Stack Server listening at http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
