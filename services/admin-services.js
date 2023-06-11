const bcrypt = require('bcrypt-nodejs')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const { Tweet, User, Like, Reply } = require('../models')

const adminServices = {
  signIn: async (req, cb) => {
    try {
      const { account, password } = req.body
      if (!account || !password) throw new Error('請輸入帳號和密碼！')

      const admin = await User.findOne({
        where: { account }
      })
      if (!admin) throw new Error('帳號不存在！')
      if (admin.role === 'user') throw new Error('帳號不存在！')
      if (!bcrypt.compareSync(password, admin.password)) throw new Error('帳密錯誤！')
      const payload = { id: admin.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
      const adminData = admin.toJSON()
      delete adminData.password
      return cb (null, {
        status: 'success',
        message: '登入成功！',
        token,
        admin: adminData
      })
    } catch (err) {
      cb (err)
    }
  },
  getUsers: async (req, cb) => {
    try {
      const getLikesCount = async (userId) => {
      const likesCount = await Tweet.findAll({
        include: {
          model: Like,
          attributes: [],
          where: {
            UserId: userId
          }
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('Likes.id')), 'likesCount']],
        group: ['Tweet.id']
      })

      return likesCount
    }

      const getUsersData = async () => {
      const users = await User.findAll({
        attributes: [
          'id',
          'account',
          'name',
          'avatar',
          'banner',
          [sequelize.fn('COUNT', sequelize.col('Followers.id')), 'followersCount'],
          [sequelize.fn('COUNT', sequelize.col('Followings.id')), 'followingsCount']
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
          },
          {
            model: Tweet,
            attributes: []
          }
        ],
        group: ['User.id'],
        raw: true,
        nest: true
      })

      const likesCountPromises = users.map(async (user) => {
        if (user.id) {
          const likesCount = await getLikesCount(user.id)
          user.likesCount = likesCount.length > 0 ? likesCount[0].dataValues.likesCount : 0
        }
        return user
      })

      const usersWithLikesCount = await Promise.all(likesCountPromises)

      const tweetsCountPromises = usersWithLikesCount.map(async (user) => {
        const tweetData = await Tweet.count({ where: { UserId: user.id } })
        user.tweetsCount = tweetData
        return user
      })

      const usersWithCounts = await Promise.all(tweetsCountPromises)
      return usersWithCounts
    }

      const usersWithCounts = await getUsersData()
    cb (null, usersWithCounts)
    } catch (err) {
    cb (err)
    }
  },
  delTweet: async(req, cb) => {
    const { id } = req.params
    try{
      const tweet = await Tweet.findByPk(id)
      if (!tweet) throw new Error("推文不存在！")
      await tweet.destroy()
      await Reply.destroy({ where: { TweetId: id } })
      await Like.destroy({ where: { TweetId: id } })
      return cb(null,{ status: 'success', message: '刪除成功' })
    } catch (err) {
    cb (err)
    }
  }
}

module.exports = adminServices