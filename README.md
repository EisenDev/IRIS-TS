# IRIS-TS (Intelligent Rapid Interface Synthesizer - TypeScript)
**Atmosphere Engine**

## Overview
IRIS-TS is an advanced, AI-driven architectural synthesizer designed to dynamically generate, refine, and deploy completely functioning, ultra-premium front-end web environments. 

By leveraging the cutting-edge reasoning capabilities of Google's Gemini Flash AI model, IRIS-TS can examine unstructured visual input (like generic screenshots, sketches, or reference images) and synthesize pixel-perfect, fully responsive Vue 3 + Tailwind CSS applications within seconds. 

It completely removes the traditional prototyping phase, letting developers construct, converse with, and interactively live-edit an AI-generated interface as if it were a native IDE plugin. 

---

## 🚀 Key Features

### 1. Visual Intake (Live Lens & Data Upload)
Instead of relying purely on text prompts, IRIS-TS accepts visual inspiration. Simply capture a screenshot using your webcam or upload a reference image. The AI engine extracts the mood, design layout, color hexes, and structure natively, mapping them to a custom `tailwind.config.js`.

### 2. Live Edit DOM Manipulation
IRIS-TS renders the AI-generated code directly natively inside an isolated `<iframe>`. You can instantly:
*   **Click-to-Edit Text:** Click any headline or paragraph to rewrite the copy natively without coding.
*   **Click-to-Swap Images:** Click any placeholder image to securely upload and inject your own local file assets natively into the HTML DOM.

### 3. Conversational Refinement
Not perfectly happy with the initial build? Use the **Structural Prompt** sidebar to talk to your codebase directly. Tell IRIS-TS to *"Convert the hero layout to a dark mode bento box"* or *"Add a pricing table section"*. The AI surgically alters the specific HTML and CSS nodes without losing your unsaved text or image edits.

### 4. Zero-Config Cloud Deployments
With native Vercel CLI integration, IRIS-TS apps can be published directly to the public internet edge in one click. Supply a BYOK (Bring Your Own Key) Vercel Token and your custom domain name, and the synthesizer compiles your architecture and pushes it live instantly.

### 5. Architectural Auto-Healing
Because Large Language Models (LLMs) occasionally drop commas or forget to properly escape raw newlines when generating large code structures, IRIS-TS sits behind a highly robust parsing layer (using `jsonrepair`). It natively sweeps and cleans malformed AI payloads, converting broken generation strings into fully working UI files silently in the background.

---

## 🛠 Tech Stack
*   **Frontend Client:** Vue 3 (Composition API), Vite, Tailwind CSS
*   **Backend Server:** Node.js, Hono, Vercel Edge Serverless Functions
*   **AI Engine:** Google Generative AI (Gemini Flash Models)
*   **Deployment:** Vercel SDK

## ⚙️ Local Development Setup

### 1. Setup Environment Variables
At the root of the `./server/` directory, create a `.env` file containing your comma-separated Gemini API Keys (to allow automatic rate limit rotation!).

```env
GEMINI_API_KEY=key_1, key_2, key_3
```

### 2. Install Dependencies
Run the installation script at the root of the codebase to build both the frontend and backend:
```bash
npm install && cd client && npm install
```

### 3. Start Local Engine
From the `./client` directory:
```bash
npm run dev
```

From the `./server` directory:
```bash
npm run dev
```

The system relies on local dynamic proxying, which natively shuttles requests from `http://localhost:5173/api` over to the Hono instance on `http://127.0.0.1:3000`.
