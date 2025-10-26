import type React from "react";

import { useState } from "react";
import { Upload, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";

const INDUSTRIES = [
  { value: "fashion", label: "Fashion & Apparel" },
  { value: "beauty", label: "Beauty & Cosmetics" },
  { value: "tech", label: "Technology & SaaS" },
  { value: "food", label: "Food & Beverage" },
  { value: "fitness", label: "Fitness & Wellness" },
  { value: "travel", label: "Travel & Hospitality" },
  { value: "finance", label: "Finance & Banking" },
  { value: "ecommerce", label: "E-commerce & Retail" },
] as const;

const TARGET_AUDIENCES = [
  { value: "gen-z", label: "Gen Z (18-24)" },
  { value: "millennials", label: "Millennials (25-40)" },
  { value: "gen-x", label: "Gen X (41-56)" },
  { value: "boomers", label: "Baby Boomers (57+)" },
  { value: "business", label: "B2B/Business Decision Makers" },
] as const;

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
] as const;

const GOALS = [
  { value: "brand-awareness", label: "Brand Awareness" },
  { value: "conversions", label: "Drive Conversions" },
  { value: "engagement", label: "Increase Engagement" },
  { value: "traffic", label: "Website Traffic" },
  { value: "app-installs", label: "App Installs" },
] as const;

interface AnalysisResult {
  success: boolean;
  analysis: string;
  context: {
    industry: string;
    platform: string;
    targetAudience: string;
    goal: string;
  };
  analyzedAt: string;
}

export function UploadForm() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [platform, setPlatform] = useState("");
  const [goal, setGoal] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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
    }
  };

  const handleUploadComplete = (url: string) => {
    setUploadedUrl(url);
    console.log("[UploadThing] Upload complete:", { url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !image ||
      !uploadedUrl ||
      !industry ||
      !targetAudience ||
      !platform ||
      !goal
    )
      return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      // Determine API endpoint based on environment
      const apiUrl = import.meta.env.PROD
        ? "/api/analyze-ad"
        : "http://localhost:8888/.netlify/functions/analyze-ad";

      console.log("[Vibe Check] Analyzing image with criteria:", {
        imageUrl: uploadedUrl,
        industry,
        targetAudience,
        platform,
        goal,
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedUrl,
          industry,
          platform,
          targetAudience,
          goal,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze ad creative");
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      console.log("[Vibe Check] Analysis complete:", result);
    } catch (error) {
      console.error("[Vibe Check] Analysis error:", error);
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Failed to analyze ad creative",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isFormValid =
    image &&
    uploadedUrl !== null &&
    industry &&
    targetAudience &&
    platform &&
    goal;

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
            <Label className="text-lg font-semibold text-card-foreground">
              Step 2: Define Your Analysis Criteria
            </Label>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Select your industry, target audience, platform, and campaign goal
            to get relevant trend insights.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="industry"
              className="text-sm font-medium text-foreground"
            >
              Industry
            </Label>
            <Select
              value={industry}
              onValueChange={setIndustry}
              disabled={isAnalyzing}
            >
              <SelectTrigger
                id="industry"
                className="bg-background text-foreground"
              >
                <SelectValue placeholder="Select your industry..." />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="audience"
              className="text-sm font-medium text-foreground"
            >
              Target Audience
            </Label>
            <Select
              value={targetAudience}
              onValueChange={setTargetAudience}
              disabled={isAnalyzing}
            >
              <SelectTrigger
                id="audience"
                className="bg-background text-foreground"
              >
                <SelectValue placeholder="Select target audience..." />
              </SelectTrigger>
              <SelectContent>
                {TARGET_AUDIENCES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="platform"
              className="text-sm font-medium text-foreground"
            >
              Platform
            </Label>
            <Select
              value={platform}
              onValueChange={setPlatform}
              disabled={isAnalyzing}
            >
              <SelectTrigger
                id="platform"
                className="bg-background text-foreground"
              >
                <SelectValue placeholder="Select platform..." />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="goal"
              className="text-sm font-medium text-foreground"
            >
              Campaign Goal
            </Label>
            <Select value={goal} onValueChange={setGoal} disabled={isAnalyzing}>
              <SelectTrigger
                id="goal"
                className="bg-background text-foreground"
              >
                <SelectValue placeholder="Select goal..." />
              </SelectTrigger>
              <SelectContent>
                {GOALS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-secondary/50 p-4">
          <p className="text-sm font-medium text-secondary-foreground">
            <TrendingUp className="mb-1 mr-2 inline-block h-4 w-4" />
            Analysis includes:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>• Current design trends in your industry</li>
            <li>• Color schemes and typography patterns</li>
            <li>• Engagement-driven layout strategies</li>
            <li>• Platform-specific best practices</li>
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

      {/* Error Display */}
      {analysisError && (
        <Card className="border-2 border-red-500 bg-red-50 p-6 dark:bg-red-950/20">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
              <svg
                className="h-5 w-5 text-red-600 dark:text-red-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Analysis Failed
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {analysisError}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Results Display */}
      {analysisResult && (
        <Card className="border-2 border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <Label className="text-lg font-semibold text-card-foreground">
                Analysis Results
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Analyzed on {new Date(analysisResult.analyzedAt).toLocaleString()}
            </p>
          </div>

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap rounded-lg bg-secondary/30 p-4 text-sm">
              {analysisResult.analysis}
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              onClick={() => {
                setAnalysisResult(null);
                setImage(null);
                setImagePreview(null);
                setUploadedUrl(null);
                setIndustry("");
                setTargetAudience("");
                setPlatform("");
                setGoal("");
              }}
              variant="outline"
              size="sm"
            >
              Analyze Another Ad
            </Button>
          </div>
        </Card>
      )}
    </form>
  );
}
