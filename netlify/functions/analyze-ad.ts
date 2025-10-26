import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildAnalysisPrompt,
  type AnalysisContext,
} from "../../server/gemini-helpers";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Fetch image from URL and convert to base64
 */
async function fetchImageAsBase64(
  imageUrl: string,
): Promise<{ data: string; mimeType: string }> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Get mime type from response headers or default to jpeg
    const mimeType = response.headers.get("content-type") || "image/jpeg";

    return {
      data: base64,
      mimeType,
    };
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Failed to fetch image for analysis");
  }
}

/**
 * Analyze ad creative using Gemini Vision API
 */
async function analyzeAdWithGemini(
  imageUrl: string,
  context: AnalysisContext,
): Promise<string> {
  try {
    // Use Gemini 2.0 Flash with vision capabilities
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Fetch and convert image to base64
    const { data: imageData, mimeType } = await fetchImageAsBase64(imageUrl);

    // Build the analysis prompt
    const prompt = buildAnalysisPrompt(context);

    // Create the parts for multimodal input
    const parts = [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType,
          data: imageData,
        },
      },
    ];

    console.log("[Gemini] Analyzing ad creative...");

    // Generate content with image and prompt
    const result = await model.generateContent(parts);
    const response = result.response;
    const text = response.text();

    console.log("[Gemini] Analysis complete");

    return text;
  } catch (error) {
    console.error("Error analyzing ad with Gemini:", error);
    throw new Error("Failed to analyze ad creative");
  }
}

/**
 * Netlify Function Handler
 */
export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || "{}");
    const { imageUrl, industry, platform, targetAudience, goal } = body;

    // Validate required fields
    if (!imageUrl || !industry || !platform || !targetAudience || !goal) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required fields",
          required: [
            "imageUrl",
            "industry",
            "platform",
            "targetAudience",
            "goal",
          ],
        }),
      };
    }

    // Validate Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Gemini API key not configured" }),
      };
    }

    console.log("[Analyze Ad] Request received:", {
      imageUrl,
      industry,
      platform,
      targetAudience,
      goal,
    });

    // Create analysis context
    const analysisContext: AnalysisContext = {
      industry,
      platform,
      targetAudience,
      goal,
    };

    // Analyze the ad with Gemini
    const analysis = await analyzeAdWithGemini(imageUrl, analysisContext);

    // Return successful response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        analysis,
        context: analysisContext,
        analyzedAt: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("[Analyze Ad] Error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to analyze ad creative",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
