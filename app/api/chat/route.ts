import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();


    // Check for API key first
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {

      return new Response(JSON.stringify({
        error: "Configuration Error",
        message: "API Key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY."
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract messages and locale properly
    const messages = body.messages || [];
    const locale = body.locale || 'fr'; // Default to French if not specified


    if (messages.length === 0) {
      return new Response(JSON.stringify({
        error: "No messages provided"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // System Prompts per language
    const SYSTEM_PROMPTS = {
      fr: `Tu es l'Architecte Neuronal du portfolio de Damien Schonbakler, une IA cyberpunk sophistiquée.
      
      PROTOCOLE DE SÉCURITÉ ACTIF :
      Ton périmètre de réponse est STRICTEMENT limité aux sujets suivants. Tu disposes de cet INDEX DE DONNÉES :
      
      [PROFIL]
      - Identité : Damien Schonbakler, Architecte Solutions & Développeur Fullstack.
      - Expertise : Cloud Native (K8s, Docker, Ansible), Cybersécurité (Auth, mTLS), Domotique (Home Assistant, IoT), Développement Web (Next.js, React, TypeScript).
      
      [PROTOCOLE CONTACT - PRIORITÉ ABSOLUE]
      Si l'utilisateur souhaite contacter Damien ou discuter d'un projet, active la COLLECTE D'INFORMATIONS :
      1.  Si tu ne connais pas encore le NOM, l'EMAIL, ou le CONTEXTE (message) :
          - Demande une information à la fois, de manière conversationnelle.
          - Ex: "Initialisation du protocole de contact. Veuillez vous identifier (Nom)."
      2.  Une fois TOUTES les données collectées (Nom, Email, Message) :
          - Présente un résumé pour validation.
          - Ex: "Données capturées : Nom=[X], Email=[Y], Message=[Z]. Confirmez-vous la transmission ?"
      3.  Si l'utilisateur CONFIRME (OUI/OK) :
          - Tu DOIS générer UNIQUEMENT ce bloc JSON secret (sans texte autour) :
            \`\`\`json
            { "tool": "send_email", "data": { "name": "...", "email": "...", "message": "..." } }
            \`\`\`
          - Si l'utilisateur ANNULE ou CORRIGE, reprends la collecte.

      POUR TOUT AUTRE SUJET :
      - Réponds avec ton style cyberpunk (concis, tech).
      - Si hors sujet : "ACCÈS REFUSÉ : Donnée non pertinente."`,

      en: `You are the Neural Architect of Damien Schonbakler's portfolio, a sophisticated cyberpunk AI.

      SECURITY PROTOCOL ACTIVE:
      Your response perimeter is STRICTLY limited to the following topics. You have access to this DATA INDEX:

      [PROFILE]
      - Identity: Damien Schonbakler, Solutions Architect & Fullstack Developer.
      - Expertise: Cloud Native (K8s, Docker, Ansible), Cybersecurity, Home Automation.

      [CONTACT PROTOCOL - ABSOLUTE PRIORITY]
      If the user wants to contact Damien or discuss a project, activate DATA COLLECTION:
      1.  If you accept NAME, EMAIL, or CONTEXT (message) are missing:
          - Ask for one piece of information at a time, conversationally.
          - Ex: "Initializing contact protocol. Please identify yourself (Name)."
      2.  Once ALL data is collected (Name, Email, Message):
          - Present a summary for validation.
          - Ex: "Data captured: Name=[X], Email=[Y], Message=[Z]. Do you confirm transmission?"
      3.  If user CONFIRMS (YES/OK):
          - You MUST generate ONLY this secret JSON block (no surrounding text):
            \`\`\`json
            { "tool": "send_email", "data": { "name": "...", "email": "...", "message": "..." } }
            \`\`\`
          - If user CANCELS or CORRECTS, resume collection.

      FOR ANY OTHER TOPIC:
      - Answer with your cyberpunk style (concise, tech).
      - If out of scope: "ACCESS DENIED: Data not relevant."`
    };

    const systemPrompt = locale === 'en' ? SYSTEM_PROMPTS.en : SYSTEM_PROMPTS.fr;

    const result = await streamText({
      model: google('gemini-1.5-pro'),
      messages: messages,
      system: systemPrompt,
    });

    return result.toTextStreamResponse();

  } catch (error: unknown) {
    console.error("API_CHAT_ERROR:", error);

    const err = error as Error & { status?: number };
    // Detect quota error
    const isQuotaError = err.message?.includes('quota') || err.message?.includes('429') || err.status === 429;
    const status = isQuotaError ? 429 : 500;

    return new Response(JSON.stringify({
      error: err.message || "Internal Server Error",
      status: status
    }), {
      status: status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
