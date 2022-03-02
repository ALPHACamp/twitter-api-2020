const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User, Tweet, Like, Reply } = require('../models')
const Sequelize = require('sequelize')
const { Op } = Sequelize;

module.exports = {
  signin: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()

      switch (true) {
        case (req.originalUrl === '/api/signin' && userData.role !== 'user'):
          throw new Error('帳號不存在！')

        case (req.originalUrl === '/api/admin/signin' && userData.role !== 'admin'):
          throw new Error('帳號不存在！')

        default:
          delete userData.password
          const token = jwt.sign(
            userData, process.env.JWT_SECRET, { expiresIn: '30d' }
          )

          const responseData = { token, user: userData }
          return res.json(responseData)
      }

    } catch (err) { next(err) }
  },

  signup: async (req, res, next) => {
    try {
      // if no any following property within req.body,
      // then just return null instead
      const account = req.body.account ? req.body.account.trim() : null
      const name = req.body.name ? req.body.name.trim() : null
      const email = req.body.email ? req.body.email.trim() : null
      const password = req.body.password ? req.body.password.trim() : null
      const checkPassword = req.body.checkPassword ? req.body.checkPassword.trim() : null

      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error('每個欄位都屬必填!')
      }

      if (name.length > 50) {
        throw new Error('name 不得超過50字!')
      }

      if (password !== checkPassword) {
        throw new Error('密碼欄位必須一致!')
      }

      // in order to handle two exceptions,
      // it's necessary to do two queries to database
      const [userForAccount, userForEmail] = await Promise.all([
        User.findOne({ where: { account }, raw: true }),
        User.findOne({ where: { email }, raw: true })
      ])
      if (userForAccount) throw new Error('account 已重複註冊！')
      if (userForEmail) throw new Error('email 已重複註冊！')

      // hash password with bcrypt.js
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      // create user in database
      const user = await User.create({
        account, name, email, password: hash
      })

      // retrieve complete user data from database
      const responseData = await User.findByPk(user.toJSON().id, { raw: true })
      delete responseData.password

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  getTopUsers: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT_NUMBER = 10
      const DEFAULT_OFFSET_NUMBER = 0
      const selfUser = helpers.getUser(req)
      const selfUserId = selfUser.id
      const fieldsArray = Object.keys(selfUser)
      const followingIdArray = selfUser.Followings.map(f => f.id)

      // retrieve all query strings from HTTP request, and 
      // use their values or fallback default values
      const field = req.query.field ? req.query.field.trim() : 'totalFollowers'
      if (!fieldsArray.includes(field)) {
        throw new Error('提供的欄位並不存在，動作執行失敗!')
      }

      const order = req.query.order ? req.query.order.trim() : 'DESC'
      if (!['ASC', 'DESC'].includes(order)) {
        throw new Error('提供的排序並不存在，動作執行失敗!')
      }

      const limit = Number(req.query.limit) || DEFAULT_LIMIT_NUMBER
      const offset = Number(req.query.offset) || DEFAULT_OFFSET_NUMBER

      // using previous option values to do database query
      const users = await User.findAll({
        where: { id: { [Op.ne]: selfUserId }, role: 'user' },
        order: [[field, order]],
        limit,
        offset,
        attributes: { exclude: ['password'] },
        raw: true
      })

      const responseData = users.map(user => ({
        ...user,
        isFollowed: followingIdArray.some(f => f === user.id)
      }))

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },
  getSelfUser: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req)

      delete userData.password
      delete userData.Followings
      delete userData.Followers

      return res.json(userData)

    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { UserId } = req.params
      const selfUserId = helpers.getUser(req).id

      let user = await User.findByPk(UserId, {
        attributes: { exclude: ['password'] },
        include: [{
          model: User, as: 'Followers',
          where: { id: selfUserId }, required: false
        }],
        nest: true
      })

      user = user.toJSON()

      // add isFollowed
      user.isFollowed = Boolean(user.Followers.length)

      delete user.Followers

      return res.status(200).json(user)

    } catch (err) {
      next(err)
    }
  },
  getTweetsOfUser: async (req, res, next) => {
    try {
      const { UserId } = req.params
      const selfUserId = helpers.getUser(req).id

      const tweets = await Tweet.findAll({
        where: { UserId },
        include: [
          {
            model: User, as: 'UsersFromLikedTweets',
            where: { id: selfUserId }, required: false
          }
        ],
        nest: true,
      })

      const responseData = tweets.map(tweet => {
        tweet = tweet.toJSON()

        // add isLiked to tweet
        tweet.isLiked = Boolean(tweet.UsersFromLikedTweets.length)

        delete tweet.UsersFromLikedTweets

        return tweet
      })

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    // account edit : account name email password checkPassword 
    // profile edit : name introduction cover avatar
    try {
      const selfUser = helpers.getUser(req)
      const selfUserId = selfUser.id
      const UserId = Number(req.params.UserId)

      let { account, email, password, checkPassword } = req.body
      const bodyKeys = Object.keys(req.body)
      const name = req.body.name ? req.body.name.trim() : selfUser.name
      const introduction = req.body.introduction ? req.body.introduction.trim() : selfUser.introduction

      // check UserId and word length
      if (selfUserId !== UserId) throw new Error('無法編輯其他使用者資料')
      if ((introduction && introduction.length > 160) ||
        (name && name.length > 50)) {
        throw new Error('字數超出上限！')
      }

      // getImageFiles : cover , avatar
      const { files } = req
      const filesCover = files ? files.cover : null
      const filesAvatar = files ? files.avatar : null

      // upload to imgur if file exists
      let resImages = await Promise.all([
        filesCover
          ? helpers.imgurFileHandler(files.cover[0])
          : selfUser.cover,
        filesAvatar
          ? helpers.imgurFileHandler(files.avatar[0])
          : selfUser.avatar
      ])

      // get cover & avatar , if resImage is number , it's error
      let [cover, avatar] = resImages.map(resImage => {
        if (resImage instanceof Error) throw resImage
        return resImage
      })

      // find user and count with account & email
      const users = await User.findAll({
        where: { [Op.or]: [{ id: UserId }, { account }, { email }] },
        attributes: { exclude: ['password'] },
        limit: 4
      })

      // check if edit account setting
      const checkBody = bodyKeys.some(bodyKey =>
        bodyKey === 'account' || bodyKey === 'email' ||
        bodyKey === 'password' || bodyKey === 'checkPassword'
      )
      if (checkBody) {
        // match password & hash password
        password = password ? password.trim() : null
        checkPassword = checkPassword ? checkPassword.trim() : null
        account = account ? account.trim() : null
        email = email ? email.trim() : null

        if (!password || !checkPassword) throw new Error('密碼欄位不能空白!')
        if (!account) throw new Error('帳戶欄位不能空白!')
        if (!email) throw new Error('email欄位不能空白!')
        if (password !== checkPassword) throw new Error('密碼欄位必須一致!')

        // get a hash password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        password = hash

        // check repeat
        const repeatCount = users.reduce((counter, user) => {
          if (user.account === account) counter.account++
          if (user.email === email) counter.email++
          return counter
        }, { account: 0, email: 0 })

        // throw email or account error
        if (repeatCount.account > 1 && repeatCount.email > 1) {
          throw new Error('account 和 email 已重覆！')
        }
        if (repeatCount.account > 1) throw new Error('account 已重覆！')
        if (repeatCount.email > 1) throw new Error('email 已重覆！')
      }

      // find self user and update
      const user = users.find(user => user.id === UserId)
      const updatedUser = await user.update({
        name, account, email, password, introduction, cover, avatar
      })
      const responseData = updatedUser.toJSON()

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      const { UserId } = req.params
      const selfUserId = helpers.getUser(req).id

      const likes = await Like.findAll({
        where: { UserId },
        include: [{
          model: Tweet,
          include: [
            { model: User, attributes: { exclude: ['password'] } },
            { model: User, as: 'UsersFromLikedTweets', where: { id: selfUserId }, required: false }
          ]
        }],
        order: [['createdAt', 'DESC']],
        nest: true
      })

      const responseData = likes.map(like => {
        like = like.toJSON()

        // assign following two objects to like
        like.likedTweet = like.Tweet
        like.likedTweet.tweetedUser = like.Tweet.User
        like.likedTweet.isLiked = Boolean(like.Tweet.UsersFromLikedTweets.length)

        // remove unnecessary key properties
        delete like.Tweet
        delete like.likedTweet.User
        delete like.likedTweet.UsersFromLikedTweets

        return like
      })

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  getRepliedTweets: async (req, res, next) => {
    try {
      const { UserId } = req.params
      const replies = await Reply.findAll({
        where: { UserId },
        include: [{
          model: Tweet,
          include: [{ model: User, attributes: { exclude: ['password'] } }]
        }],
        order: [['createdAt', 'DESC']],
        nest: true
      })

      const responseData = replies.map(reply => {
        reply = reply.toJSON()

        // assign following two objects to reply
        reply.repliedTweet = reply.Tweet
        reply.repliedTweet.tweetedUser = reply.Tweet.User

        // remove unnecessary key properties
        delete reply.Tweet
        delete reply.repliedTweet.User

        return reply
      })

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const selfUserId = helpers.getUser(req).id
      const { UserId } = req.params

      const user = await User.findByPk(UserId, {
        include: [{
          // find this following
          model: User, as: 'Followings',
          // I follow this follower
          include: [{
            model: User, as: 'Followers', where: { id: selfUserId },
            // If not, don't delete all data
            required: false,
          }],
          attributes: {
            include: [['id', 'followingId']],
            exclude: ['password']
          }
        }],
        nest: true
      })

      if (!user) throw new Error('使用者不存在！')

      // newer on the top 
      let sortedFollowings = user.Followings.sort((a, b) => {
        return b.Followship.createdAt - a.Followship.createdAt
      })

      // reassemble followers array
      const responseData = sortedFollowings.map(following => {
        following = following.toJSON()

        // If length > 0 , I follow this follower
        const isFollowed = Boolean(following.Followers.length)

        delete following.Followers
        delete following.Followship

        return {
          ...following,
          isFollowed
        }
      })

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const selfUserId = helpers.getUser(req).id
      const { UserId } = req.params

      const user = await User.findByPk(UserId, {
        include: [{
          // find this follower
          model: User, as: 'Followers',
          // I follow this follower
          include: [{
            model: User, as: 'Followers', where: { id: selfUserId },
            // If not, don't delete all data
            required: false,
          }],
          attributes: {
            include: [['id', 'followerId']],
            exclude: ['password']
          }
        }],
        nest: true
      })

      if (!user) throw new Error('使用者不存在！')


      // newer on the top 
      let sortedFollowers = user.Followers.sort((a, b) => {
        return b.Followship.createdAt - a.Followship.createdAt
      })

      // reassemble followers array
      let responseData = sortedFollowers.map(follower => {
        follower = follower.toJSON()

        // If length > 0 , I follow this follower
        const isFollowed = Boolean(follower.Followers.length)

        delete follower.Followers
        delete follower.Followship

        return {
          ...follower,
          isFollowed
        }
      })

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  }
}