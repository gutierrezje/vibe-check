import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { UploadForm } from "@/components/upload-form";
import { LandingPage } from "@/components/landing-page";
import { TrendingUp, Zap } from "lucide-react";

function App() {
  return (
    <>
      {/* Show Landing Page for signed-out users */}
      <SignedOut>
        <LandingPage />
      </SignedOut>

      {/* Show Main App for signed-in users */}
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-[#f8f6f0] via-[#fdfbf7] to-[#f5f3ed]">
          {/* Header with User Button */}
          <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  Vibe Check
                </span>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </div>
          </header>

          {/* Main Content */}
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Zap className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Vibe Check
                </h1>
              </div>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Compare your advertising designs against current market trends.
                Upload your creative and discover how it stacks up in your
                industry.
              </p>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Real-time trend analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>Industry insights</span>
                </div>
              </div>
            </div>

            <div className="my-6 rounded-lg bg-secondary/50 p-4">
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

            <UploadForm />

            <div className="mt-12 text-center text-sm text-muted-foreground">
              <p>
                Your designs are analyzed using the latest advertising trends
                and best practices.
              </p>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

export default App;
