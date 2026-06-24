import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.startsWith("http")) {
    return envUrl.trim();
  }
  return "https://opytbjvrbclkrmqzcnoz.supabase.co";
}

function getSupabaseAnonKey(): string {
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envKey && typeof envKey === "string" && envKey.trim().length > 20) {
    return envKey.trim();
  }
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9weXRianZyYmNsa3JtcXpjbm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzY0NTQsImV4cCI6MjA5NzgxMjQ1NH0.GkzAX_KRDo_-A1shRPavVDBA3PbKRvkb43cs9kpEmQ4";
}

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
