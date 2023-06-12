const { User, Tweet, Reply, Sequelize } = require('../models')
const { getLastUpdated } = require('../_helpers')
const adminController = {
  getUsers: (req, res, next) => {
    User.findAll({
      raw: true,
      nest: true,
      attributes: [
        'account',
        'name',
        'avatar',
        'coverPhoto',
        [Sequelize.fn('COUNT', Sequelize.col('Followers.id')), 'followersCount'],
        [Sequelize.fn('COUNT', Sequelize.col('Followings.id')), 'followingsCount']
      ],
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'Followings',
          attributes: [],
          through: { attributes: [] }
        }
      ],
      group: ['User.id']
    })
      .then((users) => {
        return res
          .status(200)
          .json(users)
      })
      .catch((error) => next(error))
  },
  deleteUser: (req, res, next) => {
    const userId = req.params.id
    User.findByPk(userId).then((user) => {
      user.destroy().then(() => {
        res.json({
          status: 'success',
          message: `admin success delete user ${userId}`
        })
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
        })
        return res.json({ status: 'success', data: tweets })
      })
      .catch(error => next(error))
  },
  deleteTweet: (req, res, next) => {
    const tweetId = req.params.id
    Tweet.findByPk(tweetId).then((tweet) => {
      tweet.destroy().then(() => {
        res.json({
          status: 'success',
          message: `admin success delete tweet ${tweetId}`
        })
      })
        .catch(error => next(error))
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
          // 取得現在的時間
          // 取得現在的時間 - 更新時間
          getLastUpdated(reply)
        })
        return res.json({ status: 'success', data: replies })
      })
      .catch(error => next(error))
  },
  deleteReply: (req, res, next) => {
    const replyId = req.params.id
    Reply.findByPk(replyId).then((reply) => {
      reply.destroy().then(() => {
        res.json({
          status: 'success',
          message: `admin success delete reply ${replyId}`
        })
      })
        .catch(error => next(error))
    })
      .catch(error => next(error))
  }
}

module.exports = adminController
