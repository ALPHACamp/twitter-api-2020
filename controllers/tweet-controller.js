const { User, Tweet, Reply, Like } = require('../models')
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
      offset
    })
      .then(tweets => {
        const likedTweetId = req.user?.LikedTweets ? req.user.LikedTweets.map(likeTweet => likeTweet.id) : []
        const resultTweets = tweets.rows.map(r => ({
          ...r.toJSON(),
          description: r.description.substring(0, DEFAULT_DESCRIPTION_LIMIT),
          isLiked: likedTweetId.includes(r.id),
          totalLikes: r.LikedUsers ? r.LikedUsers.length : 0
        }))
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            tweets: resultTweets,
            pagination: getPagination(limit, page, tweets.count)
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
  getreplies: (req, res, next) => {
    /*
    :param id: tweetId
    This api would return a json that including all replies of a specific tweet
    */
    const DEFAULT_DESCRIPTION_LIMIT = 140
    const tweetId = req.params.id
    return Reply.findAll({
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: User, as: 'LikedUsers', attributes: ['id', 'account', 'name', 'avatar'] }
      ],
      where: { tweetId },
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        const likedReplyId = req.user?.LikedTweets ? req.user.LikedReplies.map(likeReply => likeReply.id) : []
        const resultReplies = replies.map(r => ({
          ...r.toJSON(),
          comment: r.comment.substring(0, DEFAULT_DESCRIPTION_LIMIT),
          isLiked: likedReplyId.includes(r.id)
        }))
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            replies: resultReplies
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    /*
    :param id: tweetId
    :body comment: reply's content
    This api would create a reply of specific tweet and return a json
    */
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
  },
  likeTweet: (req, res, next) => {
    /*
    :param id: tweetId
    This api would create a like relation between user and tweet, and return a json
    */
    const userId = req.user.id
    const tweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have liked this tweet!')

        return Like.create({
          userId,
          tweetId
        })
      })
      .then((like) => {
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            like
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const userId = req.user.id
    const tweetId = req.params.id
    return Like.findOne({
      where: {
        userId,
        tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this tweet!")

        return like.destroy()
      })
      .then((like) => {
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            like
          },
          message: ''
        })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
