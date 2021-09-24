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
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

// 引入 imgur
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  // 前台登入
  logIn: async (req, res) => {
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
      // 無此使用者
      if (!user) {
        return res
          .status(401)
          .json({ status: 'error', message: 'User does not exist.' })
      }
      // 檢查前台登入權限
      if (user.role === 'admin') {
        return res.status(401).json({
          status: 'error',
          message:
            'Admin can only login to backend, please register a user account to login frontend',
        })
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
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 註冊
  register: async (req, res) => {
    try {
      const { name, account, email, password } = req.body
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
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 取得登入中使用者
  getCurrentUser: async (req, res) => {
    try {
      const id = helpers.getUser(req).id
      const currentUser = await User.findByPk(id, {
        attributes: [
          'id',
          'name',
          'account',
          'email',
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
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 取得特定使用者
  getUser: async (req, res) => {
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
        introduction: user.introduction,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        tweetCount: user.tweetCount,
        isFollowed,
      }
      return res.status(200).json(user)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 取得該使用者的所有推文
  getTweets: async (req, res) => {
    try {
      const loginId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt',
          'likeCount',
          'replyCount',
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Likes WHERE UserId = ${loginId} AND TweetId = Tweet.id)`
            ),
            'isLiked',
          ],
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        ],
        order: [['createdAt', 'DESC']],
      })
      return res.status(200).json(tweets)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 取得該使用者的所有回覆
  getRepliedTweets: async (req, res) => {
    try {
      const loginId = helpers.getUser(req).id
      let repliedTweets = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [
          {
            model: User,
            where: { id: req.params.id },
            attributes: ['id', 'account', 'name', 'avatar'],
          },
          {
            model: Tweet,
            include: [{ model: User, attributes: ['id', 'name', 'account'] }],
          },
        ],
        attributes: [
          'id',
          'UserId',
          'TweetId',
          'comment',
          'createdAt',
          'updatedAt',
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Likes WHERE UserId = ${loginId} AND TweetId = Tweet.id)`
            ),
            'isLiked',
          ],
        ],
        order: [['createdAt', 'DESC']],
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
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 取得該使用者 Like 過的推文
  getLikedTweets: async (req, res) => {
    try {
      const loginId = helpers.getUser(req).id
      let likedTweets = await Like.findAll({
        where: { UserId: req.params.id },
        include: [
          {
            model: Tweet,
            include: {
              model: User,
              attributes: ['id', 'account', 'name', 'avatar'],
            },
          },
        ],
        attributes: [
          'id',
          'UserId',
          'TweetId',
          'createdAt',
          'updatedAt',
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Likes WHERE UserId = ${loginId} AND TweetId = Tweet.id)`
            ),
            'isLiked',
          ],
        ],
        order: [['createdAt', 'DESC']],
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
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 取得使用者追蹤的 user 名單
  getFollowingUsers: async (req, res) => {
    try {
      const loginId = helpers.getUser(req).id
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
              'introduction',
              [
                sequelize.literal(
                  `EXISTS (SELECT 1 FROM Followships WHERE followerId = ${loginId} AND followingId = Followings.id)`
                ),
                'isFollowed',
              ],
            ],
          },
        ],
        attributes: ['id', 'name', 'account', 'avatar', 'cover'],
        order: [
          [sequelize.literal('`Followings->Followship`.`createdAt`'), 'DESC'],
        ],
      })
      // 取出正在追蹤的人
      followingUsers = followingUsers.Followings
      return res.status(200).json(followingUsers)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 取得追蹤使用者的 user 名單
  getFollowerUsers: async (req, res) => {
    try {
      const loginId = helpers.getUser(req).id
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
              'introduction',
              [
                sequelize.literal(
                  `EXISTS (SELECT 1 FROM Followships WHERE followerId = ${loginId} AND followingId = Followers.id)`
                ),
                'isFollowed',
              ],
            ],
          },
        ],
        attributes: ['id', 'name', 'account', 'avatar', 'cover'],
        order: [
          [sequelize.literal('`Followers->Followship`.`createdAt`'), 'DESC'],
        ],
      })
      // 取出被哪些人追蹤
      followerUsers = followerUsers.Followers
      return res.status(200).json(followerUsers)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 取得追蹤人數最多的前十名使用者
  getTopUsers: async (req, res) => {
    try {
      const loginId = await helpers.getUser(req).id
      const topUsers = await User.findAll({
        where: { role: 'user' },
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
      return res.status(200).json({ topUsers })
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 修改使用者設定
  putUserSetting: async (req, res) => {
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
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  // 修改使用者個人資料
  putUserProfile: async (req, res) => {
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
      const user = await User.findByPk(loginId)
      const { avatar, cover } = req.files
      if (avatar && cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(avatar[0].path, async (err, avatarImg) => {
          imgur.upload(cover[0].path, async (err, coverImg) => {
            await user.update({
              name,
              introduction,
              avatar: files.avatar ? img.data.link : user.avatar,
              cover: user.cover,
            })
          })
        })
        return res
          .status(200)
          .json({ status: 'success', message: 'Update user successfully.' })
      } else if (!avatar && !cover) {
        await user.update({
          name,
          introduction,
        })
        return res
          .status(200)
          .json({ status: 'success', message: 'Update user successfully.' })
      } else if (avatar && !cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(avatar[0].path, async (err, img) => {
          await user.update({
            name,
            introduction,
            avatar: avatar ? img.data.link : user.avatar,
            cover: user.cover,
          })
          return res
            .status(200)
            .json({ status: 'success', message: 'Update user successfully.' })
        })
      } else if (!avatar && cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(cover[0].path, async (err, img) => {
          await user.update({
            name,
            introduction,
            avatar: user.avatar,
            cover: cover ? img.data.link : cover.avatar,
          })
          return res
            .status(200)
            .json({ status: 'success', message: 'Update user successfully.' })
        })
      }
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
}

module.exports = userController
