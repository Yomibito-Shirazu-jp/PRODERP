import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * General chat or quick tasks using gemini-3.1-flash-lite-preview
 */
export async function generateQuickResponse(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating quick response:", error);
    return "エラーが発生しました。";
  }
}

/**
 * Complex analysis using gemini-3.1-pro-preview with HIGH thinking level and Google Search grounding
 */
export async function analyzeWithHighThinkingAndSearch(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating complex analysis:", error);
    return "分析中にエラーが発生しました。";
  }
}

/**
 * Location analysis using gemini-3-flash-preview with Google Maps grounding
 */
export async function analyzeLocationWithMaps(location: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${location} について、Google Mapsの情報を使って周辺環境やアクセスなどの特徴を教えてください。`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating location analysis:", error);
    return "位置情報の取得中にエラーが発生しました。";
  }
}

/**
 * Chat session instance for multi-turn conversations
 */
export function createChatSession() {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "あなたは優秀な営業・業務アシスタントです。ユーザーの質問に対して、簡潔かつ的確に答えてください。",
    }
  });
}
