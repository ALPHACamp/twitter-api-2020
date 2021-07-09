const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || 'f5f20e3d9d3e60a'
const Sequelize = require('sequelize')
const { Op } = require("sequelize")
const { replaceSetter } = require('sinon')


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
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
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
      }) || false
      if (!user) return res.json({ status: 'error', message: '使用者不存在' })
      return res.json(user)
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
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
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      // const replies = await Reply.findAll({
      //   where: { UserId: req.params.id },
      //   include: [{
      //     model: Tweet,
      //     include: [{ model: User, attributes: ['avatar', 'name', 'account'] }],
      //     attributes: [
      //       'id',
      //       'description',
      //       'createdAt',
      //       [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'totalReplies'],
      //       [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes']
      //     ]
      //   }],
      //   order: [['createdAt', 'DESC']]
      // })
      // if (replies.length === 0) return res.json({ status: 'error', message: '沒有回覆的推文' })
      const tweets = await Tweet.findAll({
        include: [{
          model: Reply, where: { UserId: req.params.id },
          attributes: ['content', 'createdAt'],
          include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
          order: ['createdAt', 'DESC']
        }],
        attributes: [
          'id',
          'description',
          'createdAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'totalReplies'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes']
        ],
      })
      return res.json(tweets)
    } catch (err) { next(err) }
  },
  getUserLike: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      let likes = await Like.findAll({
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
      return res.json(likes)
    } catch (err) { next(err) }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
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
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
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
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      let { name, email, password, confirmPassword, account, bio, avatar, cover } = req.body
      const hasPostInfo = JSON.stringify(req.body) === '{}'
      confirmPassword = confirmPassword || false
      const checkPassword = confirmPassword === password
      account = account || null
      const user = await User.findOne({
        where: {
          id: helpers.getUser(req).id,
          role: { [Op.ne]: 'admin' }
        }
      })
      if (hasPostInfo) return res.json({ status: 'error', message: '請填入資訊' })
      const checkAccount = await User.findOne({ where: { account, id: { [Op.ne]: helpers.getUser(req).id } } }) || false
      if (checkAccount) {
        return res.json({ status: 'error', message: '此帳號已有人使用' })
      }
      if (confirmPassword && checkPassword && !hasPostInfo) {
        user.update({
          name: name || user.name,
          email: email || user.email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) || user.password,
          account: account || user.account,
        })
        return res.json([user, { status: 'success', message: '資訊更新成功' }])
      }
      if (confirmPassword && !checkPassword && !hasPostInfo) return res.json({ status: 'error', message: '請確認密碼一致' })
      if (req.files) {
        avatar = req.files.avatar || false
        cover = req.files.cover || false
      }
      if (avatar && !cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(avatar[0].path, (err, img) => {
          user.update({
            name: name || helpers.getUser(req).name,
            email: email || helpers.getUser(req).email,
            account: account || helpers.getUser(req).account,
            bio: bio || helpers.getUser(req).bio,
            avatar: avatar ? img.data.link : helpers.getUser(req).avatar,
            cover: helpers.getUser(req).cover,
          })
          return res.json([user, { status: 'success', message: '個人頭貼更新成功' }])
        })
      } else if (!avatar && cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(cover[0].path, (err, img) => {
          user.update({
            name: name || helpers.getUser(req).name,
            email: email || helpers.getUser(req).email,
            account: account || helpers.getUser(req).account,
            bio: bio || helpers.getUser(req).bio,
            avatar: helpers.getUser(req).avatar,
            cover: cover ? img.data.link : helpers.getUser(req).cover,
          })
          return res.json([user, { status: 'success', message: '封面更新成功' }])
        })
      } else if (avatar && cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        await imgur.upload(avatar[0].path, (err, img) => {
          user.update({
            name: name || helpers.getUser(req).name,
            email: email || helpers.getUser(req).email,
            account: account || helpers.getUser(req).account,
            bio: bio || helpers.getUser(req).bio,
            avatar: avatar ? img.data.link : helpers.getUser(req).avatar,
            cover: helpers.getUser(req).cover,
          })
        })
        await imgur.upload(cover[0].path, (err, img) => {
          user.update({
            name: name || helpers.getUser(req).name,
            email: email || helpers.getUser(req).email,
            account: account || helpers.getUser(req).account,
            bio: bio || helpers.getUser(req).bio,
            avatar: helpers.getUser(req).avatar,
            cover: cover ? img.data.link : helpers.getUser(req).cover,
          })
        })
        return res.json([user, { status: 'success', message: '個人資訊更新成功' }])
      } else {
        user.update({
          name: name || helpers.getUser(req).name,
          email: email || helpers.getUser(req).email,
          account: account || helpers.getUser(req).account,
          bio: bio || helpers.getUser(req).bio,
        })
        return res.json([user, { status: 'success', message: '資訊更新成功' }])
      }

    } catch (err) { next(err) }
  },
}

module.exports = userController
