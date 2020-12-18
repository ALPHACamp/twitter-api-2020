const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')

const { User, Tweet, Like, Reply, Followship, Sequelize, sequelize } = require('../../models')
const { Op } = Sequelize
const helpers = require('../../_helpers.js')
const { tagIsFollowed, dateFieldsToTimestamp, repliesAndLikeCount } = require('../../modules/controllerFunctions.js')
const userBasicExcludeFields = ['password', 'createdAt', 'updatedAt', 'role']
const userMoreExcludeFields = [...userBasicExcludeFields, 'cover', 'introduction']

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

      if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({
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
      if (!id) return res.status(400).json({ status: 'error', message: '查無此使用者編號' })
      let user = await User.findOne({
        where: { id, role: null },
        attributes: {
          include: [
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followerId=${id})`), 'FollowingsCount'],
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followingId=${id})`), 'FollowersCount']
          ],
          exclude: userBasicExcludeFields
        }
      })
      if (!user) return res.status(400).json({ status: 'error', message: '查無此使用者編號' })
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
          exclude: userMoreExcludeFields
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
      const UserId = Number(req.params.id)
      if (!UserId) return res.status(400).json({ status: 'error', message: '查無此使用者編號' })
      let tweets = await sequelize.query(`
        SELECT t.*,
          UNIX_TIMESTAMP(t.createdAt) * 1000 AS createdAt,
          UNIX_TIMESTAMP(t.updatedAt) * 1000 AS updatedAt,
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
      const UserId = Number(req.params.id)
      if (!UserId) return res.status(400).json({ status: 'error', message: '查無此使用者編號' })
      const user = await User.findByPk(UserId)
      if (!user) return res.status(400).json({ status: 'error', message: '查無此使用者編號' })
      let likeTweets = await Like.findAll({
        where: { UserId },
        attributes: [],
        include: [{
          model: Tweet,
          attributes: {
            include: [
              ...repliesAndLikeCount(),
              ...dateFieldsToTimestamp('Tweet'),
              [sequelize.literal(`EXISTS(SELECT * FROM LIKES AS l WHERE l.UserId = ${helpers.getUser(req).id} AND l.TweetId = Tweet.id)`), 'isLiked'],
            ]
          },
          include: {
            model: User, attributes: ['account', 'name', 'avatar', 'id']
          },
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
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ status: 'error', message: '查無此使用者編號' })
      let followers = await User.findByPk(id, {
        attributes: [],
        include: [{
          model: User,
          as: 'Followers',
          attributes: {
            include: [['id', 'followerId']],
            exclude: userMoreExcludeFields
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
      const id = Number(req.params.id)
      if (!id) return res.status(400).json({ status: 'error', message: '查無此使用者編號' })
      let followings = await User.findByPk(id, {
        attributes: [],
        include: [{
          model: User,
          as: 'Followings',
          attributes: {
            include: [['id', 'followingId']],
            exclude: userMoreExcludeFields
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
      const UserId = Number(req.params.id)
      if (!UserId) return res.status(400).json({ status: 'error', message: '查無此使用者編號' })
      let replies = await Reply.findAll({
        where: { UserId },
        attributes: { include: dateFieldsToTimestamp('Reply') },
        include: [{
          model: Tweet,
          attributes: {
            include: [
              ...dateFieldsToTimestamp('Tweet'),
              ...repliesAndLikeCount(),
              [sequelize.literal(`EXISTS(SELECT * FROM LIKES AS l WHERE l.UserId = ${helpers.getUser(req).id} AND l.TweetId = Tweet.id)`), 'isLiked']
            ]
          },
          include: {
            model: User, attributes: ['account', 'name', 'avatar', 'id']
          }
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
      if (!urlId || urlId !== helpers.getUser(req).id) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
      const user = await User.findByPk(id)
      const { account, email, name, password, introduction } = req.body
      const errorMessage = { status: 'error', message: '圖片上傳失敗' }
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)

      if (req.files) {
        let { avatar, cover } = req.files
        if (avatar && cover) {
          return imgur.upload(avatar[0].path, (err, avatar) => {
            if (err) return res.status(400).json(errorMessage)
            imgur.upload(cover[0].path, async (err, cover) => {
              if (err) return res.status(400).json(errorMessage)
              await user.update({
                name, introduction,
                avatar: avatar.data.link || null,
                cover: cover.data.link || null
              })
              return res.json({
                status: 'success',
                message: '修改成功'
              })

            })
          })

        } else if (avatar) {
          return imgur.upload(avatar[0].path, async (err, avatar) => {
            if (err) return res.status(400).json(errorMessage)
            await user.update({
              name, introduction,
              avatar: avatar.data.link || null
            })
            return res.json({
              status: 'success',
              message: '修改成功'
            })
          })
        } else if (cover) {
          return imgur.upload(cover[0].path, async (err, cover) => {
            if (err) return res.status(400).json(errorMessage)
            await user.update({
              name, introduction,
              cover: cover || null
            })
            return res.json({
              status: 'success',
              message: '修改成功'
            })
          })
        }
      }

      await user.update({
        account: account || user.dataValues.account,
        email: email || user.dataValues.email,
        name: name || user.dataValues.name,
        password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : user.dataValues.password,
        introduction: introduction || user.dataValues.introduction
      })
      return res.json({
        status: 'success',
        message: '修改成功'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController