const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./users.routes'));
router.use('/properties', require('./properties.routes'));
router.use('/cleaner-profiles', require('./cleanerProfiles.routes'));
router.use('/bookings', require('./bookings.routes'));
router.use('/reviews', require('./reviews.routes'));
router.use('/conversations', require('./messages.routes'));
router.use('/payments', require('./payments.routes'));

module.exports = router;
