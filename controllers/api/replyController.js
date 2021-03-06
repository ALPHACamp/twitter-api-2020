const helpers = require('../../_helpers');
const db = require('../../models');
const { Tweet, User, Reply, Like } = db;

const replyController = {
  postReplies: (req, res) => {
    if (req.body.comment === '') {
      return res.json({ status: 'error', message: '內容不得為空白' });
    }
    if (req.body.comment.length > 140) {
      return res.json({ status: 'error', message: '字數超過上限' });
    }
    Reply.create({
      comment: req.body.comment,
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
    }).then((reply) => {
      res.json({ status: 'success', message: '成功回覆推文!' });
    });
  },

  getReplies: (req, res) => {
    Reply.findAll({
      include: [User],
      order: [['createdAt', 'DESC']],
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id,
      },
    })
      .then((replies) => {
        // const data = tweets.map((r) => ({
        //   ...r.dataValues,
        //   description: r.dataValues.description.substring(0, 50),
        // }));
        return res.json(replies);
      })
      .catch((error) => console.log(error));
  },
};

module.exports = replyController;
