const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const controller = require('../controllers/cleanerProfiles.controller');

const cleanerOnly = [requireAuth, requireRole('cleaner')];

router.get('/search', controller.search);
router.get('/me', ...cleanerOnly, controller.getMyProfile);
router.patch('/me', ...cleanerOnly, controller.updateMyProfile);
router.get('/public/:id', controller.getByIdPublic);
router.get('/:id', requireAuth, controller.getById);

module.exports = router;
