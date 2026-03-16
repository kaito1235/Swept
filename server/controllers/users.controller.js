const userModel = require('../models/user.model');
const cleanerProfileModel = require('../models/cleanerProfile.model');
const { success, error } = require('../utils/apiResponse');
const { ROLES } = require('../config/app');

async function getMe(req, res) {
  return success(res, req.user);
}

async function updateMe(req, res) {
  const { name, phone, role, avatar } = req.body;
  const userId = req.user.id;

  try {
    // Prevent role change if already set
    if (role && req.user.role && req.user.role !== role) {
      return error(res, 'Role cannot be changed once set', 400);
    }

    const updated = await userModel.update(userId, { name, phone, role, avatar });

    // Auto-create cleaner profile when role is set to cleaner
    if (role === ROLES.CLEANER && !req.user.role) {
      await cleanerProfileModel.create(userId);
    }

    return success(res, updated);
  } catch (err) {
    console.error('updateMe error:', err);
    return error(res, 'Failed to update profile');
  }
}

module.exports = { getMe, updateMe };
