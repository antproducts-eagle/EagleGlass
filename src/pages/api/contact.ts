import type { APIRoute } from "astro";
import { Resend } from "resend";
import { getSiteSettings } from "../../lib/sanity";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Skip verification if not configured

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = await res.json();
  return data.success === true;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, message, turnstileToken, website } = body;

    // Honeypot check — bots fill hidden fields
    if (website) {
      // Silently reject but return success to not tip off the bot
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // Validate required fields
    if (!name?.trim() || !email?.trim()) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400 }
      );
    }

    // Verify Turnstile token
    if (turnstileToken) {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) {
        return new Response(
          JSON.stringify({ error: "Bot verification failed" }),
          { status: 403 }
        );
      }
    } else if (import.meta.env.TURNSTILE_SECRET_KEY) {
      // Turnstile is configured but no token provided
      return new Response(
        JSON.stringify({ error: "Verification required" }),
        { status: 403 }
      );
    }

    // Get contact email from Sanity (or fallback)
    const settings = await getSiteSettings();
    const toEmail = settings?.contactEmail || import.meta.env.CONTACT_EMAIL || "Info@antproducts.nl";

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: import.meta.env.RESEND_FROM || "onboarding@resend.dev",
      to: toEmail,
      subject: `New pricing request from ${name}`,
      html: `
        <h2>New Pricing Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${message ? `<p><strong>Message:</strong> ${escapeHtml(message)}</p>` : ""}
        <hr>
        <p style="color: #888; font-size: 12px;">Sent from Eagle Glass website</p>
      `,
      replyTo: email,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
