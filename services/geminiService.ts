import { GoogleGenAI, Type } from "@google/genai";
import { YouTubeMetadata } from "../types";
import { getNextAvailableKey, recordKeyUsage, areAllKeysExhausted } from "./apiKeyService";

export async function generateYouTubeMetadata(input: string, language: string): Promise<YouTubeMetadata> {
  // Check if all keys are exhausted
  const allExhausted = await areAllKeysExhausted();
  if (allExhausted) {
    throw new Error('DAILY_LIMIT_REACHED');
  }

  // Get next available key
  const keyData = await getNextAvailableKey();
  if (!keyData) {
    throw new Error('DAILY_LIMIT_REACHED');
  }

  const { key: apiKey, keyIndex } = keyData;
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Transform this concept into a viral YouTube metadata package: "${input}". 
    Target Language/Style: ${language}.`,
    config: {
      systemInstruction: `You are a high-level YouTube SEO and Viral Growth expert.
      
      LANGUAGE RULES:
       - Primary Language: ${language}.
       - The assistant must respond ONLY in the Primary Language.
       - Do NOT use English words, phrases, or sentences under any circumstance.
       - English is allowed ONLY if:
          • a technical term has no equivalent in the Primary Language, OR
          • the user explicitly requests English.
       - If English is unavoidable, use the MINIMUM number of English words required.
       - Do not explain, translate, or mix languages.
      
      MISSION:
      1. TITLES: Create 10 "Beast-style" titles. One must be short (<80 chars), others curiosity-driven.
      2. DESCRIPTION: Deeply optimized for SEO (2000+ chars). Includes a compelling "above the fold" intro.
      3. VIDEO TAGS: Exactly 25-70 comma-separated tags specifically for the 'Tags' section of YouTube Studio.
      4. HASHTAGS: Exactly 50 hashtags for the bottom of the description,25 of primary language , 15 of English and 10 of misxed words of english and primary language.
      5. THUMBNAIL: High-level visual psychological strategy.
      
      Format the response as a strict JSON object.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5 high-CTR titles."
          },
          description: {
            type: Type.STRING,
            description: "Full SEO description."
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Video keywords for the tags field."
          },
          thumbnailConcept: {
            type: Type.STRING,
            description: "Visual layout and text for thumbnail."
          },
          hookIdeas: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 Retention hooks for the first 30 seconds."
          },
          suggestedHashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "10 relevant hashtags."
          },
          pinnedComment: {
            type: Type.STRING,
            description: "Question-based comment to spark debate."
          }
        },
        required: ["titles", "description", "tags", "thumbnailConcept", "hookIdeas", "suggestedHashtags", "pinnedComment"]
      }
    },
  });

  const text = response.text;
  if (!text) throw new Error("AI Generation Failed");
  
  // Record that this key was used
  await recordKeyUsage(keyIndex);
  
  return JSON.parse(text) as YouTubeMetadata;
}
