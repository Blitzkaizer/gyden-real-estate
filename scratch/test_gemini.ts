import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const key = process.env.GEMINI_API_KEY;
console.log("API Key Exists:", !!key);

if (key) {
  const ai = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  async function test() {
    try {
      console.log("Sending message to gemini-2.5-flash...");
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello, tell me a 1-sentence joke about real estate.",
        config: {
          systemInstruction: "You are a professional real estate advisor.",
        }
      });
      console.log("Response text:", response.text);
    } catch (e: any) {
      console.error("Failed to generate content:", e);
    }
  }

  test();
} else {
  console.log("No API key found in .env");
}
