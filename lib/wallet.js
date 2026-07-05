// Wallet — read-only for the customer (RLS wallet_self: SELECT where user_email
// matches the session email). Credits are added server-side (e.g. referral
// completion), never from the client.
import { supabase } from "./supabaseClient";

export async function getWallet() {
  if (!supabase) return { balance: 0, transactions: [] };
  const { data: auth } = await supabase.auth.getUser();
  if (!auth || !auth.user) return { balance: 0, transactions: [] };
  const { data, error } = await supabase
    .from("wallet_transactions")
    .select("id, amount_eur, kind, note, created_at")
    .order("created_at", { ascending: false });
  if (error) return { balance: 0, transactions: [] };
  const transactions = (data || []).map((t) => ({
    id: t.id,
    amount: Number(t.amount_eur) || 0,
    kind: t.kind || "",
    note: t.note || "",
    createdAt: t.created_at,
  }));
  const balance = transactions.reduce((n, t) => n + t.amount, 0);
  return { balance, transactions };
}
