const db = require('../config/db');

async function findByUserId(userId) {
  const { rows } = await db.query(
    'SELECT * FROM cleaner_profiles WHERE user_id = $1',
    [userId]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await db.query(
    'SELECT * FROM cleaner_profiles WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function create(userId) {
  const { rows } = await db.query(
    `INSERT INTO cleaner_profiles (user_id) VALUES ($1) RETURNING *`,
    [userId]
  );
  return rows[0];
}

async function search(filters = {}) {
  const { area, minRate, maxRate, serviceType } = filters;
  const conditions = ['cp.is_active = true'];
  const values = [];
  let idx = 1;

  if (area) {
    conditions.push(`cp.service_area ILIKE $${idx++}`);
    values.push(`%${area}%`);
  }
  if (minRate !== undefined && minRate !== '') {
    conditions.push(`cp.hourly_rate >= $${idx++}`);
    values.push(Number(minRate));
  }
  if (maxRate !== undefined && maxRate !== '') {
    conditions.push(`cp.hourly_rate <= $${idx++}`);
    values.push(Number(maxRate));
  }
  if (serviceType) {
    conditions.push(`$${idx++} = ANY(cp.service_types)`);
    values.push(serviceType);
  }

  const where = conditions.join(' AND ');
  const { rows } = await db.query(
    `SELECT cp.id, cp.user_id, cp.bio, cp.hourly_rate, cp.service_area,
            cp.service_types, cp.availability, cp.avg_rating, cp.review_count,
            u.name, u.avatar
     FROM cleaner_profiles cp
     JOIN users u ON u.id = cp.user_id
     WHERE ${where}
     ORDER BY cp.avg_rating DESC, cp.review_count DESC
     LIMIT 50`,
    values
  );
  return rows;
}

async function findByIdWithUser(id) {
  const { rows } = await db.query(
    `SELECT cp.*, u.name, u.email, u.avatar
     FROM cleaner_profiles cp
     JOIN users u ON u.id = cp.user_id
     WHERE cp.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function update(userId, fields) {
  const allowed = ['bio', 'hourly_rate', 'service_area', 'service_radius', 'service_types', 'availability', 'photos', 'is_active'];
  const updates = Object.keys(fields)
    .filter((k) => allowed.includes(k) && fields[k] !== undefined);

  if (updates.length === 0) return findByUserId(userId);

  const setClauses = updates.map((k, i) => `${k} = $${i + 2}`).join(', ');
  const values = [userId, ...updates.map((k) => fields[k])];

  const { rows } = await db.query(
    `UPDATE cleaner_profiles SET ${setClauses} WHERE user_id = $1 RETURNING *`,
    values
  );
  return rows[0] || null;
}

module.exports = { findByUserId, findById, findByIdWithUser, create, update, search };
