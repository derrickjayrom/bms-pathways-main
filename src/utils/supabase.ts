import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://owurtseimitnofbdepoq.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_9vad-MXJlUFfjqs00nQoOQ_MlIPtjW2";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] || DEFAULT_SUPABASE_URL;
const supabaseKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || DEFAULT_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
