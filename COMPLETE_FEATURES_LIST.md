# AI Learning Assistant - Features Overview

## Project Overview
- **Name**: AI-Powered Learning & Productivity Assistant for Beginner Developers
- **Tech Stack**: React + Vite, Node.js/Express, AWS Bedrock (planned)
- **Target Audience**: Beginner developers and college students
- **Status**: MVP Complete

---

## Core Features

### 1. Public Landing Page
**Route**: `/`

- Sticky navigation bar with glassmorphism effect
- Hero section with animated gradient background
- Statistics display: 20+ topics, AI-powered, 100% free
- Three feature cards with hover animations
- "Why Choose Us" section highlighting benefits
- User persona cards (Beginners, Students, Self-learners)
- Call-to-action section and professional footer
- Animated background shapes and smooth scroll effects
- Fully responsive design

### 2. Authentication System
**Routes**: `/login`, `/signup`

- Modern SaaS-style authentication page
- Toggle between Sign In and Sign Up modes
- Glassmorphism card design with two‑panel layout
- Form validation (email format, password length ≥6)
- localStorage‑based authentication with session persistence
- Demo account: `demo@example.com` / `demo123`
- Protected routes and auto‑redirection for logged‑in users

### 3. User Dashboard
**Route**: `/dashboard`

- Personalized welcome message
- Three clickable feature cards (AI Chat, Code Debug, Learning Path)
- Quick navigation to all tools
- Logout button in top‑right corner
- Gradient background and hover animations on cards

### 4. AI Chat Interface
**Route**: `/chat`

- Structured AI responses with four distinct sections:
  - **Simple Explanation** (blue background)
  - **Key Points** (yellow background with bullet list)
  - **Code Example** (dark code block with syntax highlighting)
  - **Next Suggested Topic** (clickable button)
- Syntax highlighting via Prism.js
- Copy code button with visual feedback
- Voice input using Web Speech API
- Persistent chat history per conversation
- Multiple conversation management
- Sidebar containing:
  - List of previous chats
  - New chat button
  - Settings option
  - Clear all conversations
  - Logout button
- Auto‑scroll to latest message
- Backend integration on port `3001`

**Supported topics** (10 examples):
- Variables & Data Types
- Functions & Parameters
- REST APIs & HTTP
- Loops & Iteration
- Arrays & Collections
- Objects & Classes
- Classes & OOP
- Async/Await
- Promises
- Callbacks

### 5. Code Debug Assistant
**Route**: `/debug`

- Two‑panel layout: code editor on left, analysis panel on right
- Line numbers in editor
- Language selector supporting 14 languages:
  - Bash, C, C++, C#, CSS, Go, HTML, Java, JavaScript, PHP, Python, Rust, SQL, TypeScript
- Real‑time error detection (unmatched brackets, missing semicolons, `var` usage warnings)
- Statistics dashboard: lines of code, number of issues
- Example code loaders (buggy, clean, async)
- Empty state with instructions and loading spinner

**Analysis output**:
- **Issue Found** (red box)
- **Why This Happens** (blue box)
- **Fixed Code** (green box with copy button)
- **Learning Tip** (yellow box)

**Action buttons**:
- Paste code from clipboard
- Upload file (supports .js, .jsx, .py, .java, .cpp, .c, .html, .css)
- Analyze (primary action)
- Ask follow‑up question (navigates to chat)

### 6. Adaptive Learning Path
**Route**: `/learning-path`

- Green gradient header with user greeting
- Streak counter (e.g., "3 Day Streak")
- Level badge (e.g., "Level 5 Coder")
- XP progress bar: 50 XP per completed topic, level up every 500 XP
- Overall progress bar with percentage
- Dynamic level title (Beginner → Intermediate → Advanced)
- Completed topics section (green cards with completion dates)
- Recommended next steps (yellow primary cards, gray secondary cards)
- Priority badges (High, Medium, Low)
- AI recommendation explanations
- Focus area detection (highlights weak topics)
- Locked topics section (6 advanced topics)
- AI insight box (blue border)
- Demo button to simulate completing topics

**Gamification elements**:
- XP system
- Level progression
- Streak tracking
- Locked content unlocks at milestones
- Weak area detection after 3 and 5 topics

**Personalization**:
- Individual progress per user (stored in `localStorage` with key `learningProgress_{email}`)
- Streak calculation based on last active date
- Simulated AI recommendations
- Adaptive difficulty progression

**Tracked data**:
- Overall progress percentage
- Completed topics with timestamps
- Current level, XP, and next level XP
- Streak count and last active date
- Identified weak areas
- Locked topics list
- Recommended next topics

---

## User Flow

### New User
1. Visit `/` (landing page)
2. Click "Get Started" → navigate to `/login`
3. Sign up (or use demo account)
4. Redirect to `/dashboard`
5. Choose a feature: Chat, Debug, or Learning Path

### Returning User
1. Visit `/` → auto‑redirect to `/dashboard` if logged in
2. Continue using any feature; progress is preserved
3. Logout to return to public landing page

---

## Design System

### Color Palette
- Primary Purple: `#667eea`
- Secondary Violet: `#764ba2`
- Success Green: `#48bb78`
- Warning Yellow: `#f59e0b`
- Error Red: `#ef4444`
- Info Blue: `#3b82f6`
- Dark Text: `#2d3748`
- Light Text: `#718096`

### Typography
- Font stack: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Heading weight: 700–800
- Body weight: 400–600
- Code blocks: monospace

### UI Components
- Rounded corners (8px–20px)
- Soft shadows
- Gradient backgrounds
- Glassmorphism effects
- Smooth transitions (0.3s)
- Hover animations

---

## Technical Implementation

### Frontend
- React 18 with Vite
- React Router v6 for routing
- Pure CSS (no frameworks)
- State management with React hooks (`useState`, `useEffect`)
- localStorage for persistence
- Web Speech API for voice input
- Clipboard API for copy functionality

### Backend
- Node.js with Express
- Port: `3001`
- Endpoints:
  - `GET /health` – health check
  - `GET /` – API info
  - `POST /chat` – AI chat endpoint
- Response format: structured JSON

### Planned (AWS)
- Amazon Bedrock for AI model integration
- AWS Lambda for serverless functions
- API Gateway
- S3 for static hosting
- CloudFront for CDN

---

## Roadmap

### Phase 2 (Post‑MVP)
- AWS Bedrock integration
- Persistent database (MongoDB / DynamoDB)
- Social features (share progress, badges)
- Weekly challenges
- Skill radar chart
- Interactive code playground
- Video tutorials

### Phase 3 (Production)
- Mobile app (React Native)
- Collaborative learning (rooms, pair debugging)
- Mentor matching
- Job board integration
- Certificate generation
- Premium subscription features
- Public API for developers

---

## Key Highlights
- Complete user journey from landing to personalized learning
- Modern, responsive UI with consistent design language
- Gamification and adaptive learning paths
- Real‑time code debugging with language support
- Voice‑enabled AI chat with structured responses
- Fully client‑side authentication and progress tracking
- Modular architecture ready for AWS integration

---

*Last updated: March 6, 2026*  
*Version: 1.0 (MVP)*
