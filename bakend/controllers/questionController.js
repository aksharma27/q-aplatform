const Question = require('../model/question');
const Answer = require('../model/answer');
const User = require('../model/user');
const notificationController = require('./notificationController');

exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    // Basic validation
    if (!title || !description || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: 'Title, description, and at least one tag are required' });
    }

    const question = await Question.create({
      title,
      description,
      tags,
      author: req.user.id
    });

    // Notify tagged users
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        const user = await User.findOne({ username: tag });
        if (user) {
          await notificationController.notifyOnTag(question, user._id);
        }
      }
    }
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to post question', error: err.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'username')
      .populate('acceptedAnswer')
      .sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch questions', error: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate({ path: 'answers', model: 'Answer' });
    if (!question) return res.status(404).json({ msg: 'Question not found' });
    res.json(question);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch question', error: err.message });
  }
};

exports.voteQuestion = async (req, res) => {
  const { type } = req.body; // type: 'up' or 'down'
  const userId = req.user.id;
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: 'Question not found' });

    // Remove from both arrays first
    question.votes.up.pull(userId);
    question.votes.down.pull(userId);
    if (type === 'up') question.votes.up.push(userId);
    if (type === 'down') question.votes.down.push(userId);

    await question.save();
    res.status(200).json({ msg: 'Vote updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Voting failed', error: err.message });
  }
};

exports.acceptAnswer = async (req, res) => {
  try {
    const { id: questionId, answerId } = req.params;
    const userId = req.user.id;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ msg: 'Question not found' });
    if (question.author.toString() !== userId.toString()) return res.status(403).json({ msg: 'Not authorized' });
    if (!question.answers.includes(answerId)) return res.status(400).json({ msg: 'Answer not found for this question' });
    question.acceptedAnswer = answerId;
    await question.save();
    res.status(200).json({ msg: 'Answer accepted', acceptedAnswer: answerId });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to accept answer', error: err.message });
  }
};
