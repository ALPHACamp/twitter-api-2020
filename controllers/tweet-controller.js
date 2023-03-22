const { Tweet, User, Reply } = require('../models');
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
};

module.exports = tweetController;
