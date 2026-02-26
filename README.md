**IRIS-TS** (Atmosphere Engine) is an advanced, AI-driven architectural synthesizer that dynamically generates, refines, and deploys completely functioning, ultra-premium front-end web environments. 

By simply uploading an image (for visual identity) and providing structural prompts, IRIS-TS leverages the **Google Gemini Generative AI** to instantly write, assemble, and render production-ready HTML, Tailwind CSS, and Vue 3 logic—all within a live sandbox environment.

---

### ⚡ Key Features

- **🧠 Auto-Synthesizing Architecture**: Upload an image or provide a strict UI/UX prompt. The Atmosphere Engine parses the aesthetic (colors, mood, styling) and generates a perfectly responsive, single-page application targeting that identity.
- **🔄 Sovereign Refinement Engine**: Don't like a specific section? Chat with the AI. Provide iterative prompts (e.g., *"Change the hero section to an image carousel"* or *"Make the typography brutalist"*) and IRIS-TS will surgically update the live DOM without rewriting the entire application.
- **🛠️ Interactive Live-Edit Mode**: Visually manipulate the generated output. Click directly on rendered images to trigger native file uploads and swap assets on the fly. The underlying code automatically updates to reflect your DOM changes.
- **🚀 One-Click Vercel Deployment**: Bring Your Own Key (BYOK). Enter your Vercel API token to instantaneously push your generated architecture to a live, public, static production URL globally. 
- **📦 ZIP Export**: Instantly package your generated `index.html`, `tailwind.config.js`, and all localized `assets/` into a downloadable `.zip` file for offline hosting or custom backend integration.
- **🛡️ Self-Healing JSON Parser**: Features an aggressive backend auto-heal mechanism that parses, scrubs, and fixes unescaped characters from massive AI code blocks to prevent syntax crashes.

---

### 🏗️ Technology Stack

- **Frontend Application**: Vue 3 (Composition API), Vite, JSZip, Tailwind CSS 
- **Backend API Layer**: Hono.js (TypeScript), Node.js, Vercel API
- **AI Engine**: `@google/generative-ai` (Gemini Foundation Models) with built-in Rate Limit & API Key Rotation logic.

---

### 🚀 Local Development Setup

#### 1. Requirements
- Node.js (v18+ recommended)
- A Google Gemini API Key
- A Vercel API Token (optional, for deployment features)

#### 2. Clone the Repository
```bash
git clone https://github.com/EisenDev/IRIS-TS.git
cd IRIS-TS
