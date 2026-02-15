import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productContext, manualAssumptions, mode } = req.body;

    if (mode === 'ai' && !productContext) {
      return res.status(400).json({ error: 'Product context is required' });
    }
    if (mode === 'manual' && (!manualAssumptions || manualAssumptions.length === 0)) {
      return res.status(400).json({ error: 'Manual assumptions are required' });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    let prompt;

    if (mode === 'manual') {
      // Manual mode prompt
      prompt = `You are a sharp product strategist with deep experience in startups and FAANG growth teams. The user has provided these assumptions about their product idea:
    
    ${manualAssumptions.map((a: string, i: number) => `${i + 1}. ${a}`).join('\n')}
    
    Your job: Analyze each assumption and assess its RISK and TESTABILITY. Use the exact assumption text provided by the user.
    
    RISK (how bad if wrong):
    - 9-10 (CRITICAL): Entire business model collapses. Core value prop fails.
    - 7-8 (HIGH): Significantly impacts growth, unit economics, or requires major pivot
    - 5-6 (MODERATE): Affects efficiency or speed but business can adapt
    - 1-4 (LOW): Nice-to-have features or optimizations
    
    TESTABILITY (how easy/cheap to validate):
    CRITICAL: Assumption testing should be affordable for bootstrapped founders. Higher testability = cheaper + faster.

- 8-10 (EASY): 3-14 days, <$1000
  Methods: Landing pages + ads ($200-800), user interviews ($0-500), surveys ($100-300), desk research ($0-200), concierge MVP (manual service), mockups + 10-20 user tests
  Examples: "Test willingness to pay with pricing page", "Interview 15 target users", "Run Google Ads to fake door"
  
- 5-7 (MODERATE): 2-4 weeks, $1000-3000
  Methods: Simple prototype + user testing ($500-2000), wizard-of-oz MVP ($800-2500), small pilot with 20-50 users ($1000-3000), hire contractors for one-day test ($500-1500)
  Examples: "Build clickable prototype + test with 30 users", "Run manual valet service for 3 days"
  
- 1-4 (HARD): 4-12 weeks, $3000-10,000
  Methods: Working MVP with real backend, regulatory/legal approval, multi-week field testing with equipment, specialized facilities/insurance
  Examples: "Build functional AI model + test accuracy", "Get insurance underwriting approval", "Deploy IoT sensors for 6 weeks"

Rules:
- If experiment costs >$10K, it's too expensive for assumption testing - reduce scope
- If experiment takes >3 months, break it into smaller testable assumptions
- Always start with the cheapest possible test that gives valid signal

CRITICAL ENFORCEMENT:
- NEVER assign testability >7 if cost exceeds $1500
- NEVER assign testability >7 if timeframe exceeds 3 weeks  
- NEVER assign testability >4 if cost exceeds $5000
- Cost and testability MUST be inversely related: higher cost = lower testability score
- Validate every experiment: Does the testability score match the cost/time? If not, adjust the score down.
    
    Respond with ONLY valid JSON (no markdown, no code blocks):
    {
      "firstPrinciplesInsight": "One sentence about the core belief these assumptions depend on",
      "assumptions": [
        {
          "id": "assumption-1",
          "text": "The exact assumption text from user input",
          "isHiddenBlindSpot": false,
          "risk": 7,
          "testability": 8,
          "category": "User Behavior",
          "experiment": {
            "name": "2-4 word action name",
            "method": "Practical 3-sentence test method. (1) What to build/create and setup, (2) How to execute and what specific metrics to track, (3) Success criteria with concrete numbers/benchmarks.",
            "timeframe": "1-2 weeks",
            "cost": "$500, specific tools needed"
          }
        }
      ]
    }
    
    Rules:
    - Use the EXACT assumption text provided by the user
    - Mark ALL as isHiddenBlindSpot: false (user provided these assumptions explicitly, so none are "hidden")
    - Categories: "User Behavior", "Market Dynamics", "Technical Feasibility", "Business Model", "Operations"
    - Experiments should be realistic, actionable, and include success metrics
    
    Respond with ONLY the JSON object, nothing else.`;
    } else {
      // AI mode prompt (your existing prompt)
      prompt = `You are a sharp product strategist with deep experience in startups and FAANG growth teams. You help founders uncover hidden assumptions using first principles thinking. Be direct, practical, and concrete.
    
        The user described their product idea:
        "${productContext}"
        
        Your job: Break this down into 6-8 specific, testable assumptions. Think like a skeptical investor asking "what has to be true for this to work?"
        
        Focus on assumptions across these strategic areas:
        - USER BEHAVIOR: Will people actually use this? Change their habits? Pay for it?
        - MARKET DYNAMICS: Does the market work the way we assume? Competitive landscape? Distribution channels?
        - TECHNICAL FEASIBILITY: Can we build this at the quality/scale needed? Data availability?
        - BUSINESS MODEL: Will unit economics work? Pricing? Customer acquisition cost?
        - OPERATIONS: Can we deliver this sustainably? Team capabilities? Partnerships needed?
        
        CRITICAL: Use this framework to assess RISK (how bad if wrong):
        - 9-10 (CRITICAL): If wrong, the entire business model collapses. Core value prop fails.
          Examples: "Users will pay for this", "The core technology works at required accuracy", "Legal/regulatory allows this"
        - 7-8 (HIGH): Significantly impacts growth, unit economics, or requires major pivot
          Examples: "Users return monthly", "CAC < $100 and LTV > $300", "We can acquire 1000 users in 6 months"
        - 5-6 (MODERATE): Affects efficiency or speed but business can adapt
          Examples: "Users prefer self-service over demos", "Onboarding takes <5 min", "Feature X drives retention"
        - 1-4 (LOW): Nice-to-have features or optimizations
          Examples: "Users like dark mode", "Push notifications increase engagement by 20%"
        
        TESTABILITY (how easy/cheap to validate):
        CRITICAL: Assumption testing should be affordable for bootstrapped founders. Higher testability = cheaper + faster.

- 8-10 (EASY): 3-14 days, <$1000
  Methods: Landing pages + ads ($200-800), user interviews ($0-500), surveys ($100-300), desk research ($0-200), concierge MVP (manual service), mockups + 10-20 user tests
  Examples: "Test willingness to pay with pricing page", "Interview 15 target users", "Run Google Ads to fake door"
  
- 5-7 (MODERATE): 2-4 weeks, $1000-3000
  Methods: Simple prototype + user testing ($500-2000), wizard-of-oz MVP ($800-2500), small pilot with 20-50 users ($1000-3000), hire contractors for one-day test ($500-1500)
  Examples: "Build clickable prototype + test with 30 users", "Run manual valet service for 3 days"
  
- 1-4 (HARD): 4-12 weeks, $3000-10,000
  Methods: Working MVP with real backend, regulatory/legal approval, multi-week field testing with equipment, specialized facilities/insurance
  Examples: "Build functional AI model + test accuracy", "Get insurance underwriting approval", "Deploy IoT sensors for 6 weeks"

Rules:
- If experiment costs >$10K, it's too expensive for assumption testing - reduce scope
- If experiment takes >3 months, break it into smaller testable assumptions
- Always start with the cheapest possible test that gives valid signal

CRITICAL ENFORCEMENT:
- NEVER assign testability >7 if cost exceeds $1500
- NEVER assign testability >7 if timeframe exceeds 3 weeks  
- NEVER assign testability >4 if cost exceeds $5000
- Cost and testability MUST be inversely related: higher cost = lower testability score
- Validate every experiment: Does the testability score match the cost/time? If not, adjust the score down.
        
        Respond with ONLY valid JSON (no markdown, no code blocks)
        STRICTLY USE THIS SCHEMA (property names must match exactly):
        {
          "firstPrinciplesInsight": "One sentence: the core belief this idea depends on",
          "assumptions": [
            {
              "id": "assumption-1",
              "text": "Clear, specific statement (e.g., 'Students will input accurate GPA data without verification' not 'data quality is good')",
              "isHiddenBlindSpot": true,
              "risk": 9,
              "testability": 7,
              "category": "User Behavior",
              "experiment": {
                "name": "Short, action-oriented name (2-4 words)",
                "method": "Practical 3-sentence test method. (1) What to build/create and setup, (2) How to execute and what specific metrics to track, (3) Success criteria with concrete numbers/benchmarks.",
                "timeframe": "1-2 weeks",
                "cost": "$500, landing page, 100 signups"
              }
            }
          ]
        }
        
        Quality Guidelines:
        ✅ DO: "High school counselors will actively recommend our tool to 50+ students each"
        ✅ DO: "Parents will pay $15/month for college guidance vs. using free alternatives"
        ✅ DO: "Our AI can predict college acceptance with 75%+ accuracy using available data"
        ❌ DON'T: "Users want personalized recommendations" (too vague)
        ❌ DON'T: "The product will be easy to use" (not specific or testable)
        ❌ DON'T: "Students care about college admissions" (known fact, not assumption)
        
        Rules:
        - Generate exactly 6-8 assumptions
        - Mark 2-3 as hidden blind spots (isHiddenBlindSpot: true) - the MOST dangerous + least obvious ones that the founder likely hasn't considered
        - Spread across risk levels: at least 2 critical/high-risk (7-10), 2-3 moderate (5-6), 1-2 lower-risk (3-4)
        - Distribute across quadrants on the matrix for visual clarity
        - Categories: "User Behavior", "Market Dynamics", "Technical Feasibility", "Business Model", "Operations"
        - Make assumptions falsifiable and concrete
        - Experiments should be realistic, actionable, and include success metrics
        
        Respond with ONLY the JSON object, nothing else.`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Clean up any markdown formatting
const cleanedResponse = responseText
.replace(/```(?:json|JSON)?\s*/g, '') // Remove opening code blocks
.replace(/```\s*/g, '') // Remove closing code blocks  
.trim();
    
    console.log('Claude response:', cleanedResponse);
    
    const analysis = JSON.parse(cleanedResponse);

    // Validate we got multiple assumptions
    if (!analysis.assumptions || analysis.assumptions.length < 5) {
      throw new Error('Invalid response: Expected 6-8 assumptions');
    }

    return res.status(200).json(analysis);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze assumption',
      details: error.message 
    });
  }
}