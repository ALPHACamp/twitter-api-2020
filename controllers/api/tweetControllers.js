const helpers = require('../../_helpers');
const db = require('../../models');
const { Tweet, User, Reply, Like } = db;

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [User, { model: Reply, include: [{ model: User, attributes: ['name', 'account', 'avatar'] }] }, Like],
      order: [['createdAt', 'DESC']],
    })
      .then((tweets) => {

        const data = tweets.map((r) => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          likeCount: r.dataValues.Likes.length,
          ReplyCount: r.dataValues.Replies.length,
          isLike: r.dataValues.Likes.some(d => d.UserId === helpers.getUser(req).id)
        }));
        return res.json(data);
      })
      .catch((error) => console.log(error));
  },

  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [{ model: User, attributes: { exclude: ['password'] } }, Reply, Like],
    })
      .then((tweet) => {
        if (!tweet) {
          return res.json({ status: 'error', message: "tweet didn't exist" });
        }
        tweet.dataValues.isLike = tweet.dataValues.Likes.some(d => d.UserId === helpers.getUser(req).id)
        return res.json(tweet);
      })
      .catch((error) => console.log(error));
  },

  postTweets: (req, res) => {
    if (req.body.description === '') {
      return res.json({ status: 'error', message: '內容不得為空白' });
    }
    if (req.body.description.length > 140) {
      return res.json({ status: 'error', message: '字數超過上限' });
    }
    Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description,
    });
    return res.json({ status: 'success', message: '成功推文!' });
  },
};

module.exports = tweetController;
