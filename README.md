# 🌐 Damien Schonbakler - Solutions Architect Portfolio

![Project Status](https://img.shields.io/badge/status-production_ready-success)
![Next.js](https://img.shields.io/badge/next.js-15.1-black)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)
![Tailwind](https://img.shields.io/badge/tailwind-v4-cyan)

A high-performance, immersive portfolio designed to showcase Solutions Architecture, Cloud Infrastructure, and Fullstack Development skills. Built with a focus on **Cyberpunk Aesthetics**, **3D Visualization**, and **Security Hardening**.

---

## 🚀 Key Features

### 🎨 Immersive UI/UX
*   **Mouse Spotlight**: Global physics-based cursor lighting effect.
*   **Glassmorphism**: Premium glass panels using efficient CSS backdrops.
*   **3D Visualization**: `Three.js` / `@react-three/fiber` city map representing live topology.
*   **Cyberpunk Theme**: Neon Cyan/Pink palette (`#00f3ff`, `#ff00ff`) with scanlines and grain.

### 🛡️ Security First
*   **Hardened Headers**: CSP, HSTS, X-Content-Type-Options via `next.config.ts`.
*   **Input Validation**: Strict `Zod` schema validation for all form inputs.
*   **Rate Limiting**: Server-side protection against spam (5 req/min).
*   **Secure SMTP**: Gmail integration via server actions (no client-side leakage).

### 🏗️ Architecture
*   **Next.js 15 (App Router)**: Server Components by default.
*   **Component Composition**: Atomic design (atoms -> molecules -> organisms).
*   **Performance**: Lazy-loaded 3D assets, optimized font loading (`Geist`).

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Core** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, CLSX, Tailwind-Merge |
| **Animation** | Framer Motion, React Spring |
| **3D Engine** | Three.js, React Three Fiber, Dreis |
| **Backend** | Server Actions, Nodemailer, Zod |
| **DevOps** | Docker (Multi-stage), ESLint |

---

## ⚡ Getting Started

### Prerequisites
*   Node.js 20+
*   npm or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/avidflyer17/myportfolio.git
cd myportfolio

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
# Create a .env.local file with:
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## 🐳 Docker Deployment

A production-ready `Dockerfile` is included.

```bash
# Build
docker build -t portfolio .

# Run
docker run -p 3000:3000 portfolio
```

---

## 📂 Project Structure

```
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout (Metadata, Fonts)
│   ├── page.tsx          # Landing Page Composition
│   └── actions.ts        # Server Actions (Email, etc.)
├── components/
│   ├── canvas/           # 3D Components (CityMap)
│   ├── sections/         # Page Sections (Hero, Projects, etc.)
│   └── ui/               # Atomic UI Components (GlassPanel, Spotlight)
├── lib/                  # Utilities & Helpers
├── public/               # Static Assets
└── next.config.ts        # Security Headers & Config
```

---

## 📜 Credits
Designed & Developed by **Damien Schonbakler**.
*Licensed under MIT.*
