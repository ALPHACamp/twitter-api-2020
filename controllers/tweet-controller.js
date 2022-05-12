const { User, Tweet, Reply } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

// setting tweet-related controller
const tweetController = {
  getTweets: (req, res, next) => {
    /*
    :query page: specific slice of all tweets
    :query limit: limit return number of tweets
    This api would return a json that concluding tweets with specific page & limit, pagination information
    */
    const DEFAULT_LIMIT = 10
    const DEFAULT_DESCRIPTION_LIMIT = 140
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Tweet.findAndCountAll({
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: User, as: 'LikedUsers', attributes: ['id', 'account', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      nest: true,
      raw: true
    })
      .then(tweets => {
        const likedTweetId = req.user?.LikedTweets ? req.user.LikedTweets.map(likeTweet => likeTweet.id): []
        const resultTweets = tweets.rows.map(r => ({
          ...r,
          description: r.description.substring(0, DEFAULT_DESCRIPTION_LIMIT),
          isLiked: likedTweetId.includes(r.id),
          totalLikes: r.LikedUser? r.LikedUser.length(): 0
        }))
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            tweets: resultTweets,
            pagination: getPagination(limit, page, restaurants.count)
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    /*
    :param id: tweetId
    This api would return a json that concluding a specific tweet information
    */
    return Tweet.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: User, as: 'LikedUsers', attributes: ['id', 'account', 'name', 'avatar'] }
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        const isLiked = tweet.LikedUsers.some(l => l.id === req.user.id)
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            tweet: tweet.toJSON(),
            isLiked
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    /*
    :body description: tweet's content
    This api would create a tweet record and return a json
    */
    const description = req.body.description
    if (!description) throw new Error('Description is required!')
    return Tweet.create({
      userId: req.user.id,
      description
    })
      .then(tweet => {
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            tweet
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const userId = req.user.id
    const tweetId = req.params.id
    const comment = req.body.comment
    if (!comment) throw new Error('Comment is required!')
    return Promise.all([
      User.findByPk(userId),
      Tweet.findByPk(tweetId)
    ])
      .then(([user, tweet]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!tweet) throw new Error("Tweet didn't exist!")
        return Reply.create({
          userId,
          tweetId,
          comment
        })
      })
      .then((reply) => {
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            reply
          },
          message: ''
        })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
