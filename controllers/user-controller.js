const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const helpers = require('../_helpers')

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
      if (password && !validator.isByteLength(password, { min: 8, max: 20 })) {
        errors.push('密碼長度介於 8 ~ 20 字元')
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
  getUserLikes: async (req, res, next) => {
    try {
      const { userId } = req.params
      const currentUserId = helpers.getUser(req).id
      const likedTweets = await Like.findAll({
        where: { UserId: userId },
        include: [ User, { model: Tweet, include: [Reply, User, { model: User, as: 'LikedUsers' }] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (likedTweets.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: '沒有按任何貼文喜歡'
        })
      }
      const user = await User.findByPk(userId)
      if(!user){
        return res.status(404).json({
          status: "error",
          message: "找不到使用者",
        })
      }
      
      const likedTweetsData = likedTweets.map(like => {
        return {
          userId: like.UserId,
          tweetAuthorId: like.Tweet.UserId,
          tweetAuthorAccount: like.Tweet.User.account,
          tweetAuthorName: like.Tweet.User.name,
          tweetAuthorAvatar: like.Tweet.User.avatar,
          tweetContent: like.Tweet.description,


        }
      })


      
      return res
        .status(200)
        .json({
          status: 'success',
          message: 'All liked tweets are retrieved!',
          likedTweets

        })
    } catch (error) { next(error) }
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
  getUserFollowings: async (req, res, next) => {
    try {
      const { userId } = req.params
      const users = await User.findByPk(userId, {
        include: { model: User, as: 'Followings' },
        raw: true,
        nest: true
      })
      if (!users) {
        return res.status(404).json({ status: 'error', message: '帳戶不存在' })
      }
      const userData = users
      const followingData = []
      followingData.push({
        followingId: userData.Followings.id,
        followingAccount: userData.Followings.account,
        followingAvatar: userData.Followings.avatar,
        followingIntro: userData.Followings.introduction,
        followingCount: userData.Followings.length,
        isFollowing: helpers
          .getUser(req)
          .Followings.some(
            (fu) => fu.Followship.followingId === users.Followers.id
          )
      })
      return res.status(200).json(followingData)
    } catch (error) { next(error) }
  },
  getUser: async (req, res, next) => {
    try {
      const { userId } = req.params
      let userInfo = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        include: [Tweet, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
      })

      if (!userInfo || userInfo.role === 'admin') {
        return res
          .status(404)
          .json({ status: 'error', message: '此帳戶不存在' })
      }
      userInfo = {
        id: userInfo.id,
        account: userInfo.account,
        name: userInfo.name,
        avatar: userInfo.avatar || 'https://reurl.cc/7RVA5N',
        cover: userInfo.cover || 'https://reurl.cc/4QNDE3',
        introduction: userInfo.introduction || 'Newbie here!',
        tweetCount: userInfo.Tweets.length,
        followingCount: userInfo.Followings.length,
        followerCount: userInfo.Followers.length,
        isFollowing: userInfo.Followings.some(u => u.id === helpers.getUser(req).id)
      }

      return res.status(200).json(userInfo)
    } catch (error) { next(error) }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const { userId } = req.params
      const users = await User.findByPk(userId, {
        include: { model: User, as: 'Followers' },
        order: [
          [{ model: User, as: 'Followers' }, Followship, 'createdAt', 'DESC']
        ],
        raw: true,
        nest: true
      })
      if (!users) {
        return res.status(404).json({ status: 'error', message: '此帳戶不存在!' })
      }

      const followerData = []
      followerData.push({
        followerId: users.Followers.id,
        followerAccount: users.Followers.account,
        followerName: users.Followers.name,
        followerAvatar: users.Followers.avatar,
        followerIntro: users.Followers.introduction,
        followerCount: users.Followers.length,
        followshipCreatedAt: users.Followers.Followship.createdAt,
        isFollowing: helpers
          .getUser(req)
          .Followings.some(
            (fg) => fg.Followship.followingId === users.Followers.id
          )
      })

      return res
        .status(200)
        .json(followerData)
    } catch (error) { next(error) }
  }
}

module.exports = userController
