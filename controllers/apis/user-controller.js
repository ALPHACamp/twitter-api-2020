const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../../models')
const { getUser } = require('../../_helpers')

const { User, Tweet, Reply, Followship } = db
const { Op } = require('sequelize')
const sequelize = require('sequelize')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      if (!account || !name || !email || !password || !checkPassword) throw new Error('all the blanks are required')

      // 檢查帳號是否重複
      const user = await User.findOne(
        {
          where: {
            [Op.or]: [
              { email },
              { account }
            ]
          }
        }
      )

      if (user) {
        if (user.account === account) throw new Error('account 已重複註冊！')
        if (user.email === email) throw new Error('email 已重複註冊！')
      }

      const createdUser = await User.create({
        name,
        email,
        account,
        password: bcrypt.hashSync(password, 10),
        avatar: 'https://picsum.photos/100/100',
        cover: 'https://picsum.photos/id/237/700/400',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      res.status(200).json({
        status: 'success',
        message: 'Successfully create user.',
        data: createdUser
      })
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) throw new Error('Please enter account and password')

      const user = await User.findOne({ where: { account } })
      if (!user) throw new Error('User does not exist')
      if (user.role === 'admin') throw new Error('admin permission denied')
      if (!bcrypt.compareSync(password, user.password)) throw new Error('Incorrect password')
      const payload = {
        id: user.id,
        account: user.account,
        role: user.role
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
      const userData = user.toJSON()

      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const currentUserId = getUser(req).dataValues.id
      console.log(currentUserId)

      const [user, tweetCount, followerCount, followingCount] = await Promise.all([
        User.findByPk(id, { raw: true, nest: true }),
        Tweet.count({
          where: { UserId: id }
        }),
        Followship.count({
          where: { followerId: id }
        }),
        Followship.count({
          where: { followingId: id }
        })
      ])

      if (!user) res.status(401).json({ status: 'error', message: 'This user does not exist' })

      delete user.password
      user.tweetCount = tweetCount
      user.followerCount = followerCount
      user.followingCount = followingCount

      if (Number(id) !== currentUserId) {
        const checkUserFollowing = await Followship.findAll({
          where: { followerId: currentUserId },
          raw: true
        })
        user.isFollowed = checkUserFollowing.some(follow => follow.followingId === Number(id))
      }

      if (Number(id) === currentUserId) res.status(400).json({ status: 'error', message: '使用者無法追蹤自己！' })

      // console.log(user)

      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const userId = req.params.id

      const [user, replies] = await Promise.all([
        User.findByPk(userId, { raw: true, nest: true }),
        Reply.findAll({
          where: { UserId: userId },
          include: [
            { model: User, as: 'userreply', attributes: { exclude: ['password'] } },
            {
              model: Tweet,
              as: 'usertweets',
              include: [{ model: User, as: 'author', attributes: ['account'] }]
            }
          ],
          // attributes: {
          //   include: [[sequelize.literal('(SELECT name FROM Users WHERE Users.id = Tweet.user_id)'), 'tweetBelongerName'],
          //     [sequelize.literal('(SELECT account FROM Users WHERE Users.id = Tweet.UserId)'), 'tweetBelongerAccount']
          //   ]
          // },
          order: [['createdAt', 'DESC']],
          nest: true
        }
        )])

      console.log(user, replies)
      const userRepliesResult = replies.map(reply => ({
        replyId: reply.id,
        comment: reply.comment,
        replierId: user.id,
        replierName: user.name,
        replierAvatar: user.avatar,
        replierAccount: user.account,
        createdAt: reply.createdAt,
        tweetId: reply.TweetId
        // tweetBelongerName: reply.tweetBelongerName,
        // tweetBelongerAccount: reply.tweetBelongerAccount
      }))

      console.log(userRepliesResult)

      res.status(200).json(userRepliesResult)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
