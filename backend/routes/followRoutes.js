// backend/routes/followRoutes.js
const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const auth = require('../middleware/auth');

router.post('/:traderId', auth, followController.followTrader);
router.delete('/:traderId', auth, followController.unfollowTrader);

module.exports = router;
