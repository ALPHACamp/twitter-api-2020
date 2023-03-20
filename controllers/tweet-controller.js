const { Tweet, User } = require('../models');

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
      next(err);
    }
  },
  addNewTweet: async (req, res, next) => {
    try {
      const { UserId, description } = req.body;
      if (!UserId) throw new Error('UserId is required!');
      const newTweet = await Tweet.create({
        UserId,
        description,
      });
      return res.status(200).json(newTweet);
    } catch (err) {
      next(err);
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
      next(err);
    }
  },
};

module.exports = tweetController;
