const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  voteQuestion,
  acceptAnswer
} = require('../controllers/questionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.post('/', verifyToken, createQuestion);
router.post('/:id/vote', verifyToken, voteQuestion);
router.post('/:id/accept/:answerId', verifyToken, acceptAnswer);

module.exports = router;
