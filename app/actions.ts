'use server';

import nodemailer from 'nodemailer';

import { z } from "zod";

// Rate limiting map: IP -> { count, lastReset }
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const ContactSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
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
        message: formData.get('message')
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

        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Portfolio Transmission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Courier New', Courier, monospace;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border: 1px solid #1a1a1a; border-top: 4px solid #00f3ff; border-radius: 4px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 40px; border-bottom: 1px solid #1a1a1a; background: linear-gradient(180deg, rgba(0,243,255,0.05) 0%, rgba(0,0,0,0) 100%);">
                            <h1 style="margin: 0; font-size: 20px; color: #00f3ff; text-transform: uppercase; letter-spacing: 2px;">
                                <span style="font-size: 24px;">⚡</span> Secure Uplink Received
                            </h1>
                            <p style="margin: 5px 0 0 0; color: #666666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
                                Encryption: AES-256 // Protocol: SMTP_V4
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            
                            <!-- Sender Info Grid -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td width="50%" style="padding-right: 10px;">
                                        <div style="border: 1px solid #333; padding: 15px; border-radius: 4px;">
                                            <div style="color: #00f3ff; font-size: 10px; text-transform: uppercase; margin-bottom: 5px;">Source_Identity</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: bold;">${name}</div>
                                        </div>
                                    </td>
                                    <td width="50%" style="padding-left: 10px;">
                                        <div style="border: 1px solid #333; padding: 15px; border-radius: 4px;">
                                            <div style="color: #ff00ff; font-size: 10px; text-transform: uppercase; margin-bottom: 5px;">Comm_Channel</div>
                                            <div style="color: #ffffff; font-size: 14px; word-break: break-all;">${email}</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Message Body -->
                            <div style="margin-bottom: 10px; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
                                > Decoded_Payload_Data:
                            </div>
                            <div style="background-color: #111; border: 1px solid #222; border-left: 2px solid #00f3ff; padding: 20px; color: #d4d4d4; font-size: 14px; line-height: 1.6;">
                                ${message.replace(/\n/g, '<br/>')}
                            </div>

                            <!-- Action Button -->
                            <div style="margin-top: 40px; text-align: center;">
                                <a href="mailto:${email}" style="background-color: #00f3ff; color: #000000; text-decoration: none; padding: 12px 30px; font-weight: bold; font-family: sans-serif; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; display: inline-block;">
                                    Reply to Frequency
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #050505; padding: 20px; text-align: center; border-top: 1px solid #1a1a1a;">
                            <p style="margin: 0; color: #444; font-size: 10px;">
                                DAMIEN SCHONBAKLER // ARCHITECTE SOLUTIONS<br>
                                AUTOMATED DISPATCH SYSTEM
                            </p>
                        </td>
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
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Courier New', Courier, monospace;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border: 1px solid #1a1a1a; border-top: 4px solid #ff00ff; border-radius: 4px; overflow: hidden;">
                    <tr>
                        <td style="padding: 30px 40px; border-bottom: 1px solid #1a1a1a;">
                            <h1 style="margin: 0; font-size: 20px; color: #ff00ff; text-transform: uppercase;">
                                📡 Transmission Acknowledged
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px; color: #d4d4d4; font-size: 14px; line-height: 1.6;">
                            <p>Greetings ${name},</p>
                            <p>Your encrypted signal has been successfully received by the mainframe.</p>
                            <p>I will analyze the payload and establish a connection shortly.</p>
                            <br/>
                            <div style="border-left: 2px solid #ff00ff; padding-left: 15px; color: #666; font-size: 12px; font-style: italic;">
                                "Innovation distinguishes between a leader and a follower."
                            </div>
                        </td>
                    </tr>
                    <tr>
                         <td style="background-color: #050505; padding: 20px; text-align: center; border-top: 1px solid #1a1a1a;">
                            <p style="margin: 0; color: #444; font-size: 10px;">
                                DAMIEN SCHONBAKLER // AUTOMATED SYSTEM
                            </p>
                        </td>
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
