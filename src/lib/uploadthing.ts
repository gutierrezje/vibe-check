import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";

import type { OurFileRouter } from "../../server/uploadthing";

// Define your file router type
// export type OurFileRouter = {
//   imageUploader: {
//     input: void;
//     output: { url: string; key: string; name: string };
//   };
// };

// Determine the API URL based on environment
const getUploadThingUrl = () => {
  // In production (Netlify), use the Netlify Functions endpoint
  if (import.meta.env.PROD) {
    return "/api/uploadthing";
  }
  // In development, you can use a local Netlify Dev server
  return "http://localhost:8888/.netlify/functions/uploadthing";
};

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: getUploadThingUrl(),
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: getUploadThingUrl(),
});

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>({
    url: getUploadThingUrl(),
  });
