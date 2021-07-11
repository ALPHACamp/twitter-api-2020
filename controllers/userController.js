const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Sequelize = require('sequelize')
const { Op } = require("sequelize")

const imgurUpload = (filePath) => {
  return new Promise((resolve, reject) => {
    imgur.upload(filePath, (err, img) => {
      if (err) return reject(err)
      return resolve(img)
    })
  })
}

const userController = {

  signup: async (req, res, next) => {
    try {
      const { name, account, email, password, confirmPassword } = req.body
      if (!name || !account || !email || !password || !confirmPassword) return res.json({ status: 'error', message: '請填入所有欄位' })
      if (password !== confirmPassword) return res.json({ status: 'error', message: '密碼與確認密碼不符' })
      let user = await User.findOne({ where: { account } })
      if (user) return res.json({ status: 'error', message: `此帳號已被註冊` })
      user = await User.findOne({ where: { email } })
      if (user) return res.json({ status: 'error', message: `此信箱已被註冊` })

      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)
      await User.create({
        account,
        name,
        email,
        password: hashPassword,
      })
      return res.json({ status: 'success', message: '註冊成功' })
    }
    catch (err) {
      next(err)
    }
  },

  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) return res.json({ status: 'error', message: '請填入所有欄位' })

      const user = await User.findOne({ where: { account } })
      if (!user) return res.status(401).json({ status: 'error', message: '查無此使用者' })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(401).json({ status: 'error', message: '密碼輸入錯誤' })

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id, account: user.account, name: user.name, email: user.email, role: user.role
        }
      })
    }
    catch (err) {
      next(err)
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      const user = await User.findByPk(helpers.getUser(req).id, {
        attributes: ['id', 'name', 'account', 'avatar']
      })
      if (!user) return res.json({ status: 'error', message: '找不到此使用者的資訊' })
      return res.json(user)
    }
    catch (err) {
      next(err)
    }
  },

  getUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      const user = await User.findOne({
        where: {
          id: { [Op.eq]: req.params.id, },
          role: { [Op.ne]: 'admin' }
        },
        attributes: [
          'id', 'account', 'name', 'bio', 'avatar', 'cover',
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.FollowingId = User.id)'), 'totalFollowers'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.FollowerId = User.id)'), 'totalFollowings']
        ],
        include: [{
          model: Tweet, attributes: [
            'id', 'description', 'createdAt',
            [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = User.id)'), 'totalReplies'],
            [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = User.id)'), 'totalLikes']
          ],
          include: [
            { model: User, attributes: ['avatar', 'name', 'account'] },
          ],
          order: [['createdAt', 'DESC']]
        }]
      })
      if (!user) return res.json({ status: 'error', message: '使用者不存在' })
      return res.json(user)
    } catch (err) { next(err) }
  },

  getUserTweets: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        attributes: [
          'id',
          'description',
          'createdAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'totalReplies'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes']
        ],
        include: [
          {
            model: User, attributes: ['account', 'name', 'avatar', 'cover', 'bio']
          }],
      })
      if (tweets.length === 0) {
        return res.json({ status: 'error', message: '使用者暫無貼文' })
      }
      return res.json(tweets)
    } catch (err) { next(err) }
  },

  getUserRepliedTweets: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      const tweets = await Tweet.findAll({
        include: [
          { model: User, attributes: ['name', 'account', 'avatar'] },
          {
            model: Reply, where: { UserId: req.params.id },
            attributes: ['content', 'createdAt'],
            include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
            order: ['createdAt', 'DESC']
          }],
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'totalReplies'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes']
        ],
      })

      if (tweets.length === 0) return res.json({ status: 'error', message: '沒有回覆任何推文' })
      return res.json(tweets)
    } catch (err) { next(err) }
  },

  getUserLike: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      const likes = await Like.findAll({
        include: [
          { model: User, attributes: ['account', 'name', 'avatar', 'cover'] },
          {
            model: Tweet,
            attributes: ['description', 'createdAt',
              [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'totalReplies'],
              [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes']],
            include: [{ model: User, attributes: ['account', 'name', 'avatar'] }]
          }],
        where: { UserId: req.params.id }
      })
      if (likes.length === 0) return res.json({ status: 'error', message: '沒有喜歡的推文或回覆' })
      return res.json(likes)
    } catch (err) { next(err) }
  },

  getUserFollowings: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      const user = await User.findOne({
        where: {
          id: { [Op.eq]: req.params.id, },
          role: { [Op.ne]: 'admin' }
        },
        include: [{ model: User, as: 'Followings', attributes: ['id', 'name', 'account', 'avatar', 'bio'] }],
        order: [['createdAt', 'DESC']]
      })

      const followingsData = user.Followings

      if (followingsData.length === 0) return res.json({ status: 'error', message: '沒有追蹤者' })
      const followings = followingsData.map(following => ({
        id: following.dataValues.id,
        name: following.dataValues.name,
        account: following.dataValues.account,
        avatar: following.dataValues.avatar,
        bio: following.dataValues.bio,
        followingId: following.dataValues.id,
        followerId: following.dataValues.Followship.followerId,
        isFollowing: helpers.getUser(req).Followings.map(following => following.id).includes(following.dataValues.id)
      }))

      return res.json(followings)
    } catch (err) { next(err) }
  },

  getUserFollowers: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      const user = await User.findOne({
        where: {
          id: { [Op.eq]: req.params.id, },
          role: { [Op.ne]: 'admin' }
        },
        include: [{ model: User, as: 'Followers' }],
        order: [['createdAt', 'DESC']]
      })
      const followersData = user.Followers
      if (followersData.length === 0) return res.json({ status: 'error', message: '沒有追隨者' })

      const followers = followersData.map(follower => ({
        id: follower.dataValues.id,
        name: follower.dataValues.name,
        account: follower.dataValues.account,
        avatar: follower.dataValues.avatar,
        bio: follower.dataValues.bio,
        followerId: follower.dataValues.id,
        followingId: follower.dataValues.Followship.followingId,
        isFollowing: helpers.getUser(req).Followings.map(follower => follower.id).includes(follower.dataValues.id)
      }))
      return res.json(followers)
    } catch (err) { next(err) }
  },

  putUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      let { name, bio, avatar, cover } = req.body
      const user = await User.findOne({
        where: {
          id: helpers.getUser(req).id,
          role: { [Op.ne]: 'admin' }
        },
        attributes: ['id', 'name', 'bio', 'avatar', 'cover']
      })
      if (!name) return res.json({ status: 'error', message: '請填寫名稱' })

      if (req.files) {
        avatar = req.files.avatar || false
        cover = req.files.cover || false
      }

      if (avatar && !cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const img = await imgurUpload(avatar[0].path)
        await user.update({
          name: name,
          bio: bio,
          avatar: avatar ? img.data.link : helpers.getUser(req).avatar,
          cover: helpers.getUser(req).cover,
        })
        return res.json([user, { status: 'success', message: '頭貼更新完成' }])

      } else if (!avatar && cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const img = await imgurUpload(cover[0].path)
        await user.update({
          name: name,
          bio: bio,
          avatar: helpers.getUser(req).avatar,
          cover: cover ? img.data.link : helpers.getUser(req).cover,
        })
        return res.json([user, { status: 'success', message: '封面更新完成' }])

      } else if (avatar && cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const img = await imgurUpload(avatar[0].path)
        await user.update({
          name: name,
          bio: bio,
          avatar: avatar ? img.data.link : helpers.getUser(req).avatar,
          cover: helpers.getUser(req).cover,
        })
        const secondImg = await imgurUpload(cover[0].path)
        await user.update({
          name: name,
          bio: bio,
          avatar: helpers.getUser(req).avatar,
          cover: cover ? secondImg.data.link : helpers.getUser(req).cover,
        })
        return res.json([user, { status: 'success', message: '個人資訊更新完成' }])
      } else {
        await user.update({
          name: name,
          bio: bio,
          avatar,
          cover,
        })
        return res.json([user, { status: 'success', message: '個人資訊更新完成' }])
      }

    } catch (err) { next(err) }
  },
  putUserInfo: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      let { account, name, email, password, confirmPassword } = req.body
      account = account.trim()
      name = name.trim()
      email = email.trim()
      password = password.trim()
      confirmPassword = confirmPassword.trim()
      if (!name || !email || !password || !confirmPassword || !account) return res.json({ status: 'error', message: '所有欄位皆必填' })
      const user = await User.findByPk(helpers.getUser(req).id)
      const checkAccount = await User.findOne({ where: { account, id: { [Op.ne]: helpers.getUser(req).id } } })
      const checkEmail = await User.findOne({ where: { email, id: { [Op.ne]: helpers.getUser(req).id } } })
      const checkPassword = password === confirmPassword
      if (checkAccount) return res.json({ status: 'error', message: '此帳號已被使用' })
      if (checkEmail) return res.json({ status: 'error', message: '此信箱已被使用' })
      if (!checkPassword) return res.json({ status: 'error', message: '請確認密碼是否一致' })
      user.update({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
      })
      return res.json([user, { status: 'success', message: '帳戶信息更新成功' }])
    } catch (err) { next(err) }
  }
}

module.exports = userController
