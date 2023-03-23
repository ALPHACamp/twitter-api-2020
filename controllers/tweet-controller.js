const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  // feature: user can post a tweet
  // route: POST /api/tweets
  postTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req)?.id
      const description = req.body?.description

      if (!description || (description.trim().length === 0)) throw new Error('Target tweet description is required.')

      if (description.trim().length > 0 && description.length <= 140) {
        await Tweet.create({ UserId: currentUserId, description })
      } else {
        throw new Error('Characters length of description should be less than 140.')
      }

      res.json({
        status: 'success',
      })
    } catch (error) {
      next(error)
    }
  },
  // feature: user can see all tweets
  // route: GET /api/tweets
  getTweets: async (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id
    const tweets = await Tweet.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password', 'email', 'introduction', 'banner', 'role', 'createdAt', 'updatedAt'] },
          raw: true,
        },
        { model: Like, raw: true },
        { model: Reply, raw: true },
      ],
      order: [['createdAt', 'DESC']],
      nest: true,
    })

    if (!tweets) throw new Error('Not any tweet has been post.')

    const TweetsApiData = tweets.map((tweet) => {
      const { Likes, Replies, UserId, userId, User: user, updatedAt, ...restProps } = tweet.toJSON()
      const isLiked = Likes.some(Like => Like.UserId === currentUserId)
      return { ...restProps, user, isLiked, likeCounts: Likes.length, replyCounts: Replies.length }
    })

    res.json(TweetsApiData)
    try {
    } catch (error) {
      next(error)
    }
  },
  // feature: user can see the specific tweet
  // route: GET /api/tweets/:tweet_id
  getTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req)?.id
      const { tweet_id } = req.params

      if (!Number(tweet_id)) throw new Error(`Params tweet_id is required.`)

      const tweet = await Tweet.findOne({
        where: { id: tweet_id },
        include: [
          {
            model: User,
            attributes: { exclude: ['password', 'email', 'introduction', 'banner', 'role', 'createdAt', 'updatedAt'] },
            raw: true,
          },
          { model: Reply, raw: true },
          { model: Like, raw: true },
        ],
        nest: true,
      })

      if (!tweet) throw new Error(`Target tweet not exist.`)

      const { Replies, Likes, UserId, userId, User: user, updatedAt, ...restProps } = tweet.toJSON()
      const isLiked = Likes.some(Like => Like.UserId === currentUserId)
      const TweetApiData = { ...restProps, user, isLiked, likeCounts: Likes.length, replyCounts: Replies.length }

      res.json(TweetApiData)
    } catch (error) {
      next(error)
    }
  },
}

module.exports = tweetController
