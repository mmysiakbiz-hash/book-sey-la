// POST /api/auth/magic-link — send a sign-in magic link via Brevo (Task B, Option A).
//
// Instead of relying on Supabase's own SMTP, we generate the magic link with the
// Supabase Admin API (service role) and email it through the Brevo API — the same
// proven path as booking confirmations. Magic-link delivery no longer depends on
// Supabase Custom SMTP being configured.
//
// Requires (server-only): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BREVO_API_KEY.
// The redirect target must still be allow-listed in Supabase → Auth → URL Configuration.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBrevoEmail, magicLinkEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isMissingUser(err) {
  const m = ((err && err.message) || "").toLowerCase();
  return m.includes("not found") || m.includes("no user") || m.includes("user_not_found");
}

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  if (!serviceKey) return NextResponse.json({ error: "service_role_not_configured" }, { status: 503 });

  const body = await req.json().catch(() => null);
  const email = body && typeof body.email === "string" ? body.email.trim() : "";
  const redirectTo = body && typeof body.redirectTo === "string" ? body.redirectTo : undefined;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const options = redirectTo ? { redirectTo } : undefined;

  // Generate a magic link for an existing user; if the user doesn't exist yet,
  // create them (passwordless) and try again — mirrors signInWithOtp({ shouldCreateUser: true }).
  async function generate() {
    return admin.auth.admin.generateLink({ type: "magiclink", email, options });
  }

  let { data, error } = await generate();
  if (error && isMissingUser(error)) {
    const created = await admin.auth.admin.createUser({ email, email_confirm: false });
    // "already registered" races are fine — just retry the link generation.
    if (created.error && !/(already|registered|exists)/i.test(created.error.message || "")) {
      console.error("[magic-link] createUser failed:", created.error.message);
      return NextResponse.json({ error: "could_not_create_user" }, { status: 400 });
    }
    ({ data, error } = await generate());
  }

  if (error || !data || !data.properties || !data.properties.action_link) {
    console.error("[magic-link] generateLink failed:", error && error.message);
    return NextResponse.json({ error: (error && error.message) || "link_generation_failed" }, { status: 400 });
  }

  const { subject, html } = magicLinkEmail({ actionLink: data.properties.action_link });
  const mail = await sendBrevoEmail({ to: email, subject, html });
  if (mail.error) {
    console.error("[magic-link] email send failed:", mail.error);
    return NextResponse.json({ error: mail.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
