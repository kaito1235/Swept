const db = require('../config/db');

async function findBySupabaseId(supabaseId) {
  const { rows } = await db.query(
    'SELECT * FROM users WHERE supabase_id = $1',
    [supabaseId]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function findByEmail(email) {
  const { rows } = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

async function create({ supabaseId, email, name, phone = null }) {
  const { rows } = await db.query(
    `INSERT INTO users (supabase_id, email, name, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [supabaseId, email, name, phone]
  );
  return rows[0];
}

async function update(id, fields) {
  const allowed = ['name', 'phone', 'role', 'avatar'];
  const updates = Object.keys(fields)
    .filter((k) => allowed.includes(k) && fields[k] !== undefined);

  if (updates.length === 0) return findById(id);

  const setClauses = updates.map((k, i) => `${k} = $${i + 2}`).join(', ');
  const values = [id, ...updates.map((k) => fields[k])];

  const { rows } = await db.query(
    `UPDATE users SET ${setClauses} WHERE id = $1 RETURNING *`,
    values
  );
  return rows[0] || null;
}

module.exports = { findBySupabaseId, findById, findByEmail, create, update };
