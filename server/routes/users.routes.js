const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/users.controller');

router.get('/me', requireAuth, controller.getMe);

router.patch(
  '/me',
  requireAuth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('role').optional().isIn(['host', 'cleaner']).withMessage('Role must be host or cleaner'),
    body('phone').optional().trim(),
  ],
  validate,
  controller.updateMe
);

module.exports = router;
