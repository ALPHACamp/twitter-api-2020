const { Tweet, User, Reply, Like } = require('../models');
const helpers = require('../_helpers');

const tweetController = {
  getAllTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
        order: [['updatedAt', 'DESC']],
      });
      return res.status(200).json(tweets);
    } catch (err) {
      return next(err);
    }
  },
  addNewTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id;
      const { description } = req.body;
      if (!UserId) throw new Error('UserId is required!');
      const newTweet = await Tweet.create({
        UserId,
        description,
      });
      return res.status(200).json(newTweet);
    } catch (err) {
      return next(err);
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.tweetId;
      const tweet = await Tweet.findOne({
        where: { id: TweetId },
        raw: true,
        nest: true,
        include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
      });
      return res.status(200).json(tweet);
    } catch (err) {
      return next(err);
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.tweetId;
      const replies = await Reply.findAll({
        where: { TweetId },
        raw: true,
        nest: true,
        include: [{ model: User, attributes: ['account', 'name'] }],
        order: [['updatedAt', 'DESC']],
      });
      return res.status(200).json(replies);
    } catch (err) {
      return next(err);
    }
  },
  postReply: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id;
      const TweetId = req.params.tweetId;
      const { comment } = req.body;
      if (!UserId || !TweetId)
        throw new Error('User id or Tweet id is required!');
      const newReply = await Reply.create({
        UserId,
        TweetId,
        comment,
      });
      return res.status(200).json(newReply);
    } catch (err) {
      return next(err);
    }
  },
  addLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id;
      const TweetId = req.params.tweetId;
      if (!UserId || !TweetId)
        throw new Error('User id or Tweet id is required!');

      // check tweet exists or not
      const tweet = await Tweet.findByPk(TweetId);
      if (!tweet)
        return res.status(404).json({ message: 'Tweet id not found' });

      const [info, created] = await Like.findOrCreate({
        where: { UserId, TweetId },
      });
      if (!created) throw new Error('已經喜歡過此篇推文');
      return res.status(200).json({ message: '新增成功！' });
    } catch (err) {
      return next(err);
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id;
      const TweetId = req.params.tweetId;
      if (!UserId || !TweetId)
        throw new Error('User id or Tweet id is required!');

      const tweet = await Tweet.findByPk(TweetId);
      if (!tweet)
        return res.status(404).json({ message: 'Tweet id not found' });

      const unlike = await Like.destroy({
        where: { UserId, TweetId },
      });

      if (!unlike) throw new Error('已取消過讚在這篇推文');

      return res.status(200).json({ message: '刪除成功' });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = tweetController;
