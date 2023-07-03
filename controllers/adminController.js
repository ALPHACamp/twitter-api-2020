const { User, Tweet, Reply, Like } = require('../models')
const { getLastUpdated } = require('../_helpers')
const adminController = {
  getUsers: (req, res, next) => {
    User.findAll({
      attributes: [
        'id',
        'account',
        'name',
        'avatar',
        'coverPhoto'
      ],
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: ['account'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'Followings',
          attributes: ['account'],
          through: { attributes: [] }
        },
        {
          model: Tweet,
          attributes: ['id'],
          include: [{ model: Like, attributes: ['UserId'] }]
        }
      ]
    })
      .then((users) => {
        const data = users.map((user) => ({
          ...user.toJSON(),
          followersCount: user.Followers?.length,
          followingsCount: user.Followings?.length,
          tweetsCount: user.Tweets?.length
        }))
        data.forEach((user) => {
          user.likesCount = 0
          user.Tweets.forEach(tweet => {
            user.likesCount += tweet.Likes.length
          })
          delete user.Followers
          delete user.Followings
          delete user.Tweets
        })
        data.forEach((user, index) => {
          if (user.account === 'root') data.splice(index, 1)
        })
        data
          .sort((a, b) => b.likesCount - a.likesCount)
          .sort((a, b) => b.tweetsCount - a.tweetsCount)

        return res
          .status(200)
          .json(data)
      })
      .catch((error) => next(error))
  },
  deleteUser: (req, res, next) => {
    const userId = req.params.id
    User.findByPk(userId).then((user) => {
      user.destroy().then(() => {
        return res
          .status(200)
          .json('Delete success')
      })
        .catch(error => next(error))
    })
      .catch(error => next(error))
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [
        { model: User, attributes: ['account', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets.forEach(tweet => {
          // 只顯示前50個字
          if (tweet.description.length > 50) tweet.description = tweet.description.substring(0, 50) + '...'
          // 取得現在的時間 - 更新時間
          getLastUpdated(tweet)
          tweet.account = tweet.User?.account
          tweet.name = tweet.User?.name
          tweet.avatar = tweet.User?.avatar
          delete tweet.User
        })
        return res.status(200).json(tweets)
      })
      .catch(error => next(error))
  },
  deleteTweet: (req, res, next) => {
    const tweetId = req.params.id
    Tweet.findByPk(tweetId)
      .then((tweet) => {
        if (!tweet) return res.status(404).json('Tweet not found')
        return Promise.all([
          tweet.destroy(),
          Like.destroy({ where: { TweetId: tweetId } }),
          Reply.destroy({ where: { TweetId: tweetId } })
        ])
      })
      .then(() => {
        return res.status(200).json('Delete success')
      })
      .catch(error => next(error))
  },
  getReplies: (req, res, next) => {
    Reply.findAll({
      raw: true,
      nest: true,
      include: [{ model: User, attributes: ['account', 'name', 'avatar'] }]
    })
      .then(replies => {
        replies.forEach((reply) => {
          // 只顯示前50個字
          if (reply.comment.length > 50) reply.comment = reply.comment.substring(0, 50) + '...'
          getLastUpdated(reply)
          reply.account = reply.User?.account
          reply.name = reply.User?.name
          reply.avatar = reply.User?.avatar
          delete reply.User
        })
        return res.status(200).json(replies)
      })
      .catch(error => next(error))
  },
  deleteReply: (req, res, next) => {
    const replyId = req.params.id
    Reply.findByPk(replyId).then((reply) => {
      reply.destroy().then(() => {
        return res.status(200).json('Delete success')
      })
        .catch(error => next(error))
    })
      .catch(error => next(error))
  }
}

module.exports = adminController
