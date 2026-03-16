const { createClient } = require('@supabase/supabase-js');

// Service role key bypasses RLS — server only, never expose to client
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabaseAdmin;
