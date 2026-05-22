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

// Comprehensive listings for GYDEN GREC Real Estate
const properties = [
  {
    id: "SA001",
    title: "Danga Bay Commercial Hub",
    category: "Commercial",
    price: "RM 4,200,000",
    rawPrice: 4200000,
    area: "8,500 sqft",
    location: "Danga Bay, Johor Bahru",
    yield: "6.8%",
    status: "Available / Premium Listing",
    description: "Centrally located multi-level retail and office plot featuring waterfront views and direct expressway connectivity. Excellent for corporate headquarters, high-traffic showrooms, or co-working setups. Positioned specifically in the Danga Bay development hotspot with excellent rental yield potential.",
    documents: [
      { name: "Investment Brochure.pdf", type: "Brochure", size: "2.4 MB", previewContent: "GYDEN Real Estate Group (GREC). Danga Bay Commercial Plot SA001. Valuation: RM 4.2M. Projected yearly growth: ~7.2%. Footfall: 15,000 daily average. Infrastructure details: High-power electricity phase-3, central HVAC, 24-bay private parking." },
      { name: "SA001 Floor_Plan_Detailed.dwg", type: "Floor Plan", size: "1.8 MB", previewContent: "Architectural blueprint layout. Ground level: 4,000 sqft showroom. Level 1: 3,000 sqft open-plan office space. Level 2: Executive suites & boardrooms. Fire safety exits certified." },
      { name: "Tenant_Agreement_Template.docx", type: "Agreement", size: "820 KB", previewContent: "Draft Tenancy Agreement: 3+3 years term. Escalation clause: +10% every 3 years. Security deposit: 3 months rental deposit + 1 month utilities. Maintenance handled under landlord common area policies." }
    ],
    features: ["Waterfront View", "Main Road Frontage", "3-Phase Power", "High Foot Traffic Area", "Ample Car Parks"]
  },
  {
    id: "SA002",
    title: "Skudai Luxury Villa",
    category: "Residential",
    price: "RM 2,850,000",
    rawPrice: 2850000,
    area: "6,200 sqft",
    location: "Skudai Elite Heights, Johor Bahru",
    yield: "4.5%",
    status: "Under Offer / Exclusive",
    description: "An elegant, bespoke 5-bedroom luxury villa with smart-home systems and a landscaped infinity plunge pool. Built with top-grade Burmese teak and Italian marble. Located inside a gated security estate close to prestige international academic centers (EduCity).",
    documents: [
      { name: "SA002 Land_Title_Deed.pdf", type: "Legal Deed", size: "4.1 MB", previewContent: "Geran Hakmilik Kekal (Freehold Land Title). Lot Number 14088, Mukim Pulai. Area: 7,500 sqft plot size. Registered Owner: GYDEN Holding nominee. Encumbrances: None, clear title." },
      { name: "Asset_Inspection_Oct2025.pdf", type: "Inspection Report", size: "1.2 MB", previewContent: "Comprehensive structural audit completed Oct 2025. Foundation: Grade-A concrete column structures. Plumbing: Upgraded pressure booster pump. Electrical: Integrated smart distribution board with surge protection." }
    ],
    features: ["Freehold Title", "Gated & Guarded", "Private Plunge Pool", "Smart Home Automation", "Teak Flooring"]
  },
  {
    id: "SA003",
    title: "JB Central Office Plot",
    category: "Industrial / Land",
    price: "RM 7,900,000",
    rawPrice: 7900000,
    area: "2.1 Acres",
    location: "Johor Bahru CBD Central",
    yield: "8.2% (Development Potential)",
    status: "Available for Joint Venture",
    description: "An ultra-rare premium commercial land zone in the direct heart of the Johor Bahru Central region, ideal for corporate high-rise development or high-density logistics warehousing. Within walking distance to future Rapid Transit System (RTS) link station, conferring unprecedented asset capital gains.",
    documents: [
      { name: "RTS_Link_Feasibility_Analysis.pdf", type: "Analysis", size: "5.5 MB", previewContent: "GREC Research Division: Economic impacts of the local RTS Link on Lot SA003 Central. Transit accessibility score: 98/100. Expected capital appreciation upon MRT launch: +25% minimum. Local zoning restrictions permit up to Plot Ratio 1:8." },
      { name: "Joint_Venture_MOU_Draft.pdf", type: "MOU", size: "1.1 MB", previewContent: "Memorandum of Understanding framework. GYDEN G.R.E.C acts as local developer & acquisition manager. Equity split proposals: 40% landowner / 60% development pool. Buyback option after Year 5." }
    ],
    features: ["RTS Link Corridor", "Commercial High-Density Zoning", "Prime CBD Location", "High Plot Ratio", "Clear Environmental Audit"]
  }
];

// Investment advisory prompts context
const systemPrompt = `You are the Virtual AI Investment Advisor of GYDEN Real Estate Group (GREC). GYDEN is founded by CEO Gyden Heng, a visionary real estate leader specializing in high-performing property asset allocation, yield optimization, and one-stop real estate solutions in Malaysia and Southeast Asia (with key dominance in Johor Bahru property hubs, RTS corridor, and luxury residential real estate).

Your tone: Professional, analytical, extremely polite, data-driven, and client-centric.

GYDEN catalog properties highlights you know:
1. SA001 - Danga Bay Commercial Hub (RM 4.2M, waterfront view, 6.8% yield)
2. SA002 - Skudai Luxury Villa (RM 2.85M, premium residential close to EduCity, 4.5% yield)
3. SA003 - JB Central Office Plot (RM 7.9M, 2.1 acres CBD land near future RTS link, 8.2% development yield potential)

If someone asks questions about investment strategy, you should mention the local RTS Link high-growth corridor in Johor, capital growth models vs rental yield assets, and explain GYDEN's unique "One-Stop Solutions" philosophy (handling acquisition, corporate profiling, legal document vetting, and active leasing management).

Keep format clean with markdown. Avoid using self-praising marketing hype like "unparalleled miracle". Speak objectively and with high professional poise.`;

// API routes first
app.get("/api/properties", (req, res) => {
  res.json({ properties });
});

// Chat with Gemini Advisor
app.post("/api/chat", async (req, res) => {
  const { message, chatHistory = [] } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Handle case where API Key is missing or service fails
  if (!ai) {
    // Offline simulation mode
    setTimeout(() => {
      let responseText = `Thank you for consulting with GYDEN Real Estate Group (GREC). [Offline Mode: Set your GEMINI_API_KEY in the Secrets panel to activate full intelligence]. \n\nRegarding your question: "${message}", CEO Gyden Heng stresses optimal asset allocation. In Johor Bahru, we focus on the high-yield RTS Transit Corridor (SA003) and primary waterfront commercial grids (SA001). To assist you further, please connect the system key or schedule a free direct consultation below!`;
      res.json({ response: responseText });
    }, 800);
    return;
  }

  try {
    // Map existing chat history into Gemini Chat format
    // Filter history into standard structure or prompt
    const formattedHistory = chatHistory.slice(-6).map((h: any) => {
      return {
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      };
    });

    const activeChat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
      // Re-hydrate simple history if any
      history: formattedHistory.length > 0 ? formattedHistory : undefined
    });

    const response = await activeChat.sendMessage({ message });
    res.json({ response: response.text });
  } catch (err: any) {
    console.error("Gemini API Error in Server:", err);
    res.status(500).json({ 
      error: "Error contacting Gemini Advisor", 
      details: err.message,
      fallbackResponse: "Our GYDEN elite consultant workspace is currently processing major market indices. Let's redirect to real estate portfolios or use our quick schedule portal below to link with us!"
    });
  }
});

// Submit consultation form
app.post("/api/consultation", (req, res) => {
  const { name, email, phone, strategy, budget, notes } = req.body;
  console.log("New Consultation Request received:", { name, email, phone, strategy, budget, notes });
  // Store or mock register
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
    // Support running from bundle (dist/server.cjs) where index.html is adjacent, or from root
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
