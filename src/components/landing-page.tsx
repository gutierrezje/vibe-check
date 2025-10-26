import { SignInButton } from "@clerk/clerk-react";
import { Zap, TrendingUp, Target, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Zap className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Vibe Check
            </h1>
          </div>
          <p className="mx-auto mb-4 max-w-3xl text-xl text-muted-foreground sm:text-2xl">
            Analyze your ad creatives with AI-powered insights
          </p>
          <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground">
            Get instant feedback on your advertising designs. Compare against
            industry trends, platform best practices, and audience preferences.
          </p>

          <SignInButton mode="modal">
            <Button size="lg" className="gap-2 text-lg">
              <Sparkles className="h-5 w-5" />
              Get Started Free
            </Button>
          </SignInButton>
        </div>

        {/* Features Grid */}
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-card-foreground">
              Real-Time Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload your ad and get instant AI-powered feedback on design
              quality, message clarity, and scroll-stop power.
            </p>
          </Card>

          <Card className="border-2 border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-card-foreground">
              Platform Optimization
            </h3>
            <p className="text-sm text-muted-foreground">
              Get platform-specific insights for Instagram, Facebook, TikTok,
              LinkedIn, and Twitter to maximize performance.
            </p>
          </Card>

          <Card className="border-2 border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-card-foreground">
              Performance Predictions
            </h3>
            <p className="text-sm text-muted-foreground">
              Receive predicted CTR, conversion potential, and actionable
              recommendations to improve your ad before launch.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16 text-center">
          <h2 className="mb-8 text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Upload Your Ad
              </h3>
              <p className="text-sm text-muted-foreground">
                Select your ad creative and specify your industry, platform, and
                campaign goal.
              </p>
            </div>

            <div>
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                AI Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Our AI evaluates design quality, message clarity, platform fit,
                and audience alignment.
              </p>
            </div>

            <div>
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Get Insights
              </h3>
              <p className="text-sm text-muted-foreground">
                Review detailed scores, performance predictions, and prioritized
                improvements.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/20 p-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Ready to optimize your ads?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
              Join marketing teams using AI to create better-performing ad
              creatives.
            </p>
            <SignInButton mode="modal">
              <Button size="lg" className="gap-2 text-lg">
                <Sparkles className="h-5 w-5" />
                Start Analyzing Now
              </Button>
            </SignInButton>
          </Card>
        </div>
      </div>
    </div>
  );
}
