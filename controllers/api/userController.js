const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { User, Tweet, Like, Reply, Sequelize, sequelize } = require('../../models')
const { Op } = Sequelize
const helpers = require('../../_helpers.js')
const { userDataTransform, dateFieldsToTimestamp } = require('../../modules/controllerFunctions.js')


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
        SELECT t.*, UNIX_TIMESTAMP(t.createdAt) AS createdAt,
          UNIX_TIMESTAMP(t.updatedAt) AS updatedAt,
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
      const likedTweets = await sequelize.query(`
          SELECT t.*, l.TweetId,
            COUNT(r.id) AS repliesCount, 
            (SELECT COUNT(*) FROM Likes AS l2 WHERE l2.TweetId = t.id) AS likesCount,
            UNIX_TIMESTAMP(t.createdAt) AS createdAt,
            UNIX_TIMESTAMP(t.updatedAt) AS updatedAt,  
            IF(l.UserId = ${UserId}, 1, 0) AS isLiked
          FROM Tweets as t  
          JOIN Likes as l ON l.TweetId = t.id       
          LEFT JOIN Replies as r ON r.TweetId = t.id
          WHERE l.UserId = ${UserId}     
          GROUP BY t.id
          ORDER BY t.createdAt DESC;
      `, { type: sequelize.QueryTypes.SELECT })
      return res.json(likedTweets)
    } catch (error) {
      next(error)
    }
  },

  getFollowers: async (req, res, next) => { },

  getFollowings: async (req, res, next) => { },

  getRepliedTweets: async (req, res, next) => { },

  updateProfile: async (req, res, next) => { },

}

module.exports = userController