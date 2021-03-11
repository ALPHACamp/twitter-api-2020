const helpers = require('../../_helpers');
const db = require('../../models');
const { Tweet, User, Reply, Like } = db;

const replyController = {
  postReplies: (req, res) => {
    if (req.body.comment === '') {
      return res.json({ status: 'error', message: '內容不得為空白' });
    }
    if (req.body.comment.length > 100) {
      return res.json({ status: 'error', message: '字數超過上限' });
    }
    Reply.create({
      comment: req.body.comment,
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
    })
      .then((reply) => {
        res.json({ status: 'success', message: '成功回覆推文!' });
      })
      .catch((error) => console.log(error));
  },

  getReplies: (req, res) => {
    Reply.findAll({
      include: [User],
      order: [['createdAt', 'DESC']],
      where: {
        TweetId: req.params.tweet_id,
      },
    })
      .then((replies) => {
        return res.json(replies);
      })
      .catch((error) => console.log(error));
  },
};

module.exports = replyController;
