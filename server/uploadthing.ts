/**
 * UploadThing Backend Configuration (v7)
 *
 * This file defines the file upload routes for UploadThing.
 * It's used by the Netlify Function in netlify/functions/uploadthing.ts
 *
 * UploadThing v7 automatically reads UPLOADTHING_TOKEN from environment variables.
 * No explicit configuration needed!
 */

import { createUploadthing, type FileRouter } from "uploadthing/server";

// createUploadthing() automatically uses UPLOADTHING_TOKEN from env
const f = createUploadthing();

// Define your file upload routes
export const ourFileRouter = {
  // Image uploader route
  imageUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      console.log("upload middleware called", req)
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
    // This code runs on the server after upload completes
    console.log("Upload complete for user:", metadata);
    console.log("File URL:", file.url);

    // Return data to the client
    return { url: file.url, key: file.key, name: file.name };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
