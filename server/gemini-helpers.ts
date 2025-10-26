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

  return `You are a senior creative director analyzing advertising performance.

**ANALYZE THIS AD CREATIVE:**

## 1. FIRST IMPRESSION (3-Second Rule)
- ⏱️ **Scroll-Stop Power**: Will this stop someone mid-scroll? (1-10)
- 👁️ **Visual Hierarchy**: What catches the eye first, second, third?
- 🎯 **Message Clarity**: Can you understand the offer in 3 seconds?

## 2. DESIGN FUNDAMENTALS
- 🎨 **Color Psychology**:
  - Primary colors used and their emotional impact
  - Color contrast ratio (readability)
  - Does it match ${industry} conventions or break them strategically?

- ✍️ **Typography**:
  - Font choices (modern, classic, bold, elegant?)
  - Readability at small sizes (mobile consideration)
  - Headline vs body text hierarchy
  - Is there too much or too little text?

- 📐 **Layout & Composition**:
  - Rule of thirds compliance
  - White space usage (breathing room)
  - Visual balance and symmetry
  - Focal point effectiveness

- 🖼️ **Imagery**:
  - Image quality and resolution
  - Authentic vs stock photo feel
  - Product/service visibility
  - Human faces (builds trust?)

## 3. MARKETING EFFECTIVENESS

- 💬 **Copy Impact**:
  - Headline strength (compelling? benefit-focused?)
  - Value proposition clarity
  - Pain point addressing
  - Feature vs benefit balance

- 🎯 **Call-to-Action**:
  - CTA visibility and prominence
  - Action verb strength ("Buy Now" vs "Get Started" vs "Learn More")
  - Urgency/scarcity elements
  - Multiple CTAs or single focus?

- 🧠 **Psychological Triggers**:
  - Social proof elements (testimonials, user count, ratings)
  - Scarcity ("Limited time", "Only X left")
  - Authority (credentials, certifications, awards)
  - Reciprocity (free trial, discount, bonus)
  - FOMO (fear of missing out)

## 4. PLATFORM OPTIMIZATION (${platform})

- 📱 **${platform} Best Practices**:
  ${getPlatformSpecificChecks(platform)}

- 🔧 **Technical Specs**:
  - Aspect ratio correctness
  - Safe zones for text (avoiding cutoff)
  - File size/load time considerations
  - Animated vs static appropriateness

## 5. AUDIENCE RESONANCE (${targetAudience})

- 👥 **Target Audience Alignment**:
  - Visual style matches age group preferences
  - Language/tone appropriateness
  - Cultural sensitivity and inclusivity
  - Aspirational vs relatable balance

- 🌍 **Diversity & Inclusion**:
  - Representation in imagery
  - Accessible design (color blindness, dyslexia-friendly fonts)
  - Universal appeal vs niche targeting

## 6. COMPETITIVE POSITIONING

- 🏆 **Differentiation**:
  - Unique visual style vs category norms
  - Standing out vs fitting in
  - Memorable elements
  - Brand personality expression

- 📊 **Current Trends** (2025):
  - Minimalism vs maximalism trend
  - AI-generated imagery considerations
  - Authenticity movement alignment
  - Video-first world considerations (is static enough?)
  - User-generated content (UGC) style
  - Bold typography trends
  - Gradient and glassmorphism usage

## 7. CONVERSION POTENTIAL (Goal: ${goal})

- 💰 **Estimated Performance Metrics**:
  - **CTR Prediction**: X% (based on design quality)
  - **Engagement Rate**: Expected likes/shares/comments
  - **Conversion Potential**: Low/Medium/High
  - **A/B Test Priority**: Which element to test first

- ⚠️ **Red Flags**:
  - Anything that might hurt performance
  - Legal/compliance concerns (health claims, etc.)
  - Brand safety issues

## 8. ACTIONABLE RECOMMENDATIONS

Provide 3 tiers of improvements:

**🚀 Quick Wins** (can implement in <1 hour):
- Example: Increase CTA button size by 20%
- Example: Change headline to benefit-focused

**💡 Medium Impact** (1-3 hours of work):
- Example: Replace stock photo with authentic imagery
- Example: Adjust color scheme for better contrast

**🎯 Major Overhaul** (if needed):
- Example: Complete layout restructure
- Example: Different creative concept

## 9. COMPETITIVE COMPARISON

How does this compare to typical ${industry} ads on ${platform}?
- Better/Worse/Average
- What are competitors doing differently?
- Gaps in the market this could fill

## 10. FINAL VERDICT

- **Overall Score**: X/10
- **Would I approve this ad?**: Yes/No and why
- **Predicted Performance**: Top 10% / Top 25% / Average / Below Average
- **One-Sentence Summary**: [Your summary here]

Format your response with clear headings, use emojis for scannability, and be brutally honest but constructive.`;
}
