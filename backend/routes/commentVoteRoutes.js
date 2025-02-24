const express = require('express');
const router = express.Router();
const commentVoteController = require('../controllers/commentVoteController');
const auth = require('../middleware/auth');

router.post('/:commentId/vote', auth, commentVoteController.voteComment);

module.exports = router;
