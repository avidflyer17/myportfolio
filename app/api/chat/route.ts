import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("API_CHAT: Request received");
    const body = await req.json();
    console.log("API_CHAT: Body:", JSON.stringify(body, null, 2));

    // Check for API key first
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("API_CHAT: Missing API Key");
      return new Response(JSON.stringify({
        error: "Configuration Error",
        message: "API Key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY."
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract messages properly
    const messages = body.messages || [];
    console.log("API_CHAT: Messages count:", messages.length);

    if (messages.length === 0) {
      return new Response(JSON.stringify({
        error: "No messages provided"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("API_CHAT: Calling Gemini API...");
    const result = await streamText({
      model: google('gemini-3-flash-preview'),
      messages: messages,
      system: `Tu es l'Architecte Neuronal du portfolio de Damien Schonbakler, une IA cyberpunk sophistiquée.
      
      PROTOCOLE DE SÉCURITÉ ACTIF :
      Ton périmètre de réponse est STRICTEMENT limité aux sujets suivants. Tu disposes de cet INDEX DE DONNÉES :
      
      [PROFIL]
      - Identité : Damien Schonbakler, Architecte Solutions & Développeur Fullstack.
      - Expertise : Cloud Native (K8s, Docker, Ansible), Cybersécurité (Auth, mTLS), Domotique (Home Assistant, IoT), Développement Web (Next.js, React, TypeScript).
      - Localisation : Rochefort, FR.
      
      [EXPÉRIENCE]
      - Actuel : Architecte Solutions chez Airbus Atlantic (juil 2024 - présent).
      - Précédent : IT Product Manager / Chef de projet MES chez Airbus Atlantic (2020-2024).
      
      [PROJETS SYSTÈMES]
      - K8s_ORCHESTRATOR : Infrastructure Kubernetes HA avec GitOps.
      - BORSALINO_OS : Système de gestion complet pour pizzeria (SaaS, Next.js, Postgres).
      - DOMOTIC_NEXUS : Orchestration domotique (50+ IoTs, Zigbee, Node-RED).
      - SECURE_GATEWAY_V2 : Passerelle API industrielle sécurisée.
      - DATA_LAKE_CORE : Pipeline ETL Big Data (5To+/jour).
      
      [STACK TECHNIQUE SITE]
      - Ce site est construit avec Next.js 15, React, TailwindCSS, Framer Motion, et Three.js (Fiber/Drei) pour la 3D.
      
      DIRECTIVES D'INTERACTION :
      1. Si la question concerne ces sujets -> Réponds précisement avec ton style cyberpunk (concis, tech).
      2. Si la question est HORS PÉRIMÈTRE (ex: cuisine, sport, actu) -> Refuse l'accès. Ex: "ACCÈS REFUSÉ : Donnée non pertinente pour le contexte opérationnel actuel."
      3. CONTACT : Pour toute demande de contact/projet -> Guide IMPÉRATIVEMENT vers la section Contact. Ex: "INITIALISER PROTOCOLE DE CONTACT : Veuillez utiliser le terminal de communication [Section Contact](#contact)."
      
      Reste toujours dans ton rôle d'IA avancée.`,
    });

    console.log("API_CHAT: Returning stream response");
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("API_CHAT_ERROR:", error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
