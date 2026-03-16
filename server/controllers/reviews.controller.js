const reviewModel = require('../models/review.model');
const bookingModel = require('../models/booking.model');
const { success, error, notFound, forbidden } = require('../utils/apiResponse');

async function create(req, res) {
  const { bookingId, rating, comment } = req.body;
  try {
    const booking = await bookingModel.findById(bookingId);
    if (!booking) return notFound(res, 'Booking not found');
    if (booking.host_id !== req.user.id) return forbidden(res, 'Only the host can review this booking');
    if (booking.status !== 'completed') return error(res, 'Can only review completed bookings', 400);

    const existing = await reviewModel.findByBookingId(bookingId);
    if (existing) return error(res, 'You have already reviewed this booking', 409);

    const review = await reviewModel.create({
      bookingId,
      hostId: req.user.id,
      cleanerId: booking.cleaner_id,
      rating,
      comment,
    });
    return success(res, review, 201);
  } catch (err) {
    console.error('reviews.create error:', err);
    return error(res, 'Failed to submit review');
  }
}

async function listForCleaner(req, res) {
  try {
    const reviews = await reviewModel.findByCleanerId(req.params.cleanerId);
    return success(res, reviews);
  } catch (err) {
    console.error('reviews.listForCleaner error:', err);
    return error(res, 'Failed to fetch reviews');
  }
}

module.exports = { create, listForCleaner };
