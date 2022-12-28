const { Tweet, Like, Reply, User, sequelize } = require('../models')
// const { getOffset, getPagination } = require('../helpers/pagination-helper')
const helpers = require('../_helpers')

const tweetServices = {
  getTweets: (req, cb) => {
    // 分頁
    // const DEFAULT_LIMIT = 9
    // const DEFAULT_PAGE = 1
    // const page = Number(req.query.page) || DEFAULT_PAGE
    // const limit = Number(req.query.limit) || DEFAULT_LIMIT
    // const offset = getOffset(limit, page)
    const userId = helpers.getUser(req).id

    return Tweet.findAndCountAll({
      attributes: ['id', 'description', 'createdAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'totalReplies'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'totalLikes'],
        [sequelize.literal(`(EXISTS(SELECT * FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${userId}))`), 'isLiked']
      ],
      include: [{
        model: User,
        attributes: ['id', 'name', 'account', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(tweets => {
        cb(null, { tweets: tweets.rows })
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const id = req.params.tweet_id
    return Tweet.findByPk(id, {
      include: [
        { model: Reply, include: User },
        { model: Like, include: User }
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet doesn't exist!")
        const repliesOfTweet = tweet.Replies
        const likesOfTweet = tweet.Likes
        const isReplied = repliesOfTweet ? repliesOfTweet.some(f => f.UserId === helpers.getUser(req).id) : []
        const isLiked = likesOfTweet ? likesOfTweet.some(f => f.UserId === helpers.getUser(req).id) : []
        const data = {
          ...tweet.toJSON(),
          totalReplies: repliesOfTweet.length,
          totalLikes: likesOfTweet.length,
          isReplied,
          isLiked
        }
        cb(null, data)
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) throw new Error('Description is required!')

    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return Tweet.create({
          description,
          UserId
        })
      })
      .then(postedTweet => cb(null, { postedTweet }))
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
