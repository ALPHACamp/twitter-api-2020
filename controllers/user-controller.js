const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/image-helper')

const userController = {
  signin: async (req, res, next) => {
    try {
      if (req.user.error) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json(req.user.error)
      }
      const user = req.user.toJSON()
      if (user.role !== 'user') {
        return res.status(StatusCodes.FORBIDDEN)
          .json({
            status: 'error',
            message: '無使用者權限'
          })
      }
      const payload = {
        id: user.id
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
      delete user.password
      return res.status(StatusCodes.OK)
        .json({
          status: 'success',
          message: '成功登入',
          token,
          user
        })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const account = req.body.account.trim()
      const password = req.body.password.trim()
      const checkPassword = req.body.checkPassword.trim()
      const name = req.body.name.trim()
      const email = req.body.email.trim()
      const emailRegex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ //eslint-disable-line
      if (!account || !password || !checkPassword || !name || !email) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: '必填欄位不可空白'
          })
      }
      if (password !== checkPassword) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: '密碼與確認密碼不相符'
          })
      }
      if (!emailRegex.test(email)) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json({
            status: 'error',
            message: '信箱格式不符合'
          })
      }
      const user = await User.findAll({
        where: {
          [Op.or]: [
            { account },
            { email }
          ]
        }
      })
      if (user.length > 0) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: 'Account或Email已被使用'
          })
      }
      if (account.length > 10) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: 'Account限制為10字元'
          })
      }
      if (name.length > 50) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: 'Name限制為50字元'
          })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      await User.create({
        name,
        account,
        email,
        password: hashedPassword,
        isAdmin: false,
        role: 'user'
      })
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功創建'
      })
    } catch (error) {
      next(error)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const user = await User.findByPk(userId, {
        attributes: {
          exclude: [
            'password',
            'createdAt',
            'updatedAt',
            'cover',
            'introduction',
            'role'
          ]
        }
      })
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      return res.status(StatusCodes.OK).json(user)
    } catch (error) {
      next(error)
    }
  },
  getUserPage: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      let user = await User.findByPk(userId, {
        attributes: {
          exclude: [
            'password',
            'createdAt',
            'updatedAt',
            'role'
          ]
        },
        include: [
          { model: Tweet },
          { model: Like },
          { model: Reply },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      user = await user.toJSON()
      const isFollowing = user.Followers.some(followers => followers.id === req.user.id)
      const followingsCounts = user.Followings.length
      const followersCounts = user.Followers.length
      delete user.Followings
      delete user.Followers
      return res.status(StatusCodes.OK).json(
        {
          status: 'success',
          message: '成功取得User資料',
          ...user,
          tweetsCounts: user.Tweets.length,
          likesCounts: user.Likes.length,
          repliesCounts: user.Replies.length,
          followingsCounts,
          followersCounts,
          isFollowing
        }
      )
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const { name, introduction } = req.body
      const { files } = req
      if (helpers.getUser(req).id !== userId) {
        return res.stauts(StatusCodes.FORBIDDEN).json({
          status: 'error',
          message: '無權限編輯此使用者'
        })
      }
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      if (!name || !introduction) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '必填欄位不得為空'
        })
      }
      if (name.length > 50) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '名稱不能超過50字'
        })
      }
      if (introduction.length > 150) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '自我介紹不能超過150字'
        })
      }
      if (files) {
        const avatar = files.avatar ? await imgurFileHandler(files.avatar[0]) : null
        const cover = files.cover ? await imgurFileHandler(files.cover[0]) : null
        await user.update({
          ...user,
          name,
          introduction,
          avatar: avatar || user.avatar,
          cover: cover || user.cover
        })
      }
      await user.update({
        ...user,
        name,
        introduction,
        avatar: user.avatar,
        cover: user.cover
      })
      return res.status(StatusCodes.OK).json({ status: 'success', message: '成功編輯個人資料' })
    } catch (error) {
      next(error)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      let user = await User.findByPk(userId, {
        include: [
          { model: Tweet, include: [Reply, Like] }
        ]
      })
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      user = await user.toJSON()
      const tweets = await user.Tweets.map(tweet => {
        return {
          ...tweet,
          userOfTweet: user.id,
          userNameOfTweet: user.name,
          userAccountOfTweet: user.account,
          userAvatarOfTweet: user.avatar,
          repliedCounts: tweet.Replies.length,
          likesCounts: tweet.Likes.length,
          isBeingliked: req.user.LikedTweets ? req.user.LikedTweets.some(like => like.id === tweet.id) : false
        }
      })
      tweets.sort((a, b) => b.createdAt - a.createdAt)
      return res.status(StatusCodes.OK).json(tweets)
    } catch (error) {
      next(error)
    }
  },
  getUserReliedTweets: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      let replies = await Reply.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']],
        include: [
          { model: Tweet, include: User }
        ]
      })
      replies = await replies.map(reply => reply.toJSON())
      replies = replies.map(reply => {
        const repliedTweet = reply.Tweet
        return {
          replyId: reply.id,
          comment: reply.comment,
          repliedTweet: repliedTweet.id,
          repliedTweetDescription: repliedTweet.description,
          userOfRepliedTweet: repliedTweet.User.id,
          userAccountOfRepliedTweet: repliedTweet.User.account,
          userNameOfRepliedTweet: repliedTweet.User.name,
          userAvatarOfRepliedTweet: repliedTweet.User.avatar,
          repliedTweetCreatedAt: repliedTweet.createdAt,
          isBeingliked: req.user.LikedTweets ? req.user.LikedTweets.some(like => like.id === repliedTweet.id) : false,
          userOfReply: user.id,
          userAccountOfReply: user.account,
          userNameOfReply: user.name,
          userAvatarOfReply: user.avatar,
          timeOfReply: reply.createdAt
        }
      })
      return res.status(StatusCodes.OK).json(replies)
    } catch (error) {
      next(error)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      let likes = await Like.findAll({
        where: { UserId: userId },
        order: [
          ['createdAt', 'DESC']
        ],
        include: [
          { model: Tweet, include: [User, Like, Reply] }
        ]
      })

      likes = await likes.map(like => like.toJSON())
      likes = likes.map(like => {
        const likedTweet = like.Tweet
        return {
          likeCreatedAt: like.createdAt,
          TweetId: likedTweet.id,
          description: likedTweet.description,
          createdAt: likedTweet.createdAt,
          userOflikedTweet: likedTweet.User.id,
          userNameOflikedTweet: likedTweet.User.name,
          userAccountOflikedTweet: likedTweet.User.account,
          userAvatarOflikedTweet: likedTweet.User.avatar,
          repliedCounts: likedTweet.Replies.length,
          likesCounts: likedTweet.Likes.length
        }
      })
      return res.status(StatusCodes.OK).json(likes)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followings' }]
      })
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      let followingsOfUser = user.Followings.map(following => {
        return {
          followingId: following.id,
          userNameOfFollowing: following.name,
          userAvatarOfFollowing: following.avatar,
          userInrtoductionOfFollowing: following.introduction,
          isFollowing: req.user.Followings ? req.user.Followings.some(reqUserFollowing => reqUserFollowing.id === following.id) : false,
          createdAt: following.Followship.createdAt
        }
      })
      followingsOfUser = followingsOfUser.sort((a, b) => b.createdAt - a.createdAt)

      return res.status(StatusCodes.OK).json(followingsOfUser)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const user = await User.findByPk(userId,
        {
          include: [{ model: User, as: 'Followers' }]
        })
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      let followersOfUser = user.Followers.map(follower => {
        return {
          followerId: follower.id,
          userNameOfFollower: follower.name,
          userAvatarOfFollower: follower.avatar,
          userInrtoductionOfFollower: follower.introduction,
          isFollowing: req.user.Followings ? req.user.Followings.some(reqUserFollowing => reqUserFollowing.id === follower.id) : false,
          createdAt: follower.Followship.createdAt
        }
      })
      followersOfUser = followersOfUser.sort((a, b) => b.createdAt - a.createdAt)

      return res.status(StatusCodes.OK).json(followersOfUser)
    } catch (error) {
      next(error)
    }
  },
  getTop10Users: async (req, res, next) => {
    try {
      let users = await User.findAll({
        include: {
          model: User, as: 'Followers'
        }
      })
      users = await users.map(user => user.toJSON())
      users.shift()
      let top10Users = users
        .map(user => ({
          id: user.id,
          name: user.name,
          account: user.account,
          avatar: user.avatar,
          isFollowing: req.user.Followings.some(following => following.id === user.id)
        }))
      top10Users = top10Users.sort((a, b) => b.followersCounts - a.followersCounts).slice(0, 10)

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功取得top10使用者',
        top10Users
      })
    } catch (error) {
      next(error)
    }
  },
  addFollow: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)
      const follower = await User.findByPk(followerId)
      const following = await User.findByPk(followingId)
      if (!follower || !following) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      if (Number(follower.id) === Number(followerId)) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '無法追蹤自己'
        })
      }
      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })
      if (followship) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '使用者已追蹤'
        })
      }
      await Followship.create({
        followerId,
        followingId
      })
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功追蹤'
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollow: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.params.followingId)
      const follower = await User.findByPk(followerId)
      const following = await User.findByPk(followingId)
      if (!follower || !following) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })
      if (!followship) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '使用者尚未追蹤'
        })
      }
      await followship.destroy()
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功取消追蹤'
      })
    } catch (err) {
      next(err)
    }
  },
  userSetting: async (req, res, next) => {
    try {
      const currentUserId = Number(req.user.id)
      const onPageUserId = Number(req.params.id)
      const emailRegex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ //eslint-disable-line
      if (currentUserId !== Number(onPageUserId)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: 'error',
          message: '無法編輯他人資訊'
        })
      }
      const user = await User.findByPk(onPageUserId)
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      const account = req.body.account.trim()
      const password = req.body.password.trim()
      const checkPassword = req.body.checkPassword.trim()
      const name = req.body.name.trim()
      const email = req.body.email.trim()

      if (!account || !name || !email) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '必填欄位不可為空'
        })
      }
      if (!emailRegex.test(email)) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json({
            status: 'error',
            message: '信箱格式不符合'
          })
      }
      if (account !== user.account || email !== user.email) {
        const existUser = await User.findAll({
          where: {
            [Op.or]: [
              { account },
              { email }
            ]
          }
        })
        if (existUser.length > 0) {
          return res.status(StatusCodes.NOT_ACCEPTABLE).json(
            {
              status: 'error',
              message: 'Account或Email已被使用'
            })
        }
      }
      if (account.length > 10) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: 'Account限制為10字元'
          })
      }
      if (name.length > 50) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: 'Name限制為50字元'
          })
      }
      if (password) {
        if (!checkPassword) {
          return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            status: 'error',
            message: '確認密碼不可為空'
          })
        }
        if (password !== checkPassword) {
          return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            status: 'error',
            message: '確認密碼不相符'
          })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await user.update({
          name,
          account,
          email,
          password: hashedPassword
        })

        return res.status(StatusCodes.OK).json({
          status: 'success',
          message: '帳號設定完成'
        })
      }
      await user.update({
        name,
        account,
        email
      })

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '帳號設定完成'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
