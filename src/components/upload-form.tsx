import type React from "react";

import { useState } from "react";
import { Upload, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";

export function UploadForm() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setUploadedUrl(null);
      setUploadedKey(null);
    }
  };

  const handleUploadComplete = (url: string, key: string) => {
    setUploadedUrl(url);
    setUploadedKey(key);
    console.log("[UploadThing] Upload complete:", { url, key });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !prompt.trim() || !uploadedUrl) return;

    setIsAnalyzing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAnalyzing(false);

    // Here you would send the uploaded image URL and prompt to your API
    console.log("[Vibe Check] Analyzing image with prompt:", {
      imageUrl: uploadedUrl,
      imageKey: uploadedKey,
      prompt,
    });
  };

  const isFormValid = image && prompt.trim().length > 0 && uploadedUrl !== null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="border-2 border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <Label
              htmlFor="image-upload"
              className="text-lg font-semibold text-card-foreground"
            >
              Step 1: Upload Your Design
            </Label>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Upload your advertising design in JPG, PNG, or WebP format. Maximum
            file size: 16MB.
          </p>
        </div>

        <ImageUpload
          onImageChange={handleImageChange}
          onUploadComplete={handleUploadComplete}
          imagePreview={imagePreview}
        />
      </Card>

      <Card className="border-2 border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <Label
              htmlFor="prompt"
              className="text-lg font-semibold text-card-foreground"
            >
              Step 2: Describe Your Query
            </Label>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            What advertising trends would you like to explore? Be specific about
            your industry, target audience, or design elements.
          </p>
        </div>

        <Textarea
          id="prompt"
          placeholder="Example: What are the current color trends in tech startup advertising? How does my design compare to successful SaaS landing pages?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-32 resize-none bg-background text-foreground placeholder:text-muted-foreground"
          disabled={isAnalyzing}
        />

        <div className="mt-4 rounded-lg bg-secondary/50 p-4">
          <p className="text-sm font-medium text-secondary-foreground">
            <TrendingUp className="mb-1 mr-2 inline-block h-4 w-4" />
            Suggested queries:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>• Current typography trends in luxury brand advertising</li>
            <li>• Color psychology in e-commerce product ads</li>
            <li>• Layout patterns in successful social media campaigns</li>
          </ul>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid || isAnalyzing}
          className="min-w-48 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isAnalyzing ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
              Analyzing Trends...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Trends
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
