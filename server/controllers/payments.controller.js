const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bookingModel = require('../models/booking.model');
const { success, error, notFound, forbidden } = require('../utils/apiResponse');

const PLATFORM_FEE_PERCENT = 0.125; // 12.5%

async function createPaymentIntent(req, res) {
  const { bookingId } = req.body;
  try {
    const booking = await bookingModel.findById(bookingId);
    if (!booking) return notFound(res, 'Booking not found');
    if (booking.host_id !== req.user.id) return forbidden(res);
    if (!booking.total_price) return error(res, 'Booking has no price set', 400);
    if (booking.payment_status !== 'unpaid') {
      return error(res, 'Payment already initiated for this booking', 400);
    }

    const amountPence = Math.round(Number(booking.total_price) * 100);
    const platformFee = Math.round(amountPence * PLATFORM_FEE_PERCENT) / 100;

    const intent = await stripe.paymentIntents.create({
      amount: amountPence,
      currency: 'gbp',
      capture_method: 'manual', // authorise now, capture when job is confirmed complete
      metadata: { bookingId, hostId: req.user.id },
      description: `Swept cleaning — booking ${bookingId}`,
    });

    await bookingModel.updatePaymentIntent(bookingId, intent.id, 'authorized', platformFee);

    return success(res, { clientSecret: intent.client_secret, intentId: intent.id });
  } catch (err) {
    console.error('payments.createIntent error:', err);
    return error(res, 'Failed to create payment');
  }
}

async function capturePayment(req, res) {
  const { bookingId } = req.params;
  try {
    const booking = await bookingModel.findById(bookingId);
    if (!booking) return notFound(res, 'Booking not found');

    const isParticipant =
      booking.host_id === req.user.id || booking.cleaner_id === req.user.id;
    if (!isParticipant) return forbidden(res);
    if (!booking.stripe_payment_intent_id) return error(res, 'No payment to capture', 400);
    if (booking.payment_status === 'captured') return error(res, 'Payment already captured', 400);

    await stripe.paymentIntents.capture(booking.stripe_payment_intent_id);
    const updated = await bookingModel.updatePaymentStatus(bookingId, 'captured');
    return success(res, updated);
  } catch (err) {
    console.error('payments.capture error:', err);
    return error(res, 'Failed to capture payment');
  }
}

module.exports = { createPaymentIntent, capturePayment };
