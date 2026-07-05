// sey.la | book — Supabase client.
// Uses the publishable (anon) key, safe for the browser. RLS enforces access.
// Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// A single shared client. Returns null if env is not configured so pages can
// gracefully fall back to demo data instead of crashing the build.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const hasSupabase = Boolean(supabase);
