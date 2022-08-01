const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const theSignInUserId = helpers.getUser(req)?.id || null
      const description = req.body?.description || null || ''

      if (!theSignInUserId) throw new Error(`Server side can't get user id.`)
      if (!description) throw new Error(`Server side can't get the tweet description.`)

      if (description.trim().length > 0 && description.length <= 140) {
        await Tweet.create({ userId: theSignInUserId, description })
      } else {
        throw new Error(`The characters in a tweet should between 0 and 140.`)
      }

      res.json({
        status: 'success',
      })
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
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

    if (!tweets) throw new Error(`Not any tweet has been post!`)

    const TweetsApiData = tweets.map((tweet) => {
      const { Likes, Replies, ...restProps } = tweet.toJSON()
      return { ...restProps, likesCounts: Likes.length, repliesCounts: Replies.length }
    })

    res.status(200).json(TweetsApiData)
    try {
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      if (!tweet_id) throw new Error(`Params /:tweet_id is required!`)

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

      if (!tweet) throw new Error(`This tweet doesn't exist!`)

      const { Replies, Likes, UserId, ...restProps } = tweet.toJSON()
      const TweetApiData = { ...restProps, likesCounts: Likes.length, repliesCounts: Replies.length }

      res.status(200).json(TweetApiData)
    } catch (error) {
      next(error)
    }
  },
}

module.exports = tweetController
