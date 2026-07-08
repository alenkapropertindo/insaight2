import { createClient } from "@supabase/supabase-js";

// Retrieve URL and Key from import.meta.env, falling back to your provided credentials
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "https://knjpeszrhkrprsjafqsq.supabase.co";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "sb_publishable_ZZOpafX5kBQcRWBs9-Y6sA_baLtG1HH";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
