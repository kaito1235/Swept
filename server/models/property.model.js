const db = require('../config/db');

async function findByHostId(hostId) {
  const { rows } = await db.query(
    'SELECT * FROM properties WHERE host_id = $1 ORDER BY created_at DESC',
    [hostId]
  );
  return rows;
}

async function findById(id) {
  const { rows } = await db.query(
    'SELECT * FROM properties WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function create({ hostId, name, address, lat, lng, bedrooms, bathrooms, size, notes }) {
  const { rows } = await db.query(
    `INSERT INTO properties (host_id, name, address, lat, lng, bedrooms, bathrooms, size, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [hostId, name, address, lat || null, lng || null, bedrooms || 1, bathrooms || 1, size || null, notes || null]
  );
  return rows[0];
}

async function update(id, fields) {
  const allowed = ['name', 'address', 'lat', 'lng', 'bedrooms', 'bathrooms', 'size', 'photos', 'notes'];
  const updates = Object.keys(fields)
    .filter((k) => allowed.includes(k) && fields[k] !== undefined);

  if (updates.length === 0) return findById(id);

  const setClauses = updates.map((k, i) => `${k} = $${i + 2}`).join(', ');
  const values = [id, ...updates.map((k) => fields[k])];

  const { rows } = await db.query(
    `UPDATE properties SET ${setClauses} WHERE id = $1 RETURNING *`,
    values
  );
  return rows[0] || null;
}

async function remove(id) {
  await db.query('DELETE FROM properties WHERE id = $1', [id]);
}

module.exports = { findByHostId, findById, create, update, remove };
