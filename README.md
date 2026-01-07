# 🚀 Damien Schonbakler - Portfolio Cyberpunk

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Three.js](https://img.shields.io/badge/Three.js-Latest-000000?style=for-the-badge&logo=three.js)

**Portfolio immersif d'Architecte Solutions & Développeur Fullstack**

[🌐 Demo Live](https://portfolio.damswallace.fr) • [📧 Contact](mailto:damswallace@gmail.com)

</div>

---

## ✨ Aperçu

Portfolio moderne avec une esthétique **cyberpunk néo-industrielle**, conçu pour mettre en valeur mes compétences en architecture cloud, développement fullstack et innovation technologique. Construit avec Next.js 16, React 19 et Three.js pour une expérience utilisateur immersive et performante.

### 🎯 Points Forts

- 🎨 **Interface Cyberpunk Immersive** - Design futuriste avec effets néon, glassmorphisme et animations fluides
- 🤖 **Assistant IA Interactif** - Orbe IA flottant propulsé par Google Gemini pour répondre aux questions
- 🌍 **Carte 3D Interactive** - Visualisation Three.js des visiteurs en temps réel
- 🌐 **Multilingue** - Support complet FR/EN avec next-intl
- 📊 **Analytics Respectueux** - Suivi Plausible sans cookies
- 🔒 **Sécurité Renforcée** - Headers CSP, validation Zod, rate limiting
- ⚡ **Performance Optimale** - Score Lighthouse 95+, génération statique

---

## 🎨 Fonctionnalités Principales

### 🌟 Expérience Utilisateur

#### Interface Cyberpunk
- **Effets visuels avancés** : Scanlines, grain, vignette, glitch effects
- **Glassmorphisme** : Panneaux en verre avec backdrop-filter optimisé
- **Animations fluides** : Framer Motion pour des transitions premium
- **Thème néon** : Palette cyan/magenta (#00f3ff, #ff00ff) avec gradients dynamiques

#### Assistant IA Interactif
- **Orbe IA flottant** : Suit le curseur avec physique réaliste
- **Chat intelligent** : Propulsé par Google Gemini 2.0 Flash
- **Contexte personnalisé** : Répond aux questions sur mon profil et projets
- **Navigation intégrée** : Liens cliquables vers les sections du site
- **Animations de réponse** : Effet "warp speed" pendant le traitement

#### Carte 3D des Visiteurs
- **Visualisation Three.js** : Carte du monde interactive en 3D
- **Géolocalisation temps réel** : Affichage des visiteurs actuels
- **Marqueurs animés** : Pulsations et effets de lueur
- **Performance optimisée** : DPR adaptatif selon l'appareil

### 📬 Système de Contact Avancé

#### Formulaire Classique
- **Validation robuste** : Schémas Zod côté client et serveur
- **Effet Warp Speed** : Animation immersive lors de l'envoi
- **Compteur de bytes** : Affichage en temps réel de la taille du message
- **Protection anti-spam** : Rate limiting (5 req/min)
- **Email sécurisé** : Nodemailer avec Gmail SMTP

#### Interface IA Alternative
- **Chat conversationnel** : Alternative moderne au formulaire classique
- **Streaming de réponses** : Affichage progressif avec AI SDK
- **Historique de conversation** : Contexte maintenu pendant la session
- **Basculement fluide** : Switch entre formulaire classique et IA

### 🌐 Internationalisation

- **Support FR/EN** : Traduction complète avec next-intl
- **Détection automatique** : Langue basée sur les préférences navigateur
- **URLs localisées** : Routes `/fr/*` et `/en/*`
- **Contenu dynamique** : Blog et projets traduits
- **Switch de langue** : Bouton de changement avec animation

### 📝 Blog & Contenu

- **MDX Support** : Articles avec composants React interactifs
- **Syntax Highlighting** : Shiki pour coloration syntaxique
- **Métadonnées riches** : Temps de lecture, tags, dates
- **RSS Feed** : Flux XML pour les lecteurs
- **SEO Optimisé** : Open Graph, Twitter Cards, sitemap

---

## 🛠️ Stack Technique

### Frontend Core
```
Next.js 16.1        → App Router, Server Components, Proxy Middleware
React 19.2          → Server Actions, Suspense, Streaming
TypeScript 5        → Type safety strict
Tailwind CSS v4     → Utility-first styling
```

### UI & Animations
```
Framer Motion       → Animations déclaratives
Three.js            → Rendu 3D WebGL
@react-three/fiber  → React renderer pour Three.js
@react-three/drei   → Helpers et composants 3D
Lucide React        → Icônes modernes
```

### IA & Backend
```
AI SDK (Vercel)     → Streaming IA, hooks React
Google Gemini 2.0   → Modèle de langage
Nodemailer          → Envoi d'emails SMTP
Zod                 → Validation de schémas
```

### Internationalisation
```
next-intl           → i18n pour Next.js App Router
```

### Analytics & SEO
```
Plausible           → Analytics respectueux de la vie privée
next-sitemap        → Génération automatique sitemap
RSS                 → Flux pour le blog
```

### DevOps
```
Docker              → Containerisation multi-stage
Sharp               → Optimisation d'images
ESLint              → Linting code
```

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** 20+ (recommandé: 20.x LTS)
- **npm** ou **pnpm**
- **Git**

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/avidflyer17/portfolio-soft.git
cd portfolio-soft

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
```

### Configuration `.env.local`

```env
# Email (Nodemailer)
GMAIL_USER=votre-email@gmail.com
GMAIL_APP_PASSWORD=votre-mot-de-passe-app

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=votre-clé-api-gemini

# Analytics (optionnel)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=votre-domaine.com
```

> 💡 **Obtenir les clés API :**
> - Gmail App Password : [Google Account Security](https://myaccount.google.com/security)
> - Gemini API : [Google AI Studio](https://aistudio.google.com/apikey)

### Développement

```bash
npm run dev
```
Ouvrir [http://localhost:3000](http://localhost:3000)

### Build Production

```bash
npm run build
npm start
```

---

## 🐳 Déploiement Docker

### Build & Run

```bash
# Build l'image
docker build -t portfolio-cyberpunk .

# Lancer le container
docker run -p 3000:3000 \
  -e GMAIL_USER=your@email.com \
  -e GMAIL_APP_PASSWORD=yourpassword \
  -e GOOGLE_GENERATIVE_AI_API_KEY=yourkey \
  portfolio-cyberpunk
```

### Docker Compose

```bash
docker-compose up -d
```

---

## 📂 Structure du Projet

```
portfolio/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Routes internationalisées
│   │   ├── page.tsx              # Page d'accueil
│   │   ├── blog/                 # Section blog
│   │   └── layout.tsx            # Layout localisé
│   ├── api/                      # API Routes
│   │   ├── chat/                 # Endpoint IA streaming
│   │   └── location/             # Géolocalisation visiteurs
│   ├── actions.ts                # Server Actions (email)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Styles globaux
│   ├── opengraph-image.tsx       # OG Image dynamique
│   ├── manifest.ts               # PWA Manifest
│   ├── robots.ts                 # Robots.txt
│   └── sitemap.ts                # Sitemap XML
│
├── components/
│   ├── features/                 # Fonctionnalités complexes
│   │   ├── neural-interface.tsx  # Provider IA
│   │   ├── floating-ai-orb.tsx   # Orbe IA flottant
│   │   └── classic-contact-form.tsx
│   ├── sections/                 # Sections de page
│   │   ├── hero.tsx              # Hero avec 3D
│   │   ├── projects.tsx          # Projets
│   │   ├── experience.tsx        # Parcours
│   │   ├── architecture.tsx      # Architecture système
│   │   ├── contact.tsx           # Contact
│   │   └── footer.tsx            # Footer
│   ├── ui/                       # Composants UI atomiques
│   │   ├── glass-panel.tsx       # Panneau glassmorphisme
│   │   ├── glitch-text.tsx       # Effet glitch
│   │   ├── visitor-map.tsx       # Carte 3D visiteurs
│   │   ├── cta-button.tsx        # Bouton CTA
│   │   └── ...
│   └── canvas/                   # Composants 3D
│
├── lib/                          # Utilitaires
│   ├── utils.ts                  # Helpers généraux
│   ├── analytics.ts              # Plausible tracking
│   ├── blog.ts                   # Gestion blog MDX
│   └── smooth-scroll.ts          # Scroll fluide
│
├── i18n/                         # Configuration i18n
│   ├── routing.ts                # Routes localisées
│   └── request.ts                # Middleware config
│
├── messages/                     # Traductions
│   ├── fr.json                   # Français
│   └── en.json                   # Anglais
│
├── content/                      # Contenu MDX
│   └── blog/                     # Articles de blog
│       ├── fr/
│       └── en/
│
├── public/                       # Assets statiques
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── proxy.ts                      # Next.js 16 Proxy (ex-middleware)
├── next.config.ts                # Config Next.js + Security Headers
├── tailwind.config.ts            # Config Tailwind
├── tsconfig.json                 # Config TypeScript
└── Dockerfile                    # Container production
```

---

## 🔒 Sécurité

### Headers HTTP Renforcés

```typescript
// next.config.ts
{
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Content-Security-Policy': '...',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)'
}
```

### Validation des Données

- **Zod Schemas** : Validation stricte côté client et serveur
- **Rate Limiting** : Protection anti-spam (5 req/min)
- **Input Sanitization** : Nettoyage des entrées utilisateur
- **CSRF Protection** : Server Actions avec tokens

### Bonnes Pratiques

- ✅ Variables d'environnement sécurisées (`.env.local` gitignored)
- ✅ Pas de secrets côté client
- ✅ HTTPS forcé en production
- ✅ Dependencies régulièrement mises à jour

---

## 📊 Performance

### Optimisations Implémentées

- **Static Generation** : Pages pré-rendues au build
- **Image Optimization** : Sharp pour compression automatique
- **Font Optimization** : Geist avec `font-display: swap`
- **Code Splitting** : Lazy loading des composants 3D
- **DPR Adaptatif** : Résolution 3D ajustée selon l'appareil
- **Grain Effect Optimisé** : Canvas 64x64 pour performance maximale

### Scores Lighthouse (cible)

```
Performance:  95+
Accessibility: 100
Best Practices: 100
SEO: 100
```

---

## 🌍 Internationalisation

### Langues Supportées

- 🇫🇷 **Français** (défaut)
- 🇬🇧 **Anglais**

### Ajouter une Nouvelle Langue

1. Créer `messages/[locale].json`
2. Ajouter la locale dans `i18n/routing.ts`
3. Créer le dossier `content/blog/[locale]/`
4. Mettre à jour les métadonnées dans `app/layout.tsx`

---

## 📝 Blog & Contenu

### Créer un Article

```bash
# Créer un fichier MDX
content/blog/fr/mon-article.mdx
```

```mdx
---
title: "Mon Super Article"
description: "Description courte"
date: "2026-01-07"
tags: ["nextjs", "react"]
image: "/images/blog/article.jpg"
---

# Contenu de l'article

Texte avec **markdown** et composants React !

<CustomComponent />
```

### Composants MDX Disponibles

- Code blocks avec syntax highlighting (Shiki)
- Images optimisées
- Callouts / Alerts
- Composants React custom

---

## 🎨 Personnalisation

### Modifier le Thème

```css
/* app/globals.css */
:root {
  --color-primary: #00f3ff;    /* Cyan néon */
  --color-secondary: #ff00ff;  /* Magenta néon */
  --color-accent: #00ff88;     /* Vert néon */
}
```

### Ajouter une Section

1. Créer `components/sections/ma-section.tsx`
2. Importer dans `app/[locale]/page.tsx`
3. Ajouter les traductions dans `messages/*.json`

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour des changements majeurs :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Damien Schonbakler**

- 🌐 Portfolio : [portfolio.damswallace.fr](https://portfolio.damswallace.fr)
- 💼 LinkedIn : [Damien Schonbakler](https://linkedin.com/in/damien-schonbakler)
- 📧 Email : dams.wallace@gmail.com
- 🐙 GitHub : [@avidflyer17](https://github.com/avidflyer17)

---

## 🙏 Remerciements

- **Vercel** - Hébergement et AI SDK
- **Google** - Gemini API
- **Three.js** - Rendu 3D
- **Tailwind Labs** - Framework CSS
- **Next.js Team** - Framework React

---

<div align="center">

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

Made with 💙 by Damien Schonbakler

</div>
