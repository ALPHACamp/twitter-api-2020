const tweetServices = require('../services/tweet-services')
const { Tweet,Like } = require('../models')
//const { getUser } = require('../_helpers')
const tweetController = {
    getTweets: async(req, res, next) => {
      tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
    },
    getTweet: async(req, res, next) => {
      tweetServices.getTweet(req, (err, data) => err ? next(err) : res.json(data))
    },
    postTweets: async (req, res, next) => {
      try {
        const { description } = req.body;
        const UserId = req.user.id;

        if (!description) {
          throw new Error('Tweet不能為空!');
        }

        if (description.length > 140) {
          throw new Error('輸入不得超過140字!');
        }

        const tweet = await Tweet.create({
          description,
          UserId
        });

        res.status(200).json(tweet);
      } catch (err) {
            next(err)
      }
    },
    addLike: (req, res, next) => {
    const TweetId = req.params
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have liked this tweet!')

        return Like.create({
          UserId: req.user.id,
          TweetId
        })
      })
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        tweetId: req.params.TweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this tweet")

        return like.destroy()
      })
      .catch(err => next(err))
  },

}
module.exports = tweetController