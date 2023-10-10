import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kaolubmutwljdkzmnxjh.supabase.co" || "";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
