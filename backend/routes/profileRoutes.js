// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

router.get('/', auth, profileController.getProfile);
router.put('/update', auth, profileController.updateProfile);

module.exports = router;
