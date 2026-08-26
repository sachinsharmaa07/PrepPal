<div align="center">
  <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop" alt="PrepPal Cover" width="100%" style="border-radius: 12px; margin-bottom: 24px;" />
  <br/>
  <h1>PrepPal — AI Career Operating System</h1>
  <p><strong>A placement portal helps you apply. PrepPal helps you become employable, choose the right opportunity, apply intelligently, and perform flawlessly in your interviews.</strong></p>
</div>

<br/>

## 🚀 The Vision

PrepPal is no longer just a "Job Portal with GenAI." It is an end-to-end **Intelligence Workspace** for your career. Built specifically for top-tier candidates targeting MAANG and beyond, it fuses a unified UI shell (Next.js 15, Tailwind, Framer Motion) with deep algorithmic evaluation.

---

## 🛠 Features (The 5 Pillars)

### 1. The Cockpit (Dashboard)
A `8+4` grid dashboard that acts as the mission control for your placement season. It tracks your `Readiness Score`, parses upcoming interviews, and calculates the exact probability of your placement based on current performance data.

### 2. Opportunity Map (Jobs)
Instead of an endless feed of JDs, jobs are analyzed into a **"Mission Briefing"**. 
The AI explicitly maps your existing CV against the Job Description, highlights skill gaps, and generates a hyper-personalized **"Prepare Me" Syllabus** (Day 1: System Design, Day 2: React Core).

### 3. AI Interview Room 🎙
A stunning, distraction-free virtual environment for practicing Technical, Behavioral, and System Design rounds. 
- **The Sparkle UI**: The interviewer is not a disruptive chatbot, but a calm, pulsing audio-visualizer that lets you focus entirely on your answer.
- **Diagnostic Timeline**: Post-interview, you receive a video-editor-style timeline (`00:00 - 30:00`) pinpointing exactly where your answers were strong or weak, teaching you the STAR method.

### 4. Master CV/ATS Engine 📄
A split-screen diagnostic command center. 
- **Trust-First AI**: The AI suggests bullet point optimizations but forces you to explicitly `Accept` or `Reject` them, maintaining the integrity of your data.
- **ATS Canvas**: Real-time meters for Keyword match, Formatting, and Experience relevance.

### 5. Intelligent Coding IDE 💻 (MANG 250)
A specialized LeetCode alternative built directly into the OS.
- **Progressive Hinting**: The AI Mentor progressively reveals hints (Concept → Approach → Pseudocode) rather than just giving away the solution.
- **The Interview Bridge**: When a correct solution is submitted, you are immediately prompted to *"explain your approach like you would in a technical interview"*, bridging you right back to the AI Interview Room.
- **MANG 250 Integration**: Includes a curated, paginated database of 250 high-priority interview problems.

---

## 🏗 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Custom Design System (`JetBrains Mono` for tech, `Geist` for body)
- **State/Animations**: React + Framer Motion
- **AI/LLM**: Groq SDK (Llama 3 / Mixtral for ultra-low latency inference)
- **Code Evaluation**: In-browser sandbox (Fallback to Judge0)
- **Testing**: Playwright (E2E), Vitest (Unit)

---

## 🧪 Testing

We utilize Playwright for E2E user journeys to ensure the critical paths (Interview Room submission, CV ATS parsing, and IDE code evaluation) remain stable.

\`\`\`bash
# Run the E2E suite
npx playwright test
\`\`\`

---

## 📝 Setup

\`\`\`bash
# 1. Install dependencies
pnpm install

# 2. Run the MANG 250 AI Enrichment Script (to generate problems and test cases)
npx tsx apps/api/prisma/seed/enrichMang250.ts

# 3. Start development server
pnpm dev
\`\`\`

---
*Designed & Engineered for Placement Excellence.*
