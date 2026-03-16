const db = require('../config/db');

async function create({ hostId, cleanerId, propertyId, scheduledDate, scheduledTime, durationHours, serviceType, notes, totalPrice }) {
  const { rows } = await db.query(
    `INSERT INTO bookings (host_id, cleaner_id, property_id, scheduled_date, scheduled_time, duration_hours, service_type, notes, total_price)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [hostId, cleanerId, propertyId, scheduledDate, scheduledTime, durationHours, serviceType, notes || null, totalPrice || null]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await db.query(
    `SELECT b.*,
            p.name AS property_name, p.address AS property_address,
            host.name AS host_name,
            cleaner.name AS cleaner_name
     FROM bookings b
     JOIN properties p ON p.id = b.property_id
     JOIN users host ON host.id = b.host_id
     JOIN users cleaner ON cleaner.id = b.cleaner_id
     WHERE b.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function findByHostId(hostId) {
  const { rows } = await db.query(
    `SELECT b.*,
            p.name AS property_name, p.address AS property_address,
            cleaner.name AS cleaner_name,
            cp.hourly_rate AS cleaner_rate, cp.service_area AS cleaner_service_area,
            r.id AS review_id
     FROM bookings b
     JOIN properties p ON p.id = b.property_id
     JOIN users cleaner ON cleaner.id = b.cleaner_id
     LEFT JOIN cleaner_profiles cp ON cp.user_id = b.cleaner_id
     LEFT JOIN reviews r ON r.booking_id = b.id
     WHERE b.host_id = $1
     ORDER BY b.scheduled_date DESC, b.created_at DESC`,
    [hostId]
  );
  return rows;
}

async function findByCleanerId(cleanerId) {
  const { rows } = await db.query(
    `SELECT b.*,
            p.name AS property_name, p.address AS property_address,
            host.name AS host_name
     FROM bookings b
     JOIN properties p ON p.id = b.property_id
     JOIN users host ON host.id = b.host_id
     WHERE b.cleaner_id = $1
     ORDER BY b.scheduled_date DESC, b.created_at DESC`,
    [cleanerId]
  );
  return rows;
}

async function updateStatus(id, status) {
  const { rows } = await db.query(
    `UPDATE bookings SET status = $2 WHERE id = $1 RETURNING *`,
    [id, status]
  );
  return rows[0] || null;
}

async function countByHostId(hostId) {
  const { rows } = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE status IN ('pending', 'confirmed')) AS upcoming,
       COUNT(DISTINCT cleaner_id) FILTER (WHERE status = 'completed') AS cleaners_hired
     FROM bookings WHERE host_id = $1`,
    [hostId]
  );
  return rows[0];
}

async function countByCleanerId(cleanerId) {
  const { rows } = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'pending') AS pending,
       COUNT(*) FILTER (WHERE status = 'confirmed') AS upcoming,
       COUNT(*) FILTER (WHERE status = 'completed') AS completed
     FROM bookings WHERE cleaner_id = $1`,
    [cleanerId]
  );
  return rows[0];
}

module.exports = { create, findById, findByHostId, findByCleanerId, updateStatus, countByHostId, countByCleanerId };
