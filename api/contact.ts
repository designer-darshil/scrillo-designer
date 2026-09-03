import type { IncomingMessage, ServerResponse } from 'http';
import nodemailer from 'nodemailer';

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  _gotcha?: string; // Honeypot spam trap
}

const RECIPIENT_EMAIL = 'darshilbhuva4322@gmail.com';

export async function processContactSubmission(payload: ContactPayload): Promise<{ success: boolean; message?: string; error?: string }> {
  const { name, email, message, _gotcha } = payload;

  // 1. Honeypot check for bots
  if (_gotcha) {
    // Silently discard bot submission
    return { success: true, message: 'Message received.' };
  }

  // 2. Server-side validation
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedMessage = (message || '').trim();

  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: 'Name is required (at least 2 characters).' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return { success: false, error: 'A valid email address is required.' };
  }

  if (!trimmedMessage || trimmedMessage.length < 10) {
    return { success: false, error: 'Message is required (at least 10 characters).' };
  }

  if (trimmedMessage.length > 5000) {
    return { success: false, error: 'Message exceeds maximum length (5000 characters).' };
  }

  const subject = `New Portfolio Inquiry from ${trimmedName}`;
  const plainText = `You received a new inquiry from your portfolio website:

Name: ${trimmedName}
Email: ${trimmedEmail}
Date: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} (IST)

Message:
----------------------------------------
${trimmedMessage}
----------------------------------------

Reply directly to this email to respond to ${trimmedName} (${trimmedEmail}).`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff; color: #111111;">
      <h2 style="margin-top: 0; color: #FF3E00; border-bottom: 2px solid #FF3E00; padding-bottom: 8px;">New Portfolio Contact Submission</h2>
      <p style="font-size: 15px; line-height: 1.5;">You received a new message from your portfolio contact form.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr>
          <td style="padding: 8px 12px; background-color: #f8f8f8; font-weight: bold; width: 100px;">From:</td>
          <td style="padding: 8px 12px; background-color: #f8f8f8;">${trimmedName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold;">Email:</td>
          <td style="padding: 8px 12px;"><a href="mailto:${trimmedEmail}" style="color: #FF3E00; text-decoration: none;">${trimmedEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background-color: #f8f8f8; font-weight: bold;">Sent At:</td>
          <td style="padding: 8px 12px; background-color: #f8f8f8;">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</td>
        </tr>
      </table>

      <div style="margin-top: 20px;">
        <h3 style="font-size: 15px; margin-bottom: 8px;">Message:</h3>
        <div style="background-color: #f8f8f8; padding: 16px; border-radius: 6px; border-left: 4px solid #FF3E00; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${trimmedMessage}</div>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eaeaea; font-size: 12px; color: #888888;">
        Sent securely via Darshil Bhuva Portfolio Contact API.
      </div>
    </div>
  `;

  // Delivery Strategy 1: Resend HTTP API (Recommended for Vercel)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: process.env.SENDER_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
          to: [RECIPIENT_EMAIL],
          reply_to: trimmedEmail,
          subject,
          text: plainText,
          html: htmlContent
        })
      });

      const data = await res.json();
      if (res.ok) {
        return { success: true, message: 'Message sent successfully via Resend.' };
      }
      console.error('[Resend Error]', data);
    } catch (err) {
      console.error('[Resend Fetch Error]', err);
    }
  }

  // Delivery Strategy 2: SMTP / Nodemailer (e.g. Gmail App Password, Brevo, SendGrid)
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : (Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT),
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"${trimmedName}" <${smtpUser}>`,
        to: RECIPIENT_EMAIL,
        replyTo: trimmedEmail,
        subject,
        text: plainText,
        html: htmlContent
      });

      return { success: true, message: 'Message sent successfully via SMTP.' };
    } catch (err) {
      console.error('[SMTP Error]', err);
    }
  }

  // Delivery Strategy 3: FormSubmit Server Relay
  try {
    const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://scrillo.vercel.app',
        'Referer': 'https://scrillo.vercel.app/contact'
      },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        _subject: subject,
        _template: 'table',
        _replyto: trimmedEmail
      })
    });

    const fsData = await formSubmitRes.json();
    if (formSubmitRes.ok && fsData.success !== 'false') {
      return { success: true, message: 'Message sent successfully.' };
    }

    if (fsData.message && fsData.message.includes('Activation')) {
      return {
        success: false,
        error: "Form needs one-time activation. FormSubmit sent an 'Activate Form' link to darshilbhuva4322@gmail.com. Please check your inbox and click it to activate, or configure RESEND_API_KEY in environment variables."
      };
    }

    return { success: false, error: fsData.message || 'Email delivery failed.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unable to deliver message right now.' };
  }
}

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    if (res.setHeader) {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
    return new Response(JSON.stringify({ error: `Method ${req.method} Not Allowed` }), { status: 405 });
  }

  let body = req.body;
  // If body is raw string, parse it
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  const result = await processContactSubmission(body || {});

  if (res.status && res.json) {
    return res.status(result.success ? 200 : 400).json(result);
  }

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
