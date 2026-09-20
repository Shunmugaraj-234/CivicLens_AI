# CivicLens AI

> **Tagline:** *"See the problem. Report it. Track the impact."*

**CivicLens AI** is a production-quality, open-innovation full-stack web application that transforms everyday citizen observations into structured, transparent, and actionable civic intelligence.

---

## 🌟 Key Features

1. **Startup-Quality Landing Page**: Interactive hero banner with live animated civic map preview, 4-step workflow showcase, before/after evidence sliders, and statistics counter.
2. **1-Click Hackathon Demo Switcher**: Instantly switch between **Citizen** (`Arjun Mehta`), **Field Moderator** (`Officer Priya Sharma`), and **Administrator** (`Director Rajesh Varma`) profiles via the sticky top bar.
3. **Step-by-Step Reporting Wizard**:
   - Step 1: Photo capture / video drag-and-drop file upload.
   - Step 2: Auto GPS location detection & Leaflet interactive map picker.
   - Step 3: Multimodal Gemini AI image analysis (Category, Subcategory, Severity, Risk Score 0-100, Hazards, Explanation).
   - Step 4: AI Generated formal municipal complaint draft.
   - Step 5: Duplicate Detection check (200m radius search & visual match) with option to *"Support Existing Issue"* (+10 XP) or *"Submit as New Issue"*.
   - Step 6: Dynamic Priority Score calculation (0-100) and instant submission with celebratory confetti.
4. **Interactive Civic Map & Heatmap**: Full-screen Leaflet & OpenStreetMap grid with custom severity pin colors, marker clustering, popups, and a toggleable **Issue Density Heatmap**.
5. **Issue Details & Before/After Slider**: Interactive visual comparison slider for resolved municipal repairs.
6. **Moderator Operations Queue**: Auto-sorted priority queue (0-100 score), status workflow manager (Reported → Under Review → Verified → Assigned → In Progress → Resolved), and resolution evidence uploader.
7. **Admin Analytics Dashboard**: Recharts bar & pie visualizations, district Civic Health matrix, and CSV report export.
8. **Civic AI Assistant ("CivicLens AI")**: Database-aware chatbot answering questions (*"Show critical issues near me"*, *"How many potholes are reported?"*, *"What is my civic impact score?"*) with embedded interactive UI action cards.
9. **CivicPulse Signature Feature**: Real-time daily civic digest summarizing trends, high-priority issues, and predictive risk forecasts (*"Area X has an 87% probability of recurring drainage issues"*).
10. **Gamification & Leaderboard**: Civic XP points, Level 7 "Civic Champion", achievement badges, and privacy profile controls.

---

## 🚀 Getting Started

### 1. Run Development Server

```bash
npm run dev
```

Open https://civiclens-ai-two.vercel.app in your browser.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables + Dark Theme
- **Maps**: Leaflet + OpenStreetMap + Custom DivIcon Markers
- **AI Integration**: Google Gemini API (`@google/generative-ai`) + Heuristic Fallback Engine
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Canvas Confetti & CSS Keyframe Transitions
