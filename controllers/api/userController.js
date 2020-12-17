const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { User, Tweet, Like, Reply, Followship, Sequelize, sequelize } = require('../../models')
const { Op } = Sequelize
const helpers = require('../../_helpers.js')
const { userDataTransform, dateFieldsToTimestamp } = require('../../modules/controllerFunctions.js')
const followship = require('../../models/followship')


const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      // create new user
      await User.create({
        account, name, email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
      return res.json({
        status: 'success',
        message: '成功註冊'
      })
    } catch (error) {
      next(error)
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      const user = await User.findOne({ where: { account }, raw: true })

      if (!bcrypt.compareSync(password, user.password)) return res.json({
        status: 'error',
        message: '帳號或密碼錯誤'
      })

      return res.json({
        status: 'success',
        message: '成功登入',
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })

    } catch (error) {
      next(error)
    }
  },

  getUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (!id) return res.json({ status: 'error', message: '查無此使用者編號' })
      let user = await User.findByPk(id, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followerId=${id})`), 'FollowingsCount'],
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followingId=${id})`), 'FollowersCount']
          ]
        }
      })
      if (!user) return res.json({ status: 'error', message: '查無此使用者編號' })
      user = userDataTransform(req, user.dataValues)
      return res.json({ status: 'success', ...user })
    } catch (error) {
      next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        where: {
          id: { [Op.ne]: helpers.getUser(req).id },
          role: { [Op.eq]: null }
        },
        attributes: {
          include: [
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followingId=User.id)`), 'FollowersCount']
          ]
        },
        order: [[sequelize.literal('FollowersCount'), 'DESC']],
        offset: Number(req.query.startIndex) || 0,
        limit: Number(req.query.accumulatedNum) || 10
      })

      users = users.map(user => userDataTransform(req, user.dataValues))

      return res.json({ status: 'success', users })
    } catch (error) {
      next(error)
    }
  },

  getTweets: async (req, res, next) => {
    try {
      const UserId = Number(req.params.id)
      if (!UserId) return res.json({ status: 'error', message: '查無此使用者編號' })
      const tweets = await sequelize.query(`
        SELECT t.*,
          UNIX_TIMESTAMP(t.createdAt) * 1000 AS createdAt,
          UNIX_TIMESTAMP(t.updatedAt) * 1000 AS updatedAt,
          COUNT(r.id) AS repliesCount, COUNT(l.id) AS likeCount,
          IF(l.UserId = ${UserId}, 1, 0) AS isLiked
        FROM Tweets as t
        LEFT JOIN Replies as r ON r.TweetId = t.id
        LEFT JOIN Likes as l ON l.TweetId = t.id
        WHERE t.UserId = ${UserId}
        GROUP BY t.id
        ORDER BY t.createdAt DESC;
      `, { type: sequelize.QueryTypes.SELECT })
      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  },

  getLikeTweets: async (req, res, next) => {
    try {
      const UserId = Number(req.params.id)
      if (!UserId) return res.json({ status: 'error', message: '查無此使用者編號' })
      let likeTweets = await Like.findAll({
        where: { UserId },
        attributes: [],
        include: [{
          model: Tweet,
          attributes: {
            include: [
              [sequelize.literal(`(SELECT COUNT(*) FROM Likes AS l WHERE l.TweetId=Tweet.id)`), 'likesCount'],
              [sequelize.literal(`(SELECT COUNT(*) FROM Replies AS r WHERE r.TweetId=Tweet.id)`), 'repliesCount'],
              [sequelize.literal('1'), 'isLiked'],
              [sequelize.literal(`UNIX_TIMESTAMP(Tweet.createdAt) * 1000`), 'createdAt'],
              [sequelize.literal(`UNIX_TIMESTAMP(Tweet.updatedAt) * 1000`), 'updatedAt'],
            ]
          },
          include: {
            model: User, attributes: ['account', 'name', 'avatar', 'id']
          }
        }]
      })
      likeTweets = likeTweets.map(like => ({
        ...like.dataValues.Tweet.toJSON(),
        TweetId: like.dataValues.Tweet.id
      }))
      return res.json(likeTweets)
    } catch (error) {
      next(error)
    }
  },

  getFollowers: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (!id) return res.json({ status: 'error', message: '查無此使用者編號' })
      let followers = await User.findByPk(id, {
        attributes: [],
        include: [{
          model: User,
          as: 'Followers',
          attributes: {
            include: [
              ['id', 'followerId'],
              [sequelize.literal(`UNIX_TIMESTAMP(User.createdAt) * 1000`), 'createdAt'],
              [sequelize.literal(`UNIX_TIMESTAMP(User.updatedAt) * 1000`), 'updatedAt'],
            ],
            exclude: ['password', 'createdAt', 'updatedAt', 'role', 'Followship']
          },
          through: { attributes: [] }
        }]
      })

      return res.json(followers.toJSON().Followers)
    } catch (error) {
      next(error)
    }
  },

  getFollowings: async (req, res, next) => { },

  getRepliedTweets: async (req, res, next) => {
    try {
      const UserId = Number(req.params.id)
      if (!UserId) return res.json({ status: 'error', message: '查無此使用者編號' })
      let replies = await Reply.findAll({
        where: { UserId },
        attributes: {
          include: [
            [sequelize.literal(`UNIX_TIMESTAMP(Reply.createdAt) * 1000`), 'createdAt'],
            [sequelize.literal(`UNIX_TIMESTAMP(Reply.updatedAt) * 1000`), 'updatedAt'],
          ]
        },
        include: [{
          model: Tweet,
          attributes: {
            include: [
              [sequelize.literal(`(SELECT COUNT(*) FROM Likes AS l WHERE l.TweetId=Tweet.id)`), 'likesCount'],
              [sequelize.literal(`(SELECT COUNT(*) FROM Replies AS r WHERE r.TweetId=Tweet.id)`), 'repliesCount'],
              [sequelize.literal(`EXISTS(SELECT * FROM LIKES AS l WHERE l.UserId=${UserId} AND l.TweetId=Tweet.id)`), 'isLiked'],
              [sequelize.literal(`UNIX_TIMESTAMP(Tweet.createdAt) * 1000`), 'createdAt'],
              [sequelize.literal(`UNIX_TIMESTAMP(Tweet.updatedAt) * 1000`), 'updatedAt'],
            ]
          },
          include: {
            model: User, attributes: ['account', 'name', 'avatar', 'id']
          }
        }]
      })
      replies = replies.map(reply => ({ ...reply.toJSON() }))
      return res.json(replies)
    } catch (error) {
      next(error)
    }
  },

  updateProfile: async (req, res, next) => { },

}

module.exports = userController