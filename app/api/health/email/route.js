// GET /api/health/email — deliverability diagnostics (Task B).
//
//   /api/health/email
//     → { brevoConfigured, supabaseConfigured, sender }   (safe booleans, no secrets)
//
//   /api/health/email?to=you@example.com&token=<EMAIL_TEST_TOKEN>
//     → actually sends a test email via the Brevo API and returns Brevo's exact
//       result. Use this to confirm the API key works AND the sender/domain is
//       verified — a "brevo_400: sender not valid" here is the usual reason mail
//       never lands. The send path is disabled unless EMAIL_TEST_TOKEN is set.
import { NextResponse } from "next/server";
import { sendBrevoEmail, hasBrevo, SENDER } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to");
  const token = searchParams.get("token");

  const status = {
    brevoConfigured: hasBrevo(),
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), // enables Brevo-sent magic links
    sender: SENDER,
    testEnabled: Boolean(process.env.EMAIL_TEST_TOKEN),
  };

  // No test requested → just report config.
  if (!to) return NextResponse.json(status);

  // Test send is gated behind a shared token so this can't be used as an open relay.
  const expected = process.env.EMAIL_TEST_TOKEN;
  if (!expected) return NextResponse.json({ ...status, error: "test_disabled_set_EMAIL_TEST_TOKEN" }, { status: 503 });
  if (token !== expected) return NextResponse.json({ ...status, error: "bad_token" }, { status: 401 });

  const result = await sendBrevoEmail({
    to,
    subject: "sey.la | book — email deliverability test",
    html: `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#F5F4F1;padding:24px">
      <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #E9E5E0;border-radius:16px;padding:24px 26px">
        <div style="font-size:17px;color:#23201E"><b>sey.la</b> <span style="color:#9A938D">|</span> book</div>
        <h1 style="font-size:20px;color:#23201E;margin:12px 0 8px">Deliverability test ✅</h1>
        <p style="color:#47423F;font-size:15px;line-height:1.5;margin:0">If you're reading this, the Brevo API key works and <b>${SENDER.email}</b> is a verified sender. Magic-link + booking-confirmation emails should land too.</p>
      </div>
    </body></html>`,
  });

  const ok = !result.error;
  return NextResponse.json({ ...status, sent: ok, result }, { status: ok ? 200 : 502 });
}
