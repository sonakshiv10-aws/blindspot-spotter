# Blindspot Spotter

**AI-powered assumption validation tool that helps founders identify hidden risks in 30 seconds.**

[**Try it live →**](https://blindspot-spotter.vercel.app)

![Blindspot Spotter Demo](https://via.placeholder.com/800x400?text=Assumption+Matrix+Screenshot)

---

## The Problem

80% of startups fail not because they built the wrong thing, but because they never tested the **right assumptions**. Founders spend months building products based on untested beliefs, only to discover critical flaws too late.

Common blind spots:
- "Users will pay $15/month" ← Did you test willingness to pay?
- "We can acquire customers for <$50" ← What's your actual CAC?
- "The technology works at scale" ← Have you stress-tested it?

---

## The Solution

Blindspot Spotter uses AI to:
1. **Break down your idea** into 6-8 testable assumptions using first principles
2. **Score each assumption** on RISK (impact if wrong) and TESTABILITY (cost/time to validate)
3. **Map assumptions visually** on a 2×2 matrix showing which to test first
4. **Generate practical experiments** ($0-$3K, 1-4 weeks) with success criteria

---

## Features

### 🤖 **Two Input Modes**
- **AI Analysis:** Describe your idea, get AI-generated assumptions
- **Manual Entry:** Input your own assumptions for analysis

### 📊 **Smart Prioritization**
Visual matrix with four quadrants:
- **Test Now** (high risk + easy to test) → Top priority
- **Critical Risk** (high risk + hard to test) → Dangerous blind spots
- **Quick Wins** (low risk + easy to test) → Nice-to-haves
- **Defer** (low risk + hard to test) → Lowest priority

### 🧪 **Actionable Experiments**
Each assumption includes:
- 3-sentence test method
- Realistic cost estimate ($0-$10K)
- Time to complete (3 days - 12 weeks)
- Success criteria with concrete metrics

### 🚨 **Hidden Blind Spot Detection**
AI flags 2-3 dangerous assumptions founders typically miss

---

## Who It's For

### **Primary: Early-Stage Founders**
Validate your startup idea before building. Use when:
- Exploring a new product concept (0→1)
- Pivoting to a new direction
- Preparing for investor conversations
- Planning your MVP roadmap

### **Secondary: Product Designers**
De-risk new feature designs. Use when:
- Designing greenfield features from scratch
- Creating first-time user flows (onboarding, etc.)
- Entering new user segments
- Planning UX research sprints

**Note:** Best for NEW ideas where you have no data yet. If you have analytics or user research, use that instead.

---

## Example Use Case

**Input (AI Mode):**
> "AI-powered scholarship matching platform for high school students"

**Output:**
- 7 assumptions identified
- 3 marked as "Critical Risk" (high impact + expensive to test)
- 4 marked as "Test Now" (high impact + cheap to validate)
- Practical experiments like: "Interview 15 high school counselors to validate referral model assumption - Cost: $0, Time: 2 weeks"

---

## Tech Stack

- **Framework:** Next.js 14 + TypeScript
- **AI:** Anthropic Claude Sonnet 4 API
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Vercel (auto-deploy from GitHub)
- **Charts:** Custom SVG-based 2×2 matrix visualization

---

## How It Works

### The Methodology

**1. First Principles Decomposition**
Breaks product ideas into core assumptions across:
- User Behavior (will people use/pay?)
- Market Dynamics (does the market work this way?)
- Technical Feasibility (can we build it?)
- Business Model (do the economics work?)
- Operations (can we deliver sustainably?)

**2. Risk Scoring (1-10)**
- **9-10:** Critical - entire business fails if wrong
- **7-8:** High - significantly impacts growth/economics
- **5-6:** Moderate - affects efficiency but adaptable
- **1-4:** Low - nice-to-have optimizations

**3. Testability Scoring (1-10)**
- **8-10:** Easy - test in 1-2 weeks with <$1000
- **5-7:** Moderate - takes 2-4 weeks, $1000-$3000
- **1-4:** Hard - requires 4-12 weeks, $3000-$10,000

**4. Experiment Design**
Provides concrete, low-cost validation methods:
- Landing pages + ads
- User interviews
- Concierge MVPs (manual service)
- Small pilots with 20-50 users
- Competitive analysis

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Anthropic API key

### Installation
```bash
# Clone the repository
git clone https://github.com/sonakshiv10-aws/blindspot-spotter.git

# Navigate to project
cd blindspot-spotter

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Anthropic API key to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Development
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Project Structure
```
blindspot-spotter/
├── src/
│   ├── pages/
│   │   ├── index.tsx          # Main landing page with input modes
│   │   └── api/
│   │       └── analyze.ts     # API route for Claude integration
│   ├── components/
│   │   └── AnalysisMatrix.tsx # 2×2 matrix visualization
│   └── styles/
├── public/
└── package.json
```

---

## Roadmap

**v1 (Current):**
- ✅ AI-powered assumption generation
- ✅ Manual assumption entry
- ✅ Risk/testability scoring
- ✅ Visual 2×2 matrix
- ✅ Experiment recommendations

**v2 (Future):**
- [ ] Save/export analysis as PDF
- [ ] Share via unique URL
- [ ] Track tested vs. untested assumptions
- [ ] Integration with experiment tracking tools
- [ ] Team collaboration features

---

## Contributing

This is a personal portfolio project, but feedback is welcome!

**Found a bug?** Open an issue on GitHub
**Have a suggestion?** DM me on [LinkedIn](https://linkedin.com/in/sonakshiverma)

---

## License

MIT License - feel free to fork and modify for your own use.

---

## About

Built by [Sonakshi Verma](https://linkedin.com/in/sonakshiverma) as part of a career transition from architecture → product management.

**Why I built this:** After spending 6 months building a product based on untested assumptions, I learned the hard way that validation beats vision. This tool automates the assumption mapping process I wish I'd had from day one.

**Tech used:** Next.js, TypeScript, Claude AI, Tailwind CSS
**Built in:** 2 weeks (November 2025)

---

## Feedback & Contact

- **LinkedIn:** [sonakshiverma](https://linkedin.com/in/sonakshiverma)
- **Email:** sonakshiv10@gmail.com
- **Live Demo:** [blindspot-spotter.vercel.app](https://blindspot-spotter.vercel.app)

---

**⭐ If this tool helped you avoid a costly mistake, consider starring the repo!**