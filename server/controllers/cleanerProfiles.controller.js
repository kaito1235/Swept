const cleanerProfileModel = require('../models/cleanerProfile.model');
const { success, error, notFound } = require('../utils/apiResponse');

async function getMyProfile(req, res) {
  try {
    const profile = await cleanerProfileModel.findByUserId(req.user.id);
    if (!profile) return notFound(res, 'Cleaner profile not found');
    return success(res, profile);
  } catch (err) {
    return error(res, 'Failed to fetch cleaner profile');
  }
}

async function updateMyProfile(req, res) {
  const { bio, hourly_rate, service_area, service_radius, service_types, availability, is_active } = req.body;
  try {
    const updated = await cleanerProfileModel.update(req.user.id, {
      bio,
      hourly_rate,
      service_area,
      service_radius,
      service_types,
      availability,
      is_active,
    });
    if (!updated) return notFound(res, 'Cleaner profile not found');
    return success(res, updated);
  } catch (err) {
    console.error('cleanerProfiles.update error:', err);
    return error(res, 'Failed to update cleaner profile');
  }
}

async function getById(req, res) {
  try {
    const profile = await cleanerProfileModel.findById(req.params.id);
    if (!profile) return notFound(res, 'Cleaner profile not found');
    return success(res, profile);
  } catch (err) {
    return error(res, 'Failed to fetch cleaner profile');
  }
}

async function search(req, res) {
  try {
    const results = await cleanerProfileModel.search(req.query);
    return success(res, results);
  } catch (err) {
    console.error('cleanerProfiles.search error:', err);
    return error(res, 'Failed to search cleaner profiles');
  }
}

async function getByIdPublic(req, res) {
  try {
    const profile = await cleanerProfileModel.findByIdWithUser(req.params.id);
    if (!profile) return notFound(res, 'Cleaner profile not found');
    return success(res, profile);
  } catch (err) {
    return error(res, 'Failed to fetch cleaner profile');
  }
}

module.exports = { getMyProfile, updateMyProfile, getById, getByIdPublic, search };
