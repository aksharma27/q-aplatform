const Notification = require('../model/notification');

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
