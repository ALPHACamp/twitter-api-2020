const { Tweet, Like, Reply, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const helpers = require('../_helpers')

const tweetServices = {
  getTweets: (req, cb) => {
    // 預設可以再改
    const DEFAULT_LIMIT = 9
    const DEFAULT_PAGE = 1
    const page = Number(req.query.page) || DEFAULT_PAGE
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Tweet.findAndCountAll({
      include: [{
        model: User,
        attributes: { exclude: ['password'] }
      }, {
        model: Like,
        attributes: [[Like.sequelize.fn('COUNT', Like.sequelize.fn('DISTINCT', Like.sequelize.col('likes.id'))), 'totalLikes']]
      }, {
        model: Reply,
        attributes: [[Reply.sequelize.fn('COUNT', Reply.sequelize.fn('DISTINCT', Reply.sequelize.col('replies.id'))), 'totalReplies']]
      }],
      group: 'tweet.id',
      offset,
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(tweets => {
        const repliedTweetId = helpers.getUser(req)?.Replies ? helpers.getUser(req).Replies.map(rt => rt.TweetId) : []
        const likedTweetId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(lt => lt.TweetId) : []
        const data = tweets.rows.map(t => ({
          ...t,
          isReplied: repliedTweetId.includes(t.id),
          isLiked: likedTweetId.includes(t.id)
        }))
        return cb(null,
          data,
          { pagination: getPagination(limit, page, tweets.count) }
        )
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