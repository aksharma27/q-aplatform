const Answer = require('../model/Answer');
const Question = require('../model/Question');
const Notification = require('../model/Notification');

exports.addAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ msg: 'Question not found' });

    const answer = await Answer.create({
      content,
      author: req.user.id,
      question: req.params.questionId
    });

    // Notify question author
    if (question.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: question.author,
        message: `@${req.user.id} answered your question.`,
        type: 'answer',
        link: `/questions/${question._id}`
      });
    }

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to post answer', error: err.message });
  }
};

exports.voteAnswer = async (req, res) => {
  const { type } = req.body; // type: 'up' or 'down'
  const userId = req.user.id;
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ msg: 'Answer not found' });

    answer.votes.up.pull(userId);
    answer.votes.down.pull(userId);
    if (type === 'up') answer.votes.up.push(userId);
    if (type === 'down') answer.votes.down.push(userId);

    await answer.save();
    res.status(200).json({ msg: 'Vote updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Voting failed', error: err.message });
  }
};
