const User = require('../model/user')
const Question = require('../model/Question');
const Notification = require('../model/Notification');
const { Parser } = require('json2csv');

exports.banUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, { banned: true });
  res.status(200).json({ msg: 'User banned' });
};

exports.unbanUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, { banned: false });
  res.status(200).json({ msg: 'User unbanned' });
};

exports.rejectQuestion = async (req, res) => {
  await Question.findByIdAndDelete(req.params.questionId);
  res.status(200).json({ msg: 'Question rejected and deleted' });
};

exports.sendGlobalMessage = async (req, res) => {
  const { message } = req.body;
  const users = await User.find({});
  const notifs = users.map(user => ({
    recipient: user._id,
    message,
    type: 'mention',
    link: '/'
  }));
  await Notification.insertMany(notifs);
  res.status(200).json({ msg: 'Global message sent to all users' });
};

exports.downloadUserReport = async (req, res) => {
  const users = await User.find({}, 'username email role banned createdAt');
  const parser = new Parser();
  const csv = parser.parse(users);
  res.header('Content-Type', 'text/csv');
  res.attachment('user-report.csv');
  res.send(csv);
};
