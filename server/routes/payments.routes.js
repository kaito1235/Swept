const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/payments.controller');

// Create a payment intent (host pays when making a booking)
router.post(
  '/intent',
  requireAuth,
  requireRole('host'),
  [body('bookingId').isUUID().withMessage('bookingId must be a UUID')],
  validate,
  controller.createPaymentIntent
);

// Capture a previously authorised payment (called on job completion)
router.post(
  '/capture/:bookingId',
  requireAuth,
  controller.capturePayment
);

module.exports = router;
