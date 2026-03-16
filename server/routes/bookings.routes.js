const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/bookings.controller');

// Stats (used by dashboards) — any authenticated user
router.get('/stats', requireAuth, controller.stats);

// Host routes
router.get('/host', requireAuth, requireRole('host'), controller.listForHost);

router.post(
  '/',
  requireAuth,
  requireRole('host'),
  [
    body('cleanerId').isUUID().withMessage('cleanerId must be a valid UUID'),
    body('propertyId').isUUID().withMessage('propertyId must be a valid UUID'),
    body('scheduledDate').isDate().withMessage('scheduledDate must be a valid date (YYYY-MM-DD)'),
    body('scheduledTime').matches(/^\d{2}:\d{2}$/).withMessage('scheduledTime must be HH:MM'),
    body('durationHours').isFloat({ min: 1, max: 12 }).withMessage('durationHours must be between 1 and 12'),
    body('serviceType').optional().isIn(['standard', 'deep_clean', 'move_in_out', 'airbnb_turnover', 'office', 'post_construction']),
  ],
  validate,
  controller.create
);

// Cleaner routes
router.get('/cleaner', requireAuth, requireRole('cleaner'), controller.listForCleaner);

// Status update — both host and cleaner can call this
router.patch(
  '/:id/status',
  requireAuth,
  [body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status')],
  validate,
  controller.updateStatus
);

// Cleaner confirms job completion with photos (triggers payment capture)
router.post(
  '/:id/confirm',
  requireAuth,
  requireRole('cleaner'),
  [body('photos').isArray().withMessage('photos must be an array')],
  validate,
  controller.confirmJob
);

module.exports = router;
