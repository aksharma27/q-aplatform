const express = require('express');
const router = express.Router();
const {
  banUser,
  unbanUser,
  rejectQuestion,
  sendGlobalMessage,
  downloadUserReport
} = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/ban/:userId', verifyToken, isAdmin, banUser);
router.post('/unban/:userId', verifyToken, isAdmin, unbanUser);
router.post('/reject/:questionId', verifyToken, isAdmin, rejectQuestion);
router.post('/message', verifyToken, isAdmin, sendGlobalMessage);
router.get('/report/users', verifyToken, isAdmin, downloadUserReport);

module.exports = router;
