const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getUserNotifications);
router.post('/:id/read', verifyToken, markAsRead);

module.exports = router;
