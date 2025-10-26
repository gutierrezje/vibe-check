/**
 * Netlify Function for UploadThing
 * This handles file uploads via UploadThing's API
 */

import type { Handler, HandlerEvent } from "@netlify/functions";
import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "../../server/uploadthing";

// Create the handler using the shared file router
const utHandler = createRouteHandler({
  router: ourFileRouter,
});

// Export as Netlify Function
export const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-uploadthing-version, x-uploadthing-api-key, x-uploadthing-fe-package, x-uploadthing-be-adapter",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Check for UPLOADTHING_TOKEN
  if (!process.env.UPLOADTHING_TOKEN) {
    console.error("UPLOADTHING_TOKEN is not set!");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server configuration error: UPLOADTHING_TOKEN not set" }),
    };
  }

  try {
    console.log("Netlify Function called:", {
      method: event.httpMethod,
      path: event.path,
      queryString: event.queryStringParameters,
      isBase64: event.isBase64Encoded,
      tokenSet: !!process.env.UPLOADTHING_TOKEN,
    });

    // Build the full URL with query parameters
    const baseUrl = `https://${event.headers.host || "localhost"}${event.path}`;
    const url = new URL(baseUrl);

    // Add query parameters if present
    if (event.queryStringParameters) {
      Object.entries(event.queryStringParameters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    // Handle body encoding - Netlify can base64 encode binary data
    let body: string | Buffer | undefined;
    if (event.body) {
      if (event.isBase64Encoded) {
        body = Buffer.from(event.body, "base64");
      } else {
        body = event.body;
      }
    }

    const request = new Request(url.toString(), {
      method: event.httpMethod,
      headers: new Headers(event.headers as Record<string, string>),
      body: body,
    });

    console.log("Request URL:", url.toString());

    // Call UploadThing handler
    const response = await utHandler(request);

    console.log("UploadThing response:", {
      status: response.status,
      statusText: response.statusText,
    });

    // Convert Response to Netlify response format
    const responseBody = await response.text();
    const responseHeaders = Object.fromEntries(response.headers.entries());

    // Log error responses for debugging
    if (response.status >= 400) {
      console.error("UploadThing error response:", {
        status: response.status,
        body: responseBody,
      });
    }

    return {
      statusCode: response.status,
      headers: { ...headers, ...responseHeaders },
      body: responseBody,
    };
  } catch (error) {
    console.error("UploadThing error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      }),
    };
  }
};
