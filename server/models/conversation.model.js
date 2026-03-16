const db = require('../config/db');

async function findOrCreate({ hostId, cleanerId }) {
  const { rows } = await db.query(
    `INSERT INTO conversations (host_id, cleaner_id)
     VALUES ($1, $2)
     ON CONFLICT (host_id, cleaner_id) DO UPDATE SET host_id = EXCLUDED.host_id
     RETURNING *`,
    [hostId, cleanerId]
  );
  return rows[0];
}

async function findByUserId(userId) {
  const { rows } = await db.query(
    `SELECT
       c.*,
       host.name    AS host_name,
       cleaner.name AS cleaner_name,
       (SELECT body       FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
       (SELECT created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message_at,
       (SELECT COUNT(*)   FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != $1 AND m.read_at IS NULL)::int AS unread_count
     FROM conversations c
     JOIN users host    ON host.id    = c.host_id
     JOIN users cleaner ON cleaner.id = c.cleaner_id
     WHERE c.host_id = $1 OR c.cleaner_id = $1
     ORDER BY last_message_at DESC NULLS LAST`,
    [userId]
  );
  return rows;
}

async function findById(id) {
  const { rows } = await db.query(
    `SELECT c.*, host.name AS host_name, cleaner.name AS cleaner_name
     FROM conversations c
     JOIN users host    ON host.id    = c.host_id
     JOIN users cleaner ON cleaner.id = c.cleaner_id
     WHERE c.id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { findOrCreate, findByUserId, findById };
