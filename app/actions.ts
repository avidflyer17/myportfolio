'use server';

import nodemailer from 'nodemailer';

import { z } from "zod";

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

export async function sendContactEmail(formData: FormData) {
    // 1. Rate Limiting (Simple In-Memory) using a fixed IP key for now (since we can't easily get client IP in server actions without headers/middleware passing it)
    // In production, we'd use X-Forwarded-For via headers(), but for this scale, we can limit based on global volume or assume valid traffic.
    // Let's rely on a global limit for this demo or just proceed.
    // IMPROVEMENT: actually, let's just limit "per server instance" to avoid spam.

    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = 5; // 5 requests per minute global (simple spam protection)

    const globalKey = "global";
    const record = rateLimitMap.get(globalKey) || { count: 0, lastReset: now };

    if (now - record.lastReset > windowMs) {
        record.count = 0;
        record.lastReset = now;
    }

    if (record.count >= limit) {
        return { success: false, error: "Too many requests. Please try again later." };
    }

    record.count++;
    rateLimitMap.set(globalKey, record);

    // 2. Validation
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company') || '',
        projectType: formData.get('projectType') || '',
        budget: formData.get('budget') || '',
        timeline: formData.get('timeline') || '',
        message: formData.get('message')
    };

    const result = ContactSchema.safeParse(rawData);

    if (!result.success) {
        return { success: false, error: "Invalid data provided." };
    }

    const { name, email, company, projectType, budget, timeline, message } = result.data;


    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Portfolio Transmission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Courier New', Courier, monospace;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%); padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border: 2px solid #00f3ff; box-shadow: 0 0 40px rgba(0,243,255,0.3), inset 0 0 60px rgba(0,243,255,0.05); border-radius: 8px; overflow: hidden; position: relative;">
                    
                    <!-- Animated Border Top -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #00f3ff 0%, #ff00ff 50%, #00f3ff 100%); background-size: 200% 100%;"></td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px; background: linear-gradient(180deg, rgba(0,243,255,0.1) 0%, transparent 100%); position: relative;">
                            <!-- Scanline effect -->
                            <div style="position: absolute; top: 0; left: 0; right: 0; height: 100%; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,243,255,0.03) 2px, rgba(0,243,255,0.03) 4px); pointer-events: none;"></div>
                            
                            <table width="100%">
                                <tr>
                                    <td>
                                        <div style="color: #00f3ff; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 8px; font-weight: bold;">⚡ SECURE UPLINK</div>
                                        <h1 style="margin: 0; font-size: 28px; color: #ffffff; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 20px rgba(0,243,255,0.8), 0 0 40px rgba(0,243,255,0.4);">
                                            NEW TRANSMISSION
                                        </h1>
                                        <div style="margin-top: 12px; padding: 8px 12px; background: rgba(0,243,255,0.1); border-left: 3px solid #00f3ff; display: inline-block;">
                                            <span style="color: #00f3ff; font-size: 9px; text-transform: uppercase; letter-spacing: 2px;">ENCRYPTION: AES-256 // PROTOCOL: SMTP_V4 // STATUS: </span>
                                            <span style="color: #00ff00; font-weight: bold; animation: pulse 2s infinite;">█ ACTIVE</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px; background: #0a0a0a;">
                            
                            <!-- Terminal Header -->
                            <div style="background: #000000; border: 1px solid #00f3ff; border-radius: 6px; padding: 15px 20px; margin-bottom: 30px; box-shadow: 0 0 20px rgba(0,243,255,0.2);">
                                <div style="color: #00f3ff; font-size: 10px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">〉 CONTACT_PAYLOAD.DECODE()</div>
                                <div style="height: 1px; background: linear-gradient(90deg, #00f3ff 0%, transparent 100%); margin: 12px 0;"></div>
                            </div>

                            <!-- Sender Info -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                                <tr>
                                    <td width="50%" style="padding-right: 10px; vertical-align: top;">
                                        <div style="background: linear-gradient(135deg, rgba(0,243,255,0.1) 0%, rgba(0,243,255,0.02) 100%); border: 1px solid rgba(0,243,255,0.3); border-left: 3px solid #00f3ff; padding: 20px; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                                            <div style="color: #00f3ff; font-size: 9px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 2px; font-weight: bold;">◉ SOURCE_IDENTITY</div>
                                            <div style="color: #ffffff; font-size: 18px; font-weight: bold; margin-bottom: 5px; text-shadow: 0 0 10px rgba(255,255,255,0.3);">${name}</div>
                                            ${company ? `<div style="color: #00f3ff; font-size: 13px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,243,255,0.2);">📦 ${company}</div>` : ''}
                                        </div>
                                    </td>
                                    <td width="50%" style="padding-left: 10px; vertical-align: top;">
                                        <div style="background: linear-gradient(135deg, rgba(255,0,255,0.1) 0%, rgba(255,0,255,0.02) 100%); border: 1px solid rgba(255,0,255,0.3); border-left: 3px solid #ff00ff; padding: 20px; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                                            <div style="color: #ff00ff; font-size: 9px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 2px; font-weight: bold;">◉ COMM_CHANNEL</div>
                                            <div style="color: #ffffff; font-size: 14px; word-break: break-all; text-shadow: 0 0 10px rgba(255,255,255,0.3);">${email}</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Project Details -->
                            ${projectType || budget || timeline ? `
                            <div style="background: #000000; border: 1px solid rgba(0,243,255,0.3); border-radius: 6px; padding: 20px; margin-bottom: 25px; box-shadow: 0 0 20px rgba(0,243,255,0.1);">
                                <div style="color: #00f3ff; font-size: 10px; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 2px;">📊 PROJECT_METADATA</div>
                                <table width="100%">
                                    <tr>
                                        ${projectType ? `
                                        <td style="padding: 12px; background: rgba(0,243,255,0.05); border-left: 2px solid #00f3ff; margin-bottom: 10px;">
                                            <div style="color: #00f3ff; font-size: 8px; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px;">TYPE</div>
                                            <div style="color: #ffffff; font-size: 13px; font-weight: bold;">${projectType}</div>
                                        </td>
                                        ` : ''}
                                    </tr>
                                    <tr>
                                        ${budget ? `
                                        <td style="padding: 12px; background: rgba(255,0,255,0.05); border-left: 2px solid #ff00ff;">
                                            <div style="color: #ff00ff; font-size: 8px; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px;">BUDGET</div>
                                            <div style="color: #ffffff; font-size: 13px; font-weight: bold;">${budget}</div>
                                        </td>
                                        ` : ''}
                                    </tr>
                                    <tr>
                                        ${timeline ? `
                                        <td style="padding: 12px; background: rgba(0,255,0,0.05); border-left: 2px solid #00ff00;">
                                            <div style="color: #00ff00; font-size: 8px; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px;">TIMELINE</div>
                                            <div style="color: #ffffff; font-size: 13px; font-weight: bold;">${timeline}</div>
                                        </td>
                                        ` : ''}
                                    </tr>
                                </table>
                            </div>
                            ` : ''}

                            <!-- Message Body -->
                            <div style="margin-bottom: 15px;">
                                <div style="color: #00f3ff; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; font-weight: bold;">〉 DECODED_PAYLOAD_DATA:</div>
                            </div>
                            <div style="background: #000000; border: 2px solid rgba(0,243,255,0.3); border-left: 4px solid #00f3ff; padding: 25px; color: #e0e0e0; font-size: 14px; line-height: 1.8; border-radius: 6px; box-shadow: inset 0 0 30px rgba(0,243,255,0.05), 0 4px 20px rgba(0,0,0,0.5);">
                                <div style="font-family: 'Courier New', monospace; white-space: pre-wrap;">${message.replace(/\n/g, '<br/>')}</div>
                            </div>

                            <!-- Action Button -->
                            <div style="margin-top: 40px; text-align: center;">
                                <a href="mailto:${email}" style="background: linear-gradient(135deg, #00f3ff 0%, #00b8d4 100%); color: #000000; text-decoration: none; padding: 16px 40px; font-weight: bold; font-family: 'Arial', sans-serif; text-transform: uppercase; font-size: 13px; letter-spacing: 2px; display: inline-block; border-radius: 6px; box-shadow: 0 0 30px rgba(0,243,255,0.6), 0 4px 15px rgba(0,0,0,0.3); border: 2px solid #00f3ff;">
                                    ⚡ REPLY TO FREQUENCY
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(180deg, #0a0a0a 0%, #000000 100%); padding: 30px; text-align: center; border-top: 1px solid rgba(0,243,255,0.2);">
                            <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #00f3ff 50%, transparent 100%); margin-bottom: 20px;"></div>
                            <p style="margin: 0; color: #00f3ff; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">
                                DAMIEN SCHONBAKLER // ARCHITECTE SOLUTIONS
                            </p>
                            <p style="margin: 5px 0 0 0; color: #666666; font-size: 9px; letter-spacing: 1px;">
                                AUTOMATED DISPATCH SYSTEM V4.2
                            </p>
                        </td>
                    </tr>

                    <!-- Animated Border Bottom -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #ff00ff 0%, #00f3ff 50%, #ff00ff 100%); background-size: 200% 100%;"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `[PORTFOLIO] 📡 New Signal from ${name}`,
            text: `
SECURE UPLINK RECEIVED
----------------------
FROM: ${name}
EMAIL: ${email}
----------------------

PAYLOAD:
${message}
            `,
            html: htmlTemplate,
        });

        // Auto-Acknowledgment to Sender (Visitor)
        const ackTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Courier New', Courier, monospace;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%); padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border: 2px solid #ff00ff; box-shadow: 0 0 40px rgba(255,0,255,0.4), inset 0 0 60px rgba(255,0,255,0.05); border-radius: 8px; overflow: hidden;">
                    
                    <!-- Animated Border -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #ff00ff 0%, #00f3ff 50%, #ff00ff 100%); background-size: 200% 100%;"></td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px; background: linear-gradient(180deg, rgba(255,0,255,0.1) 0%, transparent 100%); text-align: center; position: relative;">
                            <!-- Scanline -->
                            <div style="position: absolute; top: 0; left: 0; right: 0; height: 100%; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,255,0.03) 2px, rgba(255,0,255,0.03) 4px); pointer-events: none;"></div>
                            
                            <div style="display: inline-block; background: rgba(255,0,255,0.1); border: 1px solid #ff00ff; border-radius: 50%; padding: 20px; margin-bottom: 20px; box-shadow: 0 0 30px rgba(255,0,255,0.5);">
                                <span style="font-size: 40px;">📡</span>
                            </div>
                            <h1 style="margin: 0; font-size: 26px; color: #ffffff; text-transform: uppercase; letter-spacing: 3px; text-shadow: 0 0 20px rgba(255,0,255,0.8), 0 0 40px rgba(255,0,255,0.4);">
                                TRANSMISSION
                            </h1>
                            <h2 style="margin: 8px 0 0 0; font-size: 22px; color: #ff00ff; text-transform: uppercase; letter-spacing: 2px;">
                                ACKNOWLEDGED
                            </h2>
                            <div style="margin-top: 15px; padding: 10px 15px; background: rgba(0,255,0,0.1); border: 1px solid #00ff00; display: inline-block; border-radius: 4px;">
                                <span style="color: #00ff00; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">█ STATUS: RECEIVED</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px; background: #0a0a0a;">
                            
                            <!-- Terminal Window -->
                            <div style="background: #000000; border: 1px solid rgba(255,0,255,0.3); border-radius: 6px; padding: 25px; margin-bottom: 30px; box-shadow: 0 0 20px rgba(255,0,255,0.2), inset 0 0 30px rgba(255,0,255,0.05);">
                                <div style="color: #ff00ff; font-size: 10px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">〉 SYSTEM.MESSAGE.DISPLAY()</div>
                                <div style="height: 1px; background: linear-gradient(90deg, #ff00ff 0%, transparent 100%); margin: 15px 0;"></div>
                                
                                <p style="margin: 0 0 20px 0; color: #ffffff; font-size: 15px; line-height: 1.8;">
                                    Greetings <strong style="color: #00f3ff; text-shadow: 0 0 10px rgba(0,243,255,0.5);">${name}</strong>,
                                </p>
                                <p style="margin: 0 0 20px 0; color: #e0e0e0; font-size: 14px; line-height: 1.8;">
                                    Your encrypted signal has been <span style="color: #00ff00; font-weight: bold;">successfully received</span> by the mainframe.
                                </p>
                                <p style="margin: 0 0 20px 0; color: #e0e0e0; font-size: 14px; line-height: 1.8;">
                                    I will analyze the payload and establish a connection <span style="color: #ff00ff;">shortly</span>.
                                </p>
                                
                                <div style="margin-top: 25px; padding: 15px 20px; background: rgba(255,0,255,0.05); border-left: 3px solid #ff00ff; border-radius: 4px;">
                                    <div style="color: #ff00ff; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">SYSTEM_QUOTE</div>
                                    <div style="color: #aaa; font-size: 13px; font-style: italic; line-height: 1.6;">
                                        "Innovation distinguishes between a leader and a follower."
                                    </div>
                                </div>
                            </div>

                            <!-- Processing Status -->
                            <div style="background: linear-gradient(135deg, rgba(0,243,255,0.05) 0%, rgba(255,0,255,0.05) 100%); border: 1px solid rgba(0,243,255,0.2); border-radius: 6px; padding: 20px; text-align: center;">
                                <div style="color: #00f3ff; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">⚡ PROCESSING STATUS</div>
                                <div style="color: #ffffff; font-size: 12px;">
                                    <span style="color: #00ff00;">●</span> Message Decrypted
                                    <span style="margin: 0 10px; color: #333;">|</span>
                                    <span style="color: #00ff00;">●</span> Queue Priority: HIGH
                                    <span style="margin: 0 10px; color: #333;">|</span>
                                    <span style="color: #ff00ff;">●</span> Response Pending
                                </div>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(180deg, #0a0a0a 0%, #000000 100%); padding: 30px; text-align: center; border-top: 1px solid rgba(255,0,255,0.2);">
                            <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #ff00ff 50%, transparent 100%); margin-bottom: 20px;"></div>
                            <p style="margin: 0; color: #ff00ff; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">
                                DAMIEN SCHONBAKLER
                            </p>
                            <p style="margin: 5px 0 0 0; color: #666666; font-size: 9px; letter-spacing: 1px;">
                                AUTOMATED RESPONSE SYSTEM V4.2
                            </p>
                        </td>
                    </tr>

                    <!-- Animated Border Bottom -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #00f3ff 0%, #ff00ff 50%, #00f3ff 100%); background-size: 200% 100%;"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email, // Sending to the visitor
            subject: `[AUTO-REPLY] Transmission Received // Damien Schonbakler`,
            text: `Greetings ${name}, your message has been received. I will get back to you shortly.`,
            html: ackTemplate,
        });

        return { success: true };
    } catch (error) {
        console.error('Email transmission failed:', error);
        return { success: false, error: 'Transmission failed' };
    }
}
