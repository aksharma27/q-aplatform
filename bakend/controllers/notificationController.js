const Notification = require('../model/notification');
const User = require('../model/user');
const Question = require('../model/question');
const Answer = require('../model/answer');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch notifications', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, recipient: req.user.id });
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });

    notification.read = true;
    await notification.save();
    res.status(200).json({ msg: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update notification', error: err.message });
  }
};

exports.createNotification = async ({ recipient, message }) => {
  try {
    const notification = new Notification({ recipient, message });
    await notification.save();
    // Optionally emit via socket.io here if needed
    return notification;
  } catch (err) {
    // Log error
  }
};

// Add notification when someone answers a question
exports.notifyOnAnswer = async (answer) => {
  try {
    const question = await Question.findById(answer.question);
    if (!question) return;
    await exports.createNotification({
      recipient: question.author,
      message: `Your question received a new answer.`
    });
  } catch (err) {}
};

// Add notification when someone comments (if you have comments)
exports.notifyOnComment = async (comment) => {
  // Implement similar logic for comments
};

// Add notification when someone tags a user
exports.notifyOnTag = async (question, taggedUserId) => {
  try {
    await exports.createNotification({
      recipient: taggedUserId,
      message: `You were tagged in a question.`
    });
  } catch (err) {}
};
