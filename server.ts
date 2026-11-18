import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization helper for Google GenAI
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined in the application secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON and urlencoded parsers with size limit for base64 OCR uploads
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Standard health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // 1. AI Welfare Scheme Advisor Chatbot Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history, language = "en" } = req.body;
      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      const client = getGeminiClient();

      // Formulate simple instructions in user's language
      let systemInstruction = `You are "Jan Seva AI", a compassionate, humble, and expert government assistant designed to help rural, low-literacy, and illiterate citizens find welfare benefits.
Your output MUST be in the requested language: ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}.
Guidelines:
1. Speak in extremely simple, friendly, easy-to-understand language. Do not use complex government jargon or administrative terms.
2. Summarize points clearly with bullet points and bold headers.
3. When discussing schemes, detail: Who can get it (Eligibility), What money or benefit is given (Benefits), What certificates they need to hold (Required Documents), and Where to go to apply (Application Process).
4. Do not make up facts. Keep sentences short and clear. If they ask in Telugu or Hindi, reply completely in Telugu (using Telugu script) or Hindi (using Devanagari script) respectively. Keep it encouraging and respectful.`;

      // Build chat prompt or use standard content generation
      // To bypass state management issues, we construct the chat context as a flat prompt
      const conversationPrompt = `
System Context: ${systemInstruction}

Conversation history so far:
${(history || []).map((h: any) => `${h.role === 'user' ? 'Citizen' : 'Jan Seva AI'}: ${h.text}`).join('\n')}

Latest citizen query: "${message}"

Please respond now as Jan Seva AI directly in ${language === 'te' ? 'Telugu (using Telugu characters)' : language === 'hi' ? 'Hindi (using Devanagari)' : 'English'}.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: conversationPrompt,
      });

      res.json({ text: response.text || "I apologize, I am unable to process that request at this moment." });
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      // Return a gentle, clean error or a high-quality fallback if API key is missing
      if (!process.env.GEMINI_API_KEY) {
        res.json({
          text: `[DEMO MODE] I would be happy to help you! (Note: GEMINI_API_KEY is not configured in the secrets menu yet). Here is a demo response:

To apply for Rythu Bharosa (Farmer Support), you need:
1. Aadhaar Card
2. Bank Passbook
3. Pattadar Land Passbook

Please submit these documents at your nearest Village Secretariat. Would you like me to guide you on how to get an income certificate?`,
          isDemo: true
        });
      } else {
        res.status(500).json({ error: error.message || "Internal Server Error" });
      }
    }
  });

  // 2. Intelligent OCR for Documents (Aadhaar or Income Certificate)
  app.post("/api/gemini/ocr", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg" } = req.body;
      if (!imageBase64) {
        res.status(400).json({ error: "No document image data found." });
        return;
      }

      const client = getGeminiClient();

      const docPrompt = `
This image is a scanned document submitted by a citizen for government welfare scheme eligibility matching.
Analyze the document and extract the key identity or income details into a standardized JSON format.
It is typically either:
A. An Indian Aadhaar Card (contains 12-digit number, name, gender, dob, address)
B. An Indian Income Certificate (contains annual income amount in Rupees, certificate number, name, district, caste category)

Return ONLY a valid JSON object. Do not include any markdown fences, backticks, or comments.
Structure required:
{
  "documentType": "Aadhaar" | "Income" | "Unknown",
  "name": "Full Name",
  "documentNumber": "Aadhaar number or Certificate number",
  "extractedFields": {
    "dob": "YYYY-MM-DD or empty",
    "gender": "male" | "female" | "other" | "unknown",
    "annualIncome": 120000 (number representing annual income in Rupees if Income Certificate, or null),
    "district": "Extracted district name or empty",
    "category": "SC" | "ST" | "OBC" | "General" | "unknown"
  },
  "summary": "Short 1-sentence description in English of what was read."
}`;

      const imagePart = {
        inlineData: {
          mimeType,
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        },
      };

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [imagePart, { text: docPrompt }],
        config: {
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text || "{}";
      const parsedData = JSON.parse(resultText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini OCR Error:", error);
      if (!process.env.GEMINI_API_KEY) {
        // Fallback simulated OCR database for demo purposes when no key exists
        res.json({
          documentType: "Aadhaar",
          name: "Raju Kondavalasa",
          documentNumber: "4059 8122 9354",
          extractedFields: {
            dob: "1971-08-15",
            gender: "male",
            annualIncome: null,
            district: "Anantapur",
            category: "OBC"
          },
          summary: "Demo OCR successfully extracted Aadhaar details for Raju Kondavalasa, 55, male, from Anantapur."
        });
      } else {
        res.status(500).json({ error: error.message || "Failed to process document OCR." });
      }
    }
  });

  // 3. Demo WhatsApp & SMS Alert Simulator
  app.post("/api/whatsapp/demo", (req, res) => {
    const { phone, type, schemeName, message } = req.body;
    if (!phone) {
      res.status(400).json({ error: "Phone number is required for demonstration." });
      return;
    }
    // Simulate successful broadcast
    res.json({
      success: true,
      sentAt: new Date().toLocaleTimeString(),
      channel: type || "whatsapp",
      recipient: phone,
      title: schemeName || "General Welfare Update",
      body: message || "Your application is under review.",
      status: "delivered"
    });
  });

  // Serve static client assets and handle SPA routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and listening on port ${PORT}`);
  });
}

startServer();
