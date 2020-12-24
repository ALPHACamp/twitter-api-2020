const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../../_helpers.js')

const { User, Tweet, Like, Reply, Sequelize, sequelize } = require('../../models')
const { Op } = Sequelize
const { tagIsFollowed, dateFieldsToTimestamp, repliesAndLikeCount,
  isLiked, uploadImgur, getSimpleUserIncluded } = require('../../modules/common.js')

const userBasicExcludeFields = ['password', 'createdAt', 'updatedAt', 'role']


const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password } = req.body

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
      const { email, password } = req.body
      const user = await User.findOne({ where: { email }, raw: true })

      if (user.role !== null || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({
          status: 'error',
          message: '帳號或密碼錯誤'
        })
      }

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

  getCurrentUser: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)

      delete user.password
      delete user.createdAt
      delete user.updatedAt

      return res.json(user)
    } catch {
      next(error)
    }
  },

  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      let user = await User.findOne({
        where: { id, role: null },
        attributes: {
          include: [
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followerId=${id})`), 'FollowingsCount'],
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followingId=${id})`), 'FollowersCount'],
            [sequelize.literal(`(SELECT Count(*) FROM Tweets AS t WHERE t.UserId=${id})`), 'tweetsCount'],
          ],
          exclude: userBasicExcludeFields
        }
      })
      user = tagIsFollowed(req, user.toJSON())
      return res.json(user)
    } catch (error) {
      next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        where: {
          id: { [Op.ne]: helpers.getUser(req).id },
          role: null
        },
        attributes: {
          include: [
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followingId=User.id)`), 'FollowersCount']
          ],
          exclude: [...userBasicExcludeFields, 'cover', 'introduction']
        },
        order: [[sequelize.literal('FollowersCount'), 'DESC']],
        offset: Number(req.query.startIndex) || 0,
        limit: Number(req.query.accumulatedNum) || 10
      })

      users = users.map(user => tagIsFollowed(req, user.toJSON()))

      return res.json(users)
    } catch (error) {
      next(error)
    }
  },

  getTweets: async (req, res, next) => {
    try {
      const UserId = req.params.id
      let tweets = await sequelize.query(`
        SELECT t.id, t.UserId, t.description,
          UNIX_TIMESTAMP(t.createdAt) * 1000 AS createdAt,
          COUNT(r.id) AS repliesCount, COUNT(l.id) AS likeCount,
          IF(l.UserId = ${helpers.getUser(req).id}, 1, 0) AS isLiked
        FROM Tweets as t
        LEFT JOIN Replies as r ON r.TweetId = t.id
        LEFT JOIN Likes as l ON l.TweetId = t.id
        WHERE t.UserId = ${UserId}
        GROUP BY t.id
        ORDER BY t.createdAt DESC;
      `, { type: sequelize.QueryTypes.SELECT })
      tweets = tweets.map(tweet => {
        tweet.isLiked = tweet.isLiked ? true : false
        return tweet
      })
      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  },

  getLikeTweets: async (req, res, next) => {
    try {
      const UserId = req.params.id
      let likeTweets = await Like.findAll({
        where: { UserId },
        attributes: [],
        include: [{
          model: Tweet,
          attributes: {
            include: [
              ...repliesAndLikeCount(),
              ...dateFieldsToTimestamp('Tweet'),
              isLiked(req)
            ],
            exclude: ['updatedAt']
          },
          include: getSimpleUserIncluded(),
        }],
        order: [[Tweet, 'createdAt', 'DESC']]
      })
      likeTweets = likeTweets.map(like => {
        like = { ...like.dataValues.Tweet.toJSON() }
        like.TweetId = like.id
        like.isLiked = like.isLiked ? true : false
        return like
      })
      return res.json(likeTweets)
    } catch (error) {
      next(error)
    }
  },

  getFollowers: async (req, res, next) => {
    try {
      const id = req.params.id
      let followers = await User.findByPk(id, {
        attributes: [],
        include: [{
          model: User,
          as: 'Followers',
          attributes: {
            include: [['id', 'followerId']],
            exclude: [...userBasicExcludeFields, 'cover']
          },
          through: { attributes: [] }
        }]
      })
      followers = followers.toJSON().Followers.map(follower => tagIsFollowed(req, follower))
      return res.json(followers)
    } catch (error) {
      next(error)
    }
  },

  getFollowings: async (req, res, next) => {
    try {
      const id = req.params.id
      let followings = await User.findByPk(id, {
        attributes: [],
        include: [{
          model: User,
          as: 'Followings',
          attributes: {
            include: [['id', 'followingId']],
            exclude: [...userBasicExcludeFields, 'cover']
          },
          through: { attributes: [] }
        }]
      })

      followings = followings.toJSON().Followings.map(following => tagIsFollowed(req, following))

      return res.json(followings)
    } catch (error) {
      next(error)
    }
  },

  getRepliedTweets: async (req, res, next) => {
    try {
      const UserId = req.params.id
      let replies = await Reply.findAll({
        where: { UserId },
        attributes: { include: dateFieldsToTimestamp('Reply'), exclude: ['updatedAt'] },
        include: [{
          model: Tweet,
          attributes: {
            include: [
              ...dateFieldsToTimestamp('Tweet'),
              ...repliesAndLikeCount(),
              isLiked(req)
            ],
            exclude: ['updatedAt']
          },
          include: getSimpleUserIncluded()
        }],
        order: [['createdAt', 'DESC'], [Tweet, 'createdAt', 'DESC']]
      })
      replies = replies.map(reply => {
        reply = { ...reply.toJSON() }
        reply.Tweet.isLiked = reply.Tweet.isLiked ? true : false
        return reply
      })
      return res.json(replies)
    } catch (error) {
      next(error)
    }
  },
  updateProfile: async (req, res, next) => {
    try {
      const urlId = Number(req.params.id)
      const id = helpers.getUser(req).id
      if (!urlId || urlId !== helpers.getUser(req).id) return res.status(401).json({ status: 'error', message: '未被授權' })
      const user = await User.findByPk(id)
      const { account, email, name, password, introduction } = req.body
      let avatar, cover;

      if (req.files) {
        [avatar, cover] = await Promise.all([uploadImgur(req.files.avatar), uploadImgur(req.files.cover)])
      }

      await user.update({
        account: account || user.dataValues.account,
        email: email || user.dataValues.email,
        name: name || user.dataValues.name,
        password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : user.dataValues.password,
        introduction: introduction || user.dataValues.introduction,
        avatar: avatar || null,
        cover: cover || null
      })

      return res.json({
        status: 'success',
        message: '修改成功'
      })
    } catch (error) {
      if (error.status === 'error') return res.status(400).json(error)
      next(error)
    }
  },
}

module.exports = userController
