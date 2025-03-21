// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project URL and Anon Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
);



export default supabase;
