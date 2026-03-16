const userModel = require('../models/user.model');
const { success, error } = require('../utils/apiResponse');

async function register(req, res) {
  const { supabase_id, email, name, phone } = req.body;

  try {
    // Check if user already exists (idempotent — safe to call on retry)
    const existing = await userModel.findBySupabaseId(supabase_id);
    if (existing) {
      return success(res, existing, 200);
    }

    const user = await userModel.create({ supabaseId: supabase_id, email, name, phone });
    return success(res, user, 201);
  } catch (err) {
    if (err.code === '23505') {
      return error(res, 'Email already registered', 409);
    }
    console.error('register error:', err);
    return error(res, 'Failed to create user account');
  }
}

module.exports = { register };
