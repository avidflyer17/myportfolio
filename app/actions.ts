'use server';

import nodemailer from 'nodemailer';
import { z } from "zod";
import { headers } from "next/headers";

// Rate limiting map: IP -> { count, lastReset }
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const ContactSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    company: z.string().max(100).optional(),
    projectType: z.string().optional(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    message: z.string().min(10).max(1000)
});

// --- HELPER: Rate Limiting ---
async function checkRateLimit() {
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = 5;

    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - record.lastReset > windowMs) {
        record.count = 0;
        record.lastReset = now;
    }

    if (record.count >= limit) {
        return { allowed: false };
    }

    record.count++;
    rateLimitMap.set(ip, record);
    return { allowed: true };
}

// --- HELPER: Email Templates ---
const generateContactEmailHTML = (data: { name: string; email: string; company?: string; projectType?: string; budget?: string; timeline?: string; message: string; isAI?: boolean }) => {
    const { name, email, company, projectType, budget, timeline, message, isAI } = data;
    const accentColor = isAI ? "#00f3ff" : "#ff00ff";
    const protocolLabel = isAI ? "NEURAL_LINK_V5" : "SECURE_UPLINK_V5";

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030303; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030303; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #080808; border-radius: 16px; border: 1px solid #1a1a1a; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.5);">
                    <tr><td style="height: 6px; background: linear-gradient(90deg, #00f3ff 0%, #ff00ff 100%);"></td></tr>
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <div style="color: ${accentColor}; font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, monospace; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 12px; display: inline-block;">
                                ⚡ ${protocolLabel} // SECURE_SIGNAL
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; text-transform: uppercase; letter-spacing: -1px; line-height: 1;">
                                NEW <span style="color: ${accentColor};">SIGNAL</span> DETECTED
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 40px;">
                            <table width="100%" style="background-color: #0d0d0d; border-radius: 12px; border: 1px solid #1a1a1a; border-left: 4px solid ${accentColor}; padding: 25px;">
                                <tr>
                                    <td>
                                        <div style="color: #666; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">ORIGIN_ID</div>
                                        <div style="color: #ffffff; font-size: 20px; font-weight: 700;">${name}</div>
                                        <div style="color: #999; font-size: 14px; margin-top: 4px; font-family: monospace;">${email}</div>
                                        ${company ? `<div style="display: inline-block; margin-top: 15px; padding: 4px 10px; background: rgba(255,255,255,0.05); border-radius: 4px; color: #fff; font-size: 11px; border: 1px solid #333;">📦 ${company}</div>` : ''}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    ${(projectType || budget || timeline) ? `
                    <tr>
                        <td style="padding: 20px 40px;">
                            <table width="100%" border="0" cellspacing="10" cellpadding="0">
                                <tr>
                                    ${projectType ? `
                                    <td width="33%" style="background: rgba(255,255,255,0.02); border: 1px solid #1a1a1a; border-radius: 8px; padding: 15px; text-align: center;">
                                        <div style="color: #666; font-size: 8px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">TYPE</div>
                                        <div style="color: #fff; font-size: 11px; font-weight: bold;">${projectType}</div>
                                    </td>
                                    ` : ''}
                                    ${budget ? `
                                    <td width="33%" style="background: rgba(255,255,255,0.02); border: 1px solid #1a1a1a; border-radius: 8px; padding: 15px; text-align: center;">
                                        <div style="color: #666; font-size: 8px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">BUDGET</div>
                                        <div style="color: #fff; font-size: 11px; font-weight: bold;">${budget}</div>
                                    </td>
                                    ` : ''}
                                    ${timeline ? `
                                    <td width="33%" style="background: rgba(255,255,255,0.02); border: 1px solid #1a1a1a; border-radius: 8px; padding: 15px; text-align: center;">
                                        <div style="color: #666; font-size: 8px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">TIME</div>
                                        <div style="color: #fff; font-size: 11px; font-weight: bold;">${timeline}</div>
                                    </td>
                                    ` : ''}
                                </tr>
                            </table>
                        </td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 20px 40px 40px 40px;">
                            <div style="color: #666; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">》 PAYLOAD_DATA:</div>
                            <div style="background-color: #000; border: 1px solid #1a1a1a; border-radius: 12px; padding: 30px; color: #ddd; font-size: 16px; line-height: 1.6; min-height: 150px; box-shadow: inset 0 4px 20px rgba(0,0,0,0.5);">
                                <div style="white-space: pre-wrap;">${message}</div>
                            </div>
                            <div style="margin-top: 40px; text-align: center;">
                                <a href="mailto:${email}" style="background-color: #ffffff; color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">
                                    RESPOND TO SIGNAL
                                </a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #050505; padding: 30px 40px; border-top: 1px solid #1a1a1a; text-align: center;">
                            <div style="color: #444; font-size: 9px; font-family: monospace; text-transform: uppercase; letter-spacing: 3px;">
                                ARCHITECTE SOLUTIONS // DAMIEN SCHONBAKLER // V5.0
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

const generateVisitorAckHTML = (name: string, isAI?: boolean) => {
    const accentColor = isAI ? "#00f3ff" : "#ff00ff";
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030303; font-family: 'Segoe UI', sans-serif;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030303; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 500px; background-color: #080808; border-radius: 16px; border: 1px solid #1a1a1a; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.5);">
                    <tr>
                        <td style="padding: 50px 40px; text-align: center;">
                             <div style="width: 60px; height: 60px; background: rgba(${isAI ? '0, 243, 255' : '255, 0, 255'}, 0.1); border-radius: 50%; border: 2px solid ${accentColor}; margin: 0 auto 30px auto; display: flex; align-items: center; justify-content: center; line-height: 60px;">
                                <span style="font-size: 24px;">📡</span>
                             </div>
                             <h1 style="color: #fff; font-size: 24px; font-weight: 800; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">SIGNAL RECEIVED</h1>
                             <p style="color: #888; font-size: 16px; margin: 0 0 40px 0; line-height: 1.5;">
                                Greetings <b>${name}</b>, your transmission has been decrypted and queued for analysis. I'll connect with you shortly.
                             </p>
                             <div style="background: rgba(255,255,255,0.03); border: 1px dashed #333; border-radius: 8px; padding: 20px;">
                                <div style="color: ${accentColor}; font-family: monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">Connection_Status</div>
                                <div style="color: #fff; font-size: 13px; font-weight: bold;">UPLINK_ESTABLISHED_V5.0</div>
                                <div style="margin-top: 10px; height: 2px; width: 100%; background: #1a1a1a; border-radius: 2px; overflow: hidden;">
                                    <div style="height: 100%; width: 100%; background: ${accentColor};"></div>
                                </div>
                             </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #050505; padding: 25px 40px; border-top: 1px solid #1a1a1a; text-align: center;">
                            <div style="color: #444; font-size: 9px; font-family: monospace; text-transform: uppercase; letter-spacing: 2px;">
                                AUTOMATED_RESPONSE_SERVICE // D. SCHONBAKLER
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

// --- EXPORTED ACTIONS ---

export async function sendContactEmail(formData: FormData) {
    const limiter = await checkRateLimit();
    if (!limiter.allowed) {
        return { success: false, error: "Too many requests. Please try again later." };
    }

    // Helper to clean optional fields (empty string -> undefined)
    const getOptionalString = (key: string) => {
        const val = formData.get(key);
        if (!val || val === '') return undefined;
        return val.toString();
    };

    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: getOptionalString('company'),
        projectType: getOptionalString('projectType'),
        budget: getOptionalString('budget'),
        timeline: getOptionalString('timeline'),
        message: formData.get('message')
    };

    const result = ContactSchema.safeParse(rawData);

    if (!result.success) {
        // Log deep error for dev
        console.error("Validation Failed:", JSON.stringify(result.error.format(), null, 2));

        // Return readable error string
        const errorDetails = result.error.issues
            .map(issue => {
                const field = issue.path.join('.');
                return `${field}: ${issue.message}`;
            })
            .join(' | ');

        return { success: false, error: `Validation: ${errorDetails}` };
    }

    const { name, email, message } = result.data;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // 1. Owner's Email
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `[PORTFOLIO] 📡 New Signal from ${name}`,
            text: `SIGNAL DETECTED\nFROM: ${name}\nEMAIL: ${email}\nMESSAGE: ${message}`,
            html: generateContactEmailHTML(result.data),
        });

        // 2. Visitor's ACK
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: `[AUTO-REPLY] Transmission Received // Damien Schonbakler`,
            text: `Greetings ${name}, your signal has been received. I'll get back to you shortly.`,
            html: generateVisitorAckHTML(name),
        });

        return { success: true };
    } catch (error) {
        console.error('Email transmission failed:', error);
        return { success: false, error: 'Transmission failed' };
    }
}

// AI Contact flow
export async function sendContactEmailJSON(data: any) {
    const limiter = await checkRateLimit();
    if (!limiter.allowed) {
        return { success: false, error: "Too many requests. Please try again later." };
    }

    const rawData = {
        name: data.name,
        email: data.email,
        company: data.company || '',
        projectType: data.projectType || 'AI_INTERFACE',
        budget: data.budget || '',
        timeline: data.timeline || '',
        message: data.message
    };

    const result = ContactSchema.safeParse(rawData);
    if (!result.success) {
        return { success: false, error: "Invalid data provided." };
    }

    const { name, email, message } = result.data;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // 1. Owner's Email (with isAI: true for Cyan theme)
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `[AI PROTOCOL] 📡 New Signal from ${name}`,
            text: `AI INTERFACE UPLINK\nFROM: ${name}\nEMAIL: ${email}\nMESSAGE: ${message}`,
            html: generateContactEmailHTML({ ...result.data, isAI: true }),
        });

        // 2. Visitor's ACK (with isAI: true for Cyan theme)
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: `[AUTO-REPLY] Signal Received // Damien Schonbakler`,
            text: `Greetings ${name}, the AI has transmitted your message. Connection established.`,
            html: generateVisitorAckHTML(name, true),
        });

        return { success: true };
    } catch (error) {
        console.error('AI Email transmission failed:', error);
        return { success: false, error: 'Transmission failed' };
    }
}
