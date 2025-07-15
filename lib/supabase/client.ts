import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  if (supabaseUrl.includes("your_supabase_url_here") || supabaseAnonKey.includes("your_supabase_anon_key_here")) {
    throw new Error(
      "Please replace the placeholder Supabase credentials in your .env.local file with your actual Supabase project URL and anon key.",
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
