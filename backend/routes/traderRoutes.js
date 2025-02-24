// backend/routes/traderRoutes.js
const express = require('express');
const router = express.Router();
const traderController = require('../controllers/traderController');
const voteController = require('../controllers/voteController');
const commentController = require('../controllers/commentController');
const multer = require('multer');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Trader routes
router.get('/', traderController.getTraders);
router.get('/:id', traderController.getTraderById);
router.post('/:id/vote', auth, upload.array('evidence', 5), voteController.submitVote);

// Comment routes (using optionalAuth so both logged-in and anonymous users can post)
router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', optionalAuth, commentController.postComment);

module.exports = router;
