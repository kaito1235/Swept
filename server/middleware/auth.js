const supabaseAdmin = require('../config/supabase');
const userModel = require('../models/user.model');
const { unauthorized, forbidden } = require('../utils/apiResponse');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Supabase Admin verifies the JWT — handles key rotation automatically
    console.log('[auth] verifying token...');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    console.log('[auth] result:', { userId: user?.id, error: error?.message });

    if (error || !user) {
      return unauthorized(res, 'Invalid or expired token');
    }

    const appUser = await userModel.findBySupabaseId(user.id);

    if (!appUser) {
      return unauthorized(res, 'User not found');
    }

    req.user = appUser;
    req.supabaseUser = user;
    next();
  } catch (err) {
    return unauthorized(res, 'Token verification failed');
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return forbidden(res, 'Insufficient permissions');
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
