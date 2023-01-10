const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { dateFormat } = require('../helpers/date-helper')
const { imgurUploadImageHandler } = require('../helpers/file-helper')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        token,
        user: userData
      })
    } catch (error) {
      next(error)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) throw new Error('所有欄位皆為必填!')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
      if (name?.length > 50) throw new Error('暱稱 name 上限 50 字!')
      const [userFoundByAccount, userFoundByEmail] = await Promise.all([
        User.findOne({ where: { account }, raw: true }),
        User.findOne({ where: { email }, raw: true })
      ])
      if (userFoundByAccount) throw new Error('account 已重複註冊!')
      if (userFoundByEmail) throw new Error('email 已重複註冊!')
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })
      const newUser = user.toJSON()
      delete newUser.password
      res.status(200).json({ status: 'success', message: '帳號已成功註冊!', newUser })
    } catch (error) {
      next(error)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const user = await User.findByPk(currentUser.id, {
        attributes: {
          exclude: ['password', 'role', 'createdAt', 'updatedAt'],
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id )'), 'tweetCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id )'), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id )'), 'followingCount']
          ]
        },
        raw: true
      })
      if (!user) throw new Error('使用者不存在!')
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const paramsId = Number(req.params.id)
      const user = await User.findByPk(paramsId, {
        attributes: {
          exclude: ['password', 'role', 'createdAt', 'updatedAt'],
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id )'), 'tweetCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id )'), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id )'), 'followingCount'],
            [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.followerId = ${currentUser.id} AND Followships.followingId = User.id )`), 'isFollowed']
          ]
        },
        raw: true
      })
      if (!user) throw new Error('使用者不存在!')
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const paramsId = Number(req.params.id)
      const tweets = await Tweet.findAll({
        where: { UserId: paramsId },
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          }],
        attributes: {
          exclude: ['updatedAt'],
          include: [
            'id', 'UserId', 'description', 'createdAt',
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'likeCount'],
            [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUser.id} AND Likes.TweetId = Tweet.id )`), 'isLiked']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!tweets) throw new Error('推文不存在!')
      const newTweets = tweets
        .map(tweet => ({
          ...tweet,
          relativeTime: dateFormat(tweet.createdAt).fromNow()
        }))
      res.status(200).json(newTweets)
    } catch (error) {
      next(error)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const paramsId = Number(req.params.id)
      const replies = await Reply.findAll({
        where: { UserId: paramsId },
        attributes: { exclude: ['updatedAt'] },
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          },
          {
            model: Tweet,
            attributes: ['UserId'],
            include: {
              model: User,
              attributes: ['account']
            }
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!replies) throw new Error('留言回覆不存在!')
      const newReplies = replies
        .map(reply => ({
          ...reply,
          relativeTime: dateFormat(reply.createdAt).fromNow()
        }))
      res.status(200).json(newReplies)
    } catch (error) {
      next(error)
    }
  },
  getUserLikedTweets: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const paramsId = Number(req.params.id)
      const likes = await Like.findAll({
        where: { UserId: paramsId },
        attributes: { exclude: ['updatedAt'] },
        include: [
          {
            model: Tweet,
            attributes: [
              'id', 'UserId', 'description',
              [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'replyCount'],
              [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'likeCount'],
              [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUser.id} AND Likes.TweetId = Tweet.id )`), 'isLiked']
            ],
            include: {
              model: User,
              attributes: ['id', 'account', 'name', 'avatar']
            }
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!likes) throw new Error('按讚不存在!')
      const newLikes = likes
        .map(like => ({
          ...like,
          relativeTime: dateFormat(like.createdAt).fromNow()
        }))
      res.status(200).json(newLikes)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const paramsId = Number(req.params.id)
      const followships = await Followship.findAll({
        where: { followerId: paramsId },
        attributes: { exclude: ['updatedAt'] },
        include: {
          model: User,
          as: 'Followings',
          attributes: {
            exclude: ['password', 'role', 'createdAt', 'updatedAt'],
            include: [
              [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.followerId = ${currentUser.id} AND Followships.followingId = Followings.id )`), 'isFollowed']
            ]
          }
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!followships) throw new Error('追蹤關係不存在!')
      res.status(200).json(followships)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const paramsId = Number(req.params.id)
      const followships = await Followship.findAll({
        where: { followingId: paramsId },
        attributes: { exclude: ['updatedAt'] },
        include: {
          model: User,
          as: 'Followers',
          attributes: {
            exclude: ['password', 'role', 'createdAt', 'updatedAt'],
            include: [
              [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.followerId = ${currentUser.id} AND Followships.followingId = Followers.id )`), 'isFollowed']
            ]
          }
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!followships) throw new Error('追蹤關係不存在!')
      res.status(200).json(followships)
    } catch (error) {
      next(error)
    }
  },
  putUserProfile: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      const paramsId = Number(req.params.id)
      if (name?.length > 50) throw new Error('暱稱 name 上限 50 字!')
      if (introduction?.length > 160) throw new Error('自我介紹 introduction 上限 160 字!')
      const { files } = req
      const [user, avatarFilePath, coverFilePath] = await Promise.all([
        User.findByPk(paramsId),
        imgurUploadImageHandler(files?.avatar ? files.avatar[0] : null),
        imgurUploadImageHandler(files?.cover ? files.cover[0] : null)
      ])
      if (!user) throw new Error('使用者不存在!')
      const updatedUser = await user.update({
        name,
        introduction,
        avatar: avatarFilePath || user.avatar,
        cover: coverFilePath || user.cover
      })
      const updatedUserData = updatedUser.toJSON()
      delete updatedUserData.password
      res.status(200).json(updatedUserData)
    } catch (error) {
      next(error)
    }
  },
  putUserSetting: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const { account, name, email, password, checkPassword } = req.body
      const paramsId = Number(req.params.id)
      if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) throw new Error('所有欄位皆為必填!')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
      if (name?.length > 50) throw new Error('暱稱 name 上限 50 字!')
      const [user, userFoundByAccount, userFoundByEmail] = await Promise.all([
        User.findByPk(paramsId),
        User.findOne({ where: { account }, raw: true }),
        User.findOne({ where: { email }, raw: true })
      ])
      if ((account === userFoundByAccount?.account) && (userFoundByAccount?.id !== currentUser.id)) throw new Error('account 已重複註冊!')
      if ((email === userFoundByEmail?.email) && (userFoundByEmail?.id !== currentUser.id)) throw new Error('email 已重複註冊!')
      const renewUser = await user.update({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      const renewUserData = renewUser.toJSON()
      delete renewUserData.password
      res.json({ status: 'success', message: '帳號內容已成功修改!', renewUser: renewUserData })
    } catch (error) {
      next(error)
    }
  },
  patchUserCover: async (req, res, next) => {
    try {
      const paramsId = Number(req.params.id)
      const user = await User.findByPk(paramsId)
      if (!user) throw new Error('使用者不存在!')
      const updatedUser = await user.update({
        cover: 'https://i.imgur.com/dIsjVjn.jpeg' || user.cover
      })
      const updatedUserData = updatedUser.toJSON()
      delete updatedUserData.password
      res.status(200).json(updatedUserData)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
