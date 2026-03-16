const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const controller = require('../controllers/auth.controller');

router.post(
  '/register',
  [
    body('supabase_id').isUUID().withMessage('Invalid supabase_id'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  validate,
  controller.register
);

module.exports = router;
