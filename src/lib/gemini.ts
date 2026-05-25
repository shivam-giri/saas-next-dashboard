import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy-key",
});

export async function generateContent({
  topic,
  type,
  brandVoice,
}: {
  topic: string;
  type: "BLOG" | "TWEET" | "LINKEDIN" | "EMAIL";
  brandVoice?: {
    tone: string | null;
    targetAudience: string | null;
    doNotUseWords: string | null;
    coreValues: string | null;
  } | null;
}) {
  if (!process.env.GEMINI_API_KEY) {
    console.log("Mocking Gemini response because GEMINI_API_KEY is not set.");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return `[Mock Generated ${type} Content]\n\nTopic: ${topic}\n\nThis is simulated content because you haven't provided a GEMINI_API_KEY.`;
  }

  // Construct the Brand Voice context (System Instructions)
  let systemInstruction = "You are an expert B2B SaaS content marketer.";
  
  if (brandVoice) {
    systemInstruction += `\n\nMust adhere to the following Brand Voice guidelines:`;
    if (brandVoice.tone) systemInstruction += `\n- Tone: ${brandVoice.tone}`;
    if (brandVoice.targetAudience) systemInstruction += `\n- Target Audience: ${brandVoice.targetAudience}`;
    if (brandVoice.coreValues) systemInstruction += `\n- Core Values: ${brandVoice.coreValues}`;
    if (brandVoice.doNotUseWords) systemInstruction += `\n- DO NOT USE THESE WORDS: ${brandVoice.doNotUseWords}`;
  }

  // Define format instructions based on type
  let userPrompt = `Create a ${type} about: ${topic}.`;
  
  if (type === "BLOG") {
    userPrompt += ` Write a comprehensive, SEO-optimized blog post with Markdown headings, bullet points, and a strong conclusion. Minimum 500 words.`;
  } else if (type === "TWEET") {
    userPrompt += ` Write a concise, engaging Twitter thread (max 4 tweets). Use emojis appropriately. Number each tweet (1/4, etc.).`;
  } else if (type === "LINKEDIN") {
    userPrompt += ` Write a professional yet engaging LinkedIn post. Use line breaks, emojis, and end with a thought-provoking question to drive engagement.`;
  } else if (type === "EMAIL") {
    userPrompt += ` Write a marketing email newsletter. Include an engaging Subject Line at the top, a clear hook, body, and a call-to-action.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Generous free tier, fast and highly capable
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "";
  } catch (error: any) {
    console.warn("Gemini API Error (falling back to Mock Mode):", error?.message || error);
    
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return `[Mock Generated ${type} Content]\n\nTopic: ${topic}\n\nThis is simulated content because the Gemini API request failed. Ensure your API key is correct.`;
  }
}
