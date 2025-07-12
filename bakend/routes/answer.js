const express = require('express');
const router = express.Router();
const {
  addAnswer,
  voteAnswer
} = require('../controllers/answerController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/:questionId', verifyToken, addAnswer);
router.post('/:answerId/vote', verifyToken, voteAnswer);

module.exports = router;
