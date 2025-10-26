/**
 * Helper functions for Gemini ad analysis
 */

export interface AnalysisContext {
  industry: string;
  platform: string;
  targetAudience: string;
  goal: string;
}

/**
 * Get platform-specific analysis checks based on the platform
 */
export function getPlatformSpecificChecks(platform: string): string {
  const checks: Record<string, string> = {
    instagram: `
  - Square (1:1) or vertical (4:5) aspect ratio optimization
  - Text overlay doesn't exceed 20% of image (old rule, but still good practice)
  - Bright, vibrant colors (performs better in feed)
  - Face close-ups increase engagement by 38%
  - Video vs static consideration (Reels prioritization)
  - Story-safe zones (top/bottom cutoff areas)
  - Swipeable carousel optimization
  - Product tags placement`,

    facebook: `
  - Recommended image size: 1200x628px
  - Text-to-image ratio (avoid text-heavy designs)
  - Mobile feed optimization (90% of users on mobile)
  - Thumbnail effectiveness for video ads
  - Instant Experience (Canvas) compatibility
  - Multi-product catalog ad format
  - Lead form integration readiness
  - Community/group relevance`,

    tiktok: `
  - Vertical 9:16 aspect ratio (MUST for TikTok)
  - First 3 seconds hook strength
  - Sound-off viewing consideration (captions needed)
  - Native, organic look (overly polished ads perform worse)
  - Trend alignment (sounds, effects, transitions)
  - Creator-style authenticity
  - Fast-paced editing (attention span: 8 seconds)
  - Hashtag challenge potential`,

    linkedin: `
  - Professional, polished aesthetic
  - B2B value proposition clarity
  - Credibility indicators (stats, logos, certifications)
  - Desktop vs mobile optimization (more desktop usage than other platforms)
  - Thought leadership positioning
  - Corporate color schemes
  - Executive imagery appropriateness
  - Lead gen form compatibility
  - Document ad format consideration`,

    twitter: `
  - Landscape 16:9 or square 1:1 formats
  - High contrast for fast scrolling
  - Text brevity (complements tweet copy)
  - Trending topic relevance
  - Quote tweet screenshot consideration
  - Conversation starter potential
  - Poll integration opportunity
  - Real-time/timely content alignment`,
  };

  return (
    checks[platform.toLowerCase()] ||
    `
  - Standard ad specifications for ${platform}
  - Platform-specific best practices
  - Audience behavior patterns on ${platform}
  - Technical requirements and limitations`
  );
}

/**
 * Build the complete analysis prompt for Gemini
 */
export function buildAnalysisPrompt(context: AnalysisContext): string {
  const { industry, platform, targetAudience, goal } = context;

  return `You are a senior creative director analyzing advertising performance. Provide a concise, actionable analysis.

## FIRST IMPRESSION
**Scroll-Stop Score: X/10**

In 2-3 sentences, explain:
- Will this stop someone mid-scroll? Why or why not?
- What's the immediate visual impact?

## DESIGN QUALITY
**Design Score: X/10**

Evaluate in 3-4 bullet points:
- Color scheme and readability
- Typography effectiveness (mobile-friendly?)
- Image quality and authenticity
- Overall professional polish

## MESSAGE & CTA
**Message Clarity: X/10**

Assess:
- Is the value proposition immediately clear?
- Call-to-action strength and visibility
- Copy effectiveness (benefit-focused vs feature-heavy)

## PLATFORM FIT (${platform})
**Platform Optimization: X/10**

Key ${platform} considerations:
${getPlatformSpecificChecks(platform)}

Does this ad follow best practices? What's missing?

## AUDIENCE ALIGNMENT (${targetAudience})
**Audience Fit: X/10**

- Does the visual style and tone match ${targetAudience}?
- Any cultural or demographic misalignments?

## PREDICTED PERFORMANCE (Goal: ${goal})

**Expected CTR**: X%
**Conversion Potential**: Low/Medium/High
**Overall Performance**: Top 10% / Top 25% / Average / Below Average

Brief justification (2-3 sentences)

## TOP 3 IMPROVEMENTS

List the 3 most impactful changes to make (prioritized):

1. **[Change Type]**: Specific actionable recommendation
2. **[Change Type]**: Specific actionable recommendation
3. **[Change Type]**: Specific actionable recommendation

## RED FLAGS

Any critical issues that could hurt performance or compliance?

## FINAL VERDICT
**Overall Score: X/10**

One paragraph summary: Would you approve this ad? Why or why not? What's the single biggest strength and weakness?

---

Keep responses concise and scannable. Focus on actionable insights marketing teams can act on immediately.`;
}
