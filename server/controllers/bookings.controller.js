const bookingModel = require('../models/booking.model');
const cleanerProfileModel = require('../models/cleanerProfile.model');
const propertyModel = require('../models/property.model');
const { success, error, notFound, forbidden } = require('../utils/apiResponse');

async function create(req, res) {
  const { cleanerId, propertyId, scheduledDate, scheduledTime, durationHours, serviceType, notes } = req.body;
  try {
    // Verify property belongs to this host
    const property = await propertyModel.findById(propertyId);
    if (!property) return notFound(res, 'Property not found');
    if (property.host_id !== req.user.id) return forbidden(res, 'Property does not belong to you');

    // Calculate total price if cleaner has a rate
    const cleanerProfile = await cleanerProfileModel.findByUserId(cleanerId);
    const totalPrice = cleanerProfile?.hourly_rate
      ? Number(cleanerProfile.hourly_rate) * Number(durationHours)
      : null;

    const booking = await bookingModel.create({
      hostId: req.user.id,
      cleanerId,
      propertyId,
      scheduledDate,
      scheduledTime,
      durationHours,
      serviceType: serviceType || 'standard',
      notes,
      totalPrice,
    });

    return success(res, booking, 201);
  } catch (err) {
    console.error('bookings.create error:', err);
    return error(res, 'Failed to create booking');
  }
}

async function listForHost(req, res) {
  try {
    const bookings = await bookingModel.findByHostId(req.user.id);
    return success(res, bookings);
  } catch (err) {
    console.error('bookings.listForHost error:', err);
    return error(res, 'Failed to fetch bookings');
  }
}

async function listForCleaner(req, res) {
  try {
    const bookings = await bookingModel.findByCleanerId(req.user.id);
    return success(res, bookings);
  } catch (err) {
    console.error('bookings.listForCleaner error:', err);
    return error(res, 'Failed to fetch bookings');
  }
}

async function updateStatus(req, res) {
  const { status } = req.body;
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) return notFound(res, 'Booking not found');

    const isHost = booking.host_id === req.user.id;
    const isCleaner = booking.cleaner_id === req.user.id;

    if (!isHost && !isCleaner) return forbidden(res);

    // Permission rules:
    // - Cleaner can: confirm, cancel (pending bookings)
    // - Host can: cancel, mark completed (confirmed bookings)
    const allowedTransitions = {
      host: { confirmed: ['completed', 'cancelled'], pending: ['cancelled'] },
      cleaner: { pending: ['confirmed', 'cancelled'] },
    };

    const role = isHost ? 'host' : 'cleaner';
    const allowed = allowedTransitions[role]?.[booking.status] ?? [];

    if (!allowed.includes(status)) {
      return error(res, `Cannot transition booking from '${booking.status}' to '${status}'`, 400);
    }

    const updated = await bookingModel.updateStatus(req.params.id, status);
    return success(res, updated);
  } catch (err) {
    console.error('bookings.updateStatus error:', err);
    return error(res, 'Failed to update booking');
  }
}

async function stats(req, res) {
  try {
    const role = req.user.role;
    const counts = role === 'host'
      ? await bookingModel.countByHostId(req.user.id)
      : await bookingModel.countByCleanerId(req.user.id);
    return success(res, counts);
  } catch (err) {
    console.error('bookings.stats error:', err);
    return error(res, 'Failed to fetch stats');
  }
}

async function confirmJob(req, res) {
  const { photos } = req.body; // array of public photo URLs from Supabase Storage
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) return notFound(res, 'Booking not found');
    if (booking.cleaner_id !== req.user.id) return forbidden(res, 'Only the cleaner can confirm a job');
    if (booking.status !== 'confirmed') {
      return error(res, 'Booking must be confirmed before it can be completed', 400);
    }

    const updated = await bookingModel.confirmJob(req.params.id, photos || []);

    // Capture payment if one was authorised
    if (booking.stripe_payment_intent_id && booking.payment_status === 'authorized') {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        await stripe.paymentIntents.capture(booking.stripe_payment_intent_id);
        await bookingModel.updatePaymentStatus(req.params.id, 'captured');
      } catch (stripeErr) {
        console.error('Payment capture failed after job confirmation:', stripeErr.message);
        // Don't fail the confirmation — flag it for manual review
        await bookingModel.updatePaymentStatus(req.params.id, 'capture_failed');
      }
    }

    return success(res, updated);
  } catch (err) {
    console.error('bookings.confirmJob error:', err);
    return error(res, 'Failed to confirm job');
  }
}

module.exports = { create, listForHost, listForCleaner, updateStatus, stats, confirmJob };
