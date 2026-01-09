# 🏗️ Architecture & Documentation Globale

Ce document fournit une vue d'ensemble technique, architecturale et opérationnelle du projet Portfolio Cyberpunk.

## 📐 Architecture Technique

### 1. Frontend Core
Le projet est un site web **Fullstack** basé sur **Next.js 16** (App Router).
- **Rendu** : Hybride (Server Components par défaut + Client Components pour l'interactivité).
- **Styling** : **Tailwind CSS v4** pour les utilitaires, avec des variables CSS globales pour le thème néon.
- **3D & Graphismes** : 
    - **Three.js / React Three Fiber** : Utilisé pour l'Orbe IA (Siri-like) et la scène de fond (Etoiles).
    - **Framer Motion** : Animations d'interface fluides et transitions de pages.

### 2. Fonctionnalités Clés
- **Assistant IA** : Chatbot contextuel (RAG-lite) utilisant l'API Google Gemini 2.0.
    - *Fichier* : `components/features/floating-ai-orb.tsx`
    - *Logique* : Stream de réponses texte via `ai/react`.
- **Formulaire de Contact** : 
    - Validation stricte avec **Zod**.
    - Envoi d'email via **Nodemailer** (SMTP Gmail).
    - Rate Limiting en mémoire.
- **Internationalisation** : 
    - Routes localisées `/fr` et `/en` via `next-intl`.
    - Fichiers de traduction JSON dans `messages/`.

## 🛠️ Infrastructure & DevOps

### Pipeline CI/CD (GitHub Actions)
Le projet dispose d'une pipeline d'intégration continue automatisée définie dans `.github/workflows/ci.yml`.

**Déclencheurs :**
- Push sur `master` ou `main`.
- Pull Requests vers ces branches.

**Étapes :**
1. **Checkout** : Récupération du code.
2. **Setup Node** : Installation de Node.js v22 (LTS).
3. **Install Dependencies** : `npm ci` (avec cache).
4. **Linting** : `npm run lint` (ESLint) - Bloquant si erreurs.
5. **Build** : `npm run build` (Next.js Build) - Vérifie la compilation production.

### Déploiement
Le projet est déployable de deux manières principales (voir `docs/DEPLOYMENT.md` pour les détails) :
1. **PaaS (Vercel)** : Déploiement natif, zéro config.
2. **Docker** : Image optimisée multi-stage (~100MB) pour hébergement sur VPS/Kubernetes.

## 📂 Structure du Projet

```bash
/
├── app/                  # Pages & Routes (Next.js App Router)
│   ├── [locale]/         # Routes localisées (fr/en)
│   ├── api/              # Endpoints API (Chat, Blog, Contact)
│   └── globals.css       # Styles globaux & Thème Neon
├── components/           # Composants React
│   ├── canvas/           # Scènes 3D (Three.js)
│   ├── features/         # Fonctionnalités métier (Formulaire, Chat)
│   ├── sections/         # Blocs de page (Hero, About, Projects)
│   └── ui/               # Composants de base réutilisables
├── lib/                  # Utilitaires & Logique métier pure
├── messages/             # Fichiers de traduction (fr.json, en.json)
└── public/               # Assets statiques (Images, Fonts)
```

## 🧪 Qualité de Code
- **Linting** : ESLint configuré avec `eslint-config-next`.
- **Type Safety** : TypeScript strict activé.
- **Best Practices** :
    - Pas de `useEffect` pour dériver un état (utiliser des variables dérivées).
    - Pas de types `any` explicites.
    - Composants 3D isolés pour éviter les re-renders inutiles.
