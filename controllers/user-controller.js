const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const helpers = require('../_helpers')
const imgurFileHandler = require('../helpers/file-helpers')

const { User, Tweet, Reply, Like, Followship } = require('../models')

const userController = {
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      return res.json({
        status: 'success',
        message: '登入成功!',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      // check if all the required fields are filled out correctly
      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位皆必填')
      }
      if (name && !validator.isByteLength(name, { max: 50 })) {
        errors.push('字數超出上限，請將字數限制在 50 字以內')
      }
      if (password && !validator.isByteLength(password, { max: 20 })) {
        errors.push('密碼長度不能超過20個字元')
      }
      if (password !== checkPassword) {
        errors.push('密碼與確認密碼不相符')
      }
      if (email && !validator.isEmail(email)) {
        errors.push('請輸入有效的 email 格式')
      }

      // Check if account and email are unique
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) errors.push('帳號已重複註冊！')
      if (userEmail) errors.push('Email已重複註冊！')

      // Return error message if there are errors
      if (errors.length) {
        return res.status(400).json({ status: 'error', errors })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create user in DB
      await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })

      return res.status(200).json({ status: 'success', message: '註冊成功！' })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const { userId } = req.params
      const currentUserId = helpers.getUser(req).id

      const user = await User.findByPk(userId)

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: '找不到使用者'
        })
      }

      const tweets = await Tweet.findAll({
        where: { UserId: userId },
        include: [User, Reply, Like, { model: User, as: 'LikedUsers' }],
        order: [['createdAt', 'DESC']]
      })

      if (tweets.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: '找不到任何推文'
        })
      }

      const tweetsData = tweets.map((tweet) => {
        const { id, UserId, description, createdAt } = tweet
        return {
          id,
          UserId,
          description,
          createdAt,
          name: tweet.User.name,
          account: tweet.User.account,
          avatar: tweet.User.avatar,
          repliedCount: tweet.Replies.length,
          likedCount: tweet.Likes.length,
          isLike: tweet.LikedUsers.some((u) => u.id === currentUserId)
        }
      })

      return res.status(200).json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const { userId } = req.params
      const currentUserId = helpers.getUser(req).id

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: '找不到使用者'
        })
      }

      const replies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          {
            model: Tweet,
            include: User
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      if (replies.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: '找不到任何回覆'
        })
      }

      const repliesData = replies.map((reply) => {
        const { id, TweetId, comment, createdAt } = reply
        return {
          id,
          TweetId,
          comment,
          createdAt,
          tweetAuthorId: reply.Tweet.UserId,
          tweetAuthorAccount: reply.Tweet.User.account,
          replyUserId: reply.UserId,
          replyAccount: reply.User.account,
          replyName: reply.User.name,
          replyAvatar: reply.User.avatar
        }
      })

      return res.status(200).json(repliesData)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const { userId } = req.params
      const currentUserId = helpers.getUser(req).id

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: '找不到使用者'
        })
      }

      const likedTweets = await Like.findAll({
        where: { UserId: userId },
        include: [
          User,
          {
            model: Tweet,
            include: [User, { model: Reply, include: User }, Like]
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      if (likedTweets.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: '沒有按任何貼文喜歡'
        })
      }

      const likedTweetsData = likedTweets.map((like) => {
        return {
          likeId: like.id,
          userId: like.UserId,
          TweetId: like.TweetId,
          likeCreatedAt: like.createdAt,
          tweetAuthorId: like.Tweet.UserId,
          tweetAuthorAccount: like.Tweet.User.account,
          tweetAuthorName: like.Tweet.User.name,
          tweetAuthorAvatar: like.Tweet.User.avatar,
          tweetContent: like.Tweet.description,
          tweetCreatedAt: like.Tweet.createdAt,
          isLike: like.Tweet.Likes.some((u) => u.UserId === currentUserId),
          likedCount: like.Tweet.Likes.length,
          replyCount: like.Tweet.Replies.length
        }
      })
      return res.status(200).json(likedTweetsData)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const { userId } = req.params
      const users = await User.findAll({
        where: { id: userId },
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: ['id', 'account', 'name', 'avatar', 'introduction']
          }
        ],
        order: [
          [{ model: User, as: 'Followings' }, Followship, 'createdAt', 'DESC']
        ],
        raw: true,
        nest: true
      })

      if (!users) {
        return res.status(404).json({ status: 'error', message: '找不到使用者' })
      }

      const tweetCount = await Tweet.count({
        where: { UserId: userId },
        col: 'id'
      })

      const followingCount = await Followship.count({
        where: { followerId: userId }
      })

      const userData = users.map(user => {
        return {
          userId: user.id,
          tweetCount,
          followingCount,
          followingId: user.Followings.id,
          followingAccount: user.Followings.account,
          followingAvatar: user.Followings.avatar,
          followingName: user.Followings.name,
          followingIntro: user.Followings.introduction,
          followshipCreatedAt: user.Followings.Followship.createdAt,
          isFollowing: helpers
            .getUser(req)
            .Followings.some(
              (fg) => fg.Followship.followingId === user.Followings.id
            )
        }
      })

      return res.status(200).json(userData)
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { userId } = req.params
      let userInfo = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        include: [
          Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      if (!userInfo || userInfo.role === 'admin') {
        return res
          .status(404)
          .json({ status: 'error', message: '找不到使用者' })
      }

      userInfo = {
        userId: userInfo.id,
        account: userInfo.account,
        name: userInfo.name,
        avatar:
          userInfo.avatar ||
          "https://live.staticflickr.com/65535/52777903968_c0460ba4d6_z.jpg",
        cover:
          userInfo.cover ||
          "https://live.staticflickr.com/65535/52777507974_aa5dcee4aa_z.jpg",
        introduction: userInfo.introduction || "Newbie here!",
        tweetCount: userInfo.Tweets.length,
        followingCount: userInfo.Followings.length,
        followerCount: userInfo.Followers.length,
        isFollowing: helpers
          .getUser(req)
          .Followings.some((u) => u.Followship.followingId === userInfo.id),
      };

      return res.status(200).json(userInfo)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const { userId } = req.params
      const users = await User.findAll({
        where: { id: userId },
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id', 'account', 'name', 'avatar', 'introduction']
          }
        ],
        order: [
          [{ model: User, as: 'Followers' }, Followship, 'createdAt', 'DESC']
        ],
        raw: true,
        nest: true
      })
      if (!users) {
        return res
          .status(404)
          .json({ status: 'error', message: '找不到使用者' })
      }
      const tweetCount = await Tweet.count({
        where: { UserId: userId },
        col: 'id'
      })
      const followerCount = await Followship.count({
        where: { followingId: userId }
      })

      const userData = users.map((user) => {
        return {
          userId: user.id,
          tweetCount,
          followerCount,
          followerId: user.Followers.id,
          followerAccount: user.Followers.account,
          followerAvatar: user.Followers.avatar,
          followerName: user.Followers.name,
          followerIntro: user.Followers.introduction,
          followshipCreatedAt: user.Followers.Followship.createdAt,
          isFollowing: helpers
            .getUser(req)
            .Followings.some(
              (fg) => fg.Followship.followingId === user.Followers.id
            )
        }
      })

      return res.status(200).json(userData)
    } catch (error) {
      next(error)
    }
  },
  editUserProfile: async (req, res, next) => {
    try {
      const { userId } = req.params
      const { name, introduction } = req.body
      const errors = []

      if (Number(userId) !== Number(helpers.getUser(req).id)) {
        return res.status(403).json({ status: 'error', message: '你沒有權限進入此頁面' })
      }

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ status: 'error', message: '找不到使用者' })
      }

      if (name && !validator.isByteLength(name, { max: 50 })) {
        errors.push('字數超出上限，請將字數限制在 50 字以內')
      }
      if (introduction && !validator.isByteLength(introduction, { max: 160 })) {
        errors.push('字數超出上限，請將字數限制在 160 字以內')
      }
      if (errors.length) {
        return res.status(400).json({ status: 'error', errors })
      }

      const { files } = req

      // handle the user's uploaded avatar and cover image, if no image is uploaded, the path is set to null.
      const uploadAvatar = files?.avatar ? imgurFileHandler(files.avatar[0]) : null
      const uploadCover = files?.cover ? imgurFileHandler(files.cover[0]) : null

      const [avatarPath, coverPath] = await Promise.all([uploadAvatar, uploadCover])

      await user.update({
        name,
        introduction,
        avatar: avatarPath || user.avatar,
        cover: coverPath || user.cover
      })

      res.json({ status: 'success', message: '成功編輯個人資料' })
    } catch (err) {
      next(err)
    }
  },
  editUserAccount: async (req, res, next) => {
    try {
      // user setting
      const { userId } = req.params
      const currentUserId = helpers.getUser(req).id
      const { account, name, email, password, checkPassword } = req.body

      // confirm if it is the currently logged-in user
      if (currentUserId !== Number(userId)) {
        return res.status(403).json({ status: 'error', message: '你沒有權限進入此頁面' })
      }
      // confirm if this user exists
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ status: 'error', message: '找不到使用者!' })
      }

      const errors = []
      // check if all the required fields are filled out correctly
      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位皆必填')
      }
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        message.push('字數超出上限，請將字數限制在 50 字以內')
      }
      if (password && !validator.isByteLength(password, { max: 20 })) {
        errors.push('密碼長度不能超過20字元')
      }
      if (password !== checkPassword) {
        errors.push('密碼與確認密碼不相符')
      }
      if (email && !validator.isEmail(email)) {
        errors.push('請輸入有效的 email 格式')
      }

      // check if account and email are unique
      const [existingUserAccount, existingUserEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      // verify if the user editing currently is the same user as the one logged in. If they are the same user, no error message needs to be displayed
      if (existingUserAccount && existingUserAccount.id !== currentUserId) {
        errors.push('帳號已重複註冊！')
      }
      if (existingUserEmail && existingUserEmail.id !== currentUserId) {
        errors.push('Email已重複註冊！')
      }

      if (errors.length) {
        return res.status(400).json({ status: 'error', errors })
      }
      // hashedPassword
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      // create user in DB
      await user.update({
        account,
        name,
        email,
        password: hashedPassword
      })

      return res.status(200).json({ status: 'success', message: '帳號設定修改成功！' })
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const users = await User.findAll({
        attributes: ['id', 'account', 'name', 'avatar'],
        include: {
          model: User,
          as: 'Followers',
          attributes: ['id']
        },
        limit,
        raw: true,
        nest: true
      })
      if (!users) {
        return res.status(404).json({ status: 'error', message: '無使用者資料!' })
      }

      let usersData = users.map(user => {
        return {
          UserId: user.id,
          account: user.account,
          name: user.name,
          avatar: user.avatar || 'https://live.staticflickr.com/65535/52777903968_c0460ba4d6_z.jpg',
          followerCount: user.Followers.length,
          isFollowing: helpers.getUser(req).Followings.some(fg => fg.id === user.id)
        }
      })
      usersData = usersData.sort((a, b) => b.followerCount - a.followerCount)
      return res.status(200).json(usersData)
    } catch (error) { next(error) }
  }
}
module.exports = userController
