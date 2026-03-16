const db = require('../config/db');

async function create({ bookingId, hostId, cleanerId, rating, comment }) {
  const { rows } = await db.query(
    `INSERT INTO reviews (booking_id, host_id, cleaner_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [bookingId, hostId, cleanerId, rating, comment || null]
  );
  return rows[0];
}

async function findByBookingId(bookingId) {
  const { rows } = await db.query(
    'SELECT * FROM reviews WHERE booking_id = $1',
    [bookingId]
  );
  return rows[0] || null;
}

async function findByCleanerId(cleanerId) {
  const { rows } = await db.query(
    `SELECT r.*, u.name AS host_name
     FROM reviews r
     JOIN users u ON u.id = r.host_id
     WHERE r.cleaner_id = $1
     ORDER BY r.created_at DESC`,
    [cleanerId]
  );
  return rows;
}

module.exports = { create, findByBookingId, findByCleanerId };
