const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/reviews.controller');

router.post(
  '/',
  requireAuth,
  requireRole('host'),
  [
    body('bookingId').isUUID().withMessage('bookingId must be a valid UUID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
    body('comment').optional().isString().trim(),
  ],
  validate,
  controller.create
);

// Public — used by the cleaner profile page
router.get('/cleaner/:cleanerId', controller.listForCleaner);

module.exports = router;
