"use client";

import type React from "react";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  onUploadComplete?: (url: string, key: string) => void;
  imagePreview: string | null;
}

export function ImageUpload({
  onImageChange,
  onUploadComplete,
  imagePreview,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res[0]) {
        onUploadComplete?.(res[0].url, res[0].key);
      }
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
      alert(`Upload failed: ${error.message}`);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageChange(file);

      // Start upload to UploadThing
      setIsUploading(true);
      try {
        await startUpload([file]);
      } catch (error) {
        setIsUploading(false);
        console.error("Upload error:", error);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageChange(file);

      // Start upload to UploadThing
      setIsUploading(true);
      try {
        await startUpload([file]);
      } catch (error) {
        setIsUploading(false);
        console.error("Upload error:", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />

      {!imagePreview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-background transition-colors hover:border-primary hover:bg-secondary/30"
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="rounded-full bg-secondary p-4">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <Upload className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <p className="mb-1 text-base font-medium text-foreground">
                {isUploading
                  ? "Uploading..."
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, or WebP (max. 16MB)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg border-2 border-border bg-secondary/30">
          {isUploading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Uploading to UploadThing...
                </p>
              </div>
            </div>
          )}
          <img
            src={imagePreview || "/placeholder.svg"}
            alt="Preview"
            className="h-auto w-full object-contain"
            style={{ maxHeight: "400px" }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-lg"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
