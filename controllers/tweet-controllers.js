const helpers = require('../_helpers')
const { User, Tweet, Reply, Like } = require("../models");

const tweetController = {
  getReplies: (req, res, next) => {
    const { tweet_id } = req.params;
    return Tweet.findByPk(tweet_id, {
      include: [Reply],
    })
      .then((tweet) => {
        if (!tweet)
          return res.json({ status: "error", message: "Tweet didn't exist!" });
        return res.json(tweet.Replies);
      })
      .catch((err) => next(err));
  },

  addLike: async (req, res, next) => {
    const UserId = helpers.getUser(req).id;
    const TweetId = req.params.tweet_id

    try {
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.json({ status: "error", message: "Tweet didn't exist!"})

      const like = await Like.findOne({ where: { UserId, TweetId }})
      if (like) return res.json({ status: "error", message: "You have like this tweet!"})

      return Like.create({ UserId, TweetId })
      .then(() => res.json({ status: 'success'}))
    } catch(err) { next(err) }
  },

  removeLike: async (req, res, next) => {
    const UserId = helpers.getUser(req).id;
    const TweetId = req.params.tweet_id

    try {
      const like = await Like.findOne({ where: { UserId, TweetId }})
      if (!like) return res.json({ status: "error", message: "You haven't like this tweet!"})

      return like.destroy()
      .then(() => res.json({ status: 'success'}))
    } catch(err) { next(err) }
  }
};

module.exports = tweetController;
