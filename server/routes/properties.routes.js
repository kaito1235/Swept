const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/properties.controller');

const hostOnly = [requireAuth, requireRole('host')];

router.get('/', ...hostOnly, controller.list);

router.post(
  '/',
  ...hostOnly,
  [
    body('name').trim().notEmpty().withMessage('Property name is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('bedrooms').optional().isInt({ min: 0 }),
    body('bathrooms').optional().isInt({ min: 0 }),
  ],
  validate,
  controller.create
);

router.get('/:id', requireAuth, controller.getOne);
router.patch('/:id', ...hostOnly, validate, controller.update);
router.delete('/:id', ...hostOnly, controller.remove);

module.exports = router;
