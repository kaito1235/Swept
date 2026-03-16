const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const controller = require('../controllers/messages.controller');

// List all conversations for the current user
router.get('/', requireAuth, controller.listConversations);

// Start or retrieve a conversation (hosts initiate)
router.post(
  '/',
  requireAuth,
  requireRole('host'),
  [body('cleanerId').isUUID().withMessage('cleanerId must be a UUID')],
  validate,
  controller.getOrCreateConversation
);

// Get messages in a conversation (both participants)
router.get('/:id', requireAuth, controller.getMessages);

// Send a message
router.post(
  '/:id/messages',
  requireAuth,
  [body('body').notEmpty().trim().withMessage('Message body is required')],
  validate,
  controller.sendMessage
);

module.exports = router;
