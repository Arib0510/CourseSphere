// =============================================
// Supabase Client Configuration
// =============================================
// Two clients:
//   - supabase      → uses anon key, respects RLS (for user-scoped ops)
//   - supabaseAdmin → uses service role key, bypasses RLS (for admin ops)
// =============================================

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

// Public client — uses anon key, respects Row Level Security
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — uses service role key, bypasses Row Level Security
// Used for admin operations (managing courses, viewing all students, etc.)
const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

if (!supabaseAdmin) {
  console.warn(
    "⚠️  SUPABASE_SERVICE_ROLE_KEY not set — admin operations will be limited"
  );
}

module.exports = { supabase, supabaseAdmin };
