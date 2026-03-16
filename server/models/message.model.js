const db = require('../config/db');

async function create({ conversationId, senderId, body }) {
  const { rows } = await db.query(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [conversationId, senderId, body]
  );
  return rows[0];
}

async function findByConversationId(conversationId) {
  const { rows } = await db.query(
    `SELECT m.*, u.name AS sender_name
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at ASC`,
    [conversationId]
  );
  return rows;
}

async function markRead(conversationId, userId) {
  await db.query(
    `UPDATE messages
     SET read_at = NOW()
     WHERE conversation_id = $1 AND sender_id != $2 AND read_at IS NULL`,
    [conversationId, userId]
  );
}

module.exports = { create, findByConversationId, markRead };
