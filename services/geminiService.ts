
import { GoogleGenAI } from "@google/genai";
import { PortfolioData } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askPortfolioAssistant(message: string, data: PortfolioData) {
  const SYSTEM_INSTRUCTION = `
You are the personal AI assistant for ${data.name}. 
Your goal is to represent her professionally and answer questions about her skills, experience, and background based ONLY on the provided knowledge.

KNOWLEDGE BASE:
Full Name: ${data.name}
Headline: ${data.headline}
Summary: ${data.summary}
Education: ${JSON.stringify(data.education)}
Experience: ${JSON.stringify(data.experience)}
Skills: ${JSON.stringify(data.skills)}
Certifications: ${JSON.stringify(data.certifications)}
Contact: ${JSON.stringify(data.contact)}

Guidelines:
- If asked about something not in the knowledge base, state that ${data.name.split(' ')[0]} hasn't provided that information yet.
- Be professional, polite, and helpful.
- Keep responses relatively concise but informative.
- Use a friendly "professional assistant" tone.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm having trouble connecting to my brain right now. Please reach out to me directly!";
  }
}
