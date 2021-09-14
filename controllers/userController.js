const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const bcrypt = require('bcryptjs')
const helpers = require('../_helpers.js')
const { sequelize } = require('../models')

// 引入驗證欄位
const {
  registerCheck,
  updateSettingCheck,
  updateProfile,
} = require('../middleware/validator.js')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const { replace } = require('sinon')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

// 引入 imgur
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  // 前台登入
  logIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查是否輸入帳號密碼
      if (!email || !password) {
        return res.json({
          status: 'error',
          message: 'All fields are required.',
        })
      }
      // 確認使用者資料
      const user = await User.findOne({ where: { email } })
      // 檢查前台登入權限
      if (user.role === 'admin') {
        return res.status(401).json({
          status: 'error',
          message:
            'Admin can only login to backend, please register a user account to login frontend',
        })
      }
      // 無此使用者
      if (!user) {
        return res
          .status(401)
          .json({ status: 'error', message: 'User does not exist.' })
      }
      // 檢查密碼是否正確
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Incorrect password.' })
      }

      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          account: user.account,
          introduction: user.introduction,
          role: user.role,
        },
      })
    } catch (err) {
      next(err)
    }
  },
  // 註冊
  register: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      // validation middleware
      const message = await registerCheck(req)
      if (message) {
        return res
          .status(422)
          .json({ status: 'error', message, userFilledForm: req.body })
      }
      // create user
      await User.create({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: 'https://i.ibb.co/y6FYGKT/user-256.jpg',
        cover: 'https://i.ibb.co/Y0VVPVY/hex-999999.jpg',
      })
      return res
        .status(200)
        .json({ status: 'success', message: 'Registration success.' })
    } catch (err) {
      next(err)
    }
  },
  // 取得登入中使用者
  getCurrentUser: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const currentUser = await User.findByPk(id, {
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'role',
          'cover',
          'followerCount',
          'followingCount',
          'tweetCount',
        ],
      })
      return res.status(200).json(currentUser)
    } catch (err) {
      next(err)
    }
  },
  // 取得特定使用者
  getUser: async (req, res, next) => {
    try {
      const id = req.params.user_id
      const loginUserId = helpers.getUser(req).id
      let user = await User.findByPk(id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
      })
      // 是否已追蹤此 user
      const isFollowed = await user.Followers.map((d) => d.id).includes(
        loginUserId
      )
      user = {
        id: user.id,
        account: user.account,
        name: user.name,
        avatar: user.avatar,
        cover: user.cover,
        role: user.role,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        tweetCount: user.tweetCount,
        isFollowed,
      }
      return res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  // 取得該使用者的所有推文
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  // 取得該使用者的所有回覆
  getRepliedTweets: async (req, res, next) => {
    try {
      let repliedTweets = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet }],
      })
      // 剔除被刪掉的 tweet (Tweet === null)
      await repliedTweets.map((replyTweet) => {
        if (replyTweet.Tweet === null) {
          const id = replyTweet.TweetId
          repliedTweets = repliedTweets.filter((replyTweet) => {
            return replyTweet.TweetId !== id
          })
        }
      })
      return res.status(200).json(repliedTweets)
    } catch (err) {
      next(err)
    }
  },
  // 取得該使用者 Like 過的推文
  getLikedTweets: async (req, res, next) => {
    try {
      let likedTweets = await Like.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet }],
      })
      // 剔除被刪掉的 tweet (Tweet === null)
      await likedTweets.map((likeTweet) => {
        if (likeTweet.Tweet === null) {
          const id = likeTweet.TweetId
          likedTweets = likedTweets.filter((likeTweet) => {
            return likeTweet.TweetId !== id
          })
        }
      })
      return res.status(200).json(likedTweets)
    } catch (err) {
      next(err)
    }
  },
  // 取得使用者追蹤的 user 名單
  getFollowingUsers: async (req, res, next) => {
    try {
      let followingUsers = await User.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: [
              ['id', 'followingId'],
              'name',
              'account',
              'avatar',
              'cover',
            ],
          },
        ],
        attributes: ['id', 'name', 'account', 'avatar', 'cover'],
      })
      // 取出正在追蹤的人
      followingUsers = followingUsers.Followings
      return res.status(200).json(followingUsers)
    } catch (err) {
      next(err)
    }
  },
  // 取得追蹤使用者的 user 名單
  getFollowerUsers: async (req, res, next) => {
    try {
      let followerUsers = await User.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: [
              ['id', 'followerId'],
              'name',
              'account',
              'avatar',
              'cover',
            ],
          },
        ],
        attributes: ['id', 'name', 'account', 'avatar', 'cover'],
      })
      // 取出被哪些人追蹤
      followerUsers = followerUsers.Followers
      return res.status(200).json(followerUsers)
    } catch (err) {
      next(err)
    }
  },
  // 取得追蹤人數最多的前十名使用者
  getTopUsers: async (req, res, next) => {
    try {
      const loginId = await helpers.getUser(req).id
      const topUsers = await User.findAll({
        order: [['followerCount', 'DESC']],
        limit: 10,
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          'followerCount',
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Followships WHERE followerId = ${loginId} AND followingId = User.id )`
            ),
            'isFollowed',
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Users WHERE User.id = ${loginId})`
            ),
            'isCurrentUser',
          ],
        ],
      })
      return res.status(200).json(topUsers)
    } catch (err) {
      next(err)
    }
  },
  // 修改使用者設定
  putUserSetting: async (req, res, next) => {
    try {
      // 確認只能修改自己的設定
      const id = Number(req.params.id)
      const loginId = helpers.getUser(req).id
      if (id !== loginId) {
        return res.json({
          status: 'error',
          message: 'User can only edit their setting.',
        })
      }
      const { name, account, email, password, checkPassword } = req.body
      // validation middleware
      const message = await updateSettingCheck(req)
      if (message) {
        return res
          .status(422)
          .json({ status: 'error', message, userFilledForm: req.body })
      }
      // update user
      const user = await User.findByPk(req.params.id)
      await user.update({
        name,
        email,
        account,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
      })
      return res
        .status(200)
        .json({ status: 'success', message: 'Update user successfully.' })
    } catch (err) {
      next(err)
    }
  },
  // 修改使用者個人資料
  putUserProfile: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      // 確認只能修改自己的資料
      const id = Number(req.params.id)
      const loginId = helpers.getUser(req).id
      if (id !== loginId) {
        return res.json({
          status: 'error',
          message: 'User can only edit their profile.',
        })
      }
      // validator name & introduction
      const message = await updateProfile(req)
      if (message) {
        return res
          .status(422)
          .json({ status: 'error', message, userFilledForm: req.body })
      }
      // 是否上傳圖片
      const { files } = req
      if (files) {
        if (files['avatar'][0]) {
          imgur.setClientID(IMGUR_CLIENT_ID)
          imgur.upload(files['avatar'][0].path, async (err, img) => {
            const user = await User.findByPk(loginId)
            await user.update({
              name,
              introduction,
              avatar: files.avatar ? img.data.link : user.avatar,
              cover: user.cover,
            })
          })
        }
        if (files['cover'][0]) {
          imgur.setClientID(IMGUR_CLIENT_ID)
          imgur.upload(files['cover'][0].path, async (err, img) => {
            const user = await User.findByPk(loginId)
            await user.update({
              name,
              introduction,
              avatar: user.avatar,
              cover: files.cover ? img.data.link : user.cover,
            })
            return res
              .status(200)
              .json({ status: 'success', message: 'Update user successfully.' })
          })
        }
      } else {
        const user = await User.findByPk(loginId)
        await user.update({
          name,
          introduction,
          avatar: user.avatar,
          cover: user.cover,
        })
        return res
          .status(200)
          .json({ status: 'success', message: 'Update user successfully.' })
      }
    } catch (err) {
      next(err)
    }
  },
}

module.exports = userController
