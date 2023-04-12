const { User, Tweet, Reply, Like, Followship } = require('../models')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

// 為配合資料表外鍵設計，所以統一命名為 userId -> UserId, tweetId -> TweetId

const userController = {
  signin: (req, res, next) => {
    try {
      const user = helpers.getUser(req).toJSON()
      // sign a token (payload + key)
      if (user?.role === 'admin') throw new Error('此帳號不存在')
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data:
          {
            token,
            user
          }
      })
    } catch (error) {
      next(error)
    }
  },
  signup: (req, res, next) => {
    const { name, email, password, checkPassword, account } = { ...req.body }
    if (!email || !password || !checkPassword || !account.trim() || !name.trim()) throw new Error('所有欄位皆須填寫')
    if (name.length > 50) throw new Error('名稱的字數超過上限 50 個字!')
    if (password !== checkPassword) throw new Error('密碼與重新輸入密碼不相符!')

    return Promise.all([
      User.findOne({ where: { email }, attribute: 'email' }),
      User.findOne({ where: { account }, attribute: 'account' })
    ])
      .then(([isEmail, isAccount]) => {
        if (isEmail) throw new Error('email 已重複註冊！')
        if (isAccount) throw new Error('account 已重複註冊！')

        delete req.body.checkPassword
        return User.create({
          ...req.body,
          password: bcrypt.hashSync(password, 10),
          attributes: { exclude: ['email', 'account'] }
        })
      })
      .then(user => {
        user = user.toJSON()
        delete user.password

        res.status(200).json({
          status: 'success',
          message: '註冊成功、請先登入',
          data: user
        })
      })
      .catch(error => next(error))
  },
  getUser: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (user?.role === 'admin') throw new Error('此帳號不存在')
        delete user.password
        user.isFollowing = helpers.getUser(req).Followings.some(f => f.id === user.id)
        res.status(200).json(user)
      })
      .catch(error => next(error))
  },
  putUser: (req, res, next) => {
    const UserId = req.params.id
    const { name, account, email, password, checkPassword, introduction } = req.body
    // setting page
    if (account || email || password) {
      if (!name.trim() || !account.trim() || !email || !password || !checkPassword) throw new Error('所有欄位皆須填寫')
      if (name.length > 50) throw new Error('名稱的字數超過上限 50 個字!')
      if (password !== checkPassword) throw new Error('密碼與重新輸入密碼不相符!')
      return Promise.all([
        User.findByPk(UserId),
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
        .then(([user, userAccount, userEmail]) => {
          const existedAccount = userAccount ? Number(userAccount.dataValues.id) : Number(UserId)
          const existedEmail = userEmail ? Number(userEmail.dataValues.id) : Number(UserId)
          if (user?.role === 'admin') throw new Error('此帳號不存在')
          if (existedAccount !== Number(UserId)) throw new Error('account 已存在')
          if (existedEmail !== Number(UserId)) throw new Error('email 已存在')
          return user.update({ name, account, email, password: bcrypt.hashSync(password, 10) })
            .then(editedData => res.status(200).json({
              status: 'success',
              message: '修改成功'
            }))
            .catch(error => next(error))
        })
        .catch(error => next(error))
    // user information page
    } else {
      if (!name.trim() || !introduction) throw new Error('名稱、自我介紹皆須填寫')
      if (name.length > 50) throw new Error('名稱的字數超過上限 50 個字!')
      if (introduction.length > 160) throw new Error('自我介紹的字數超過上限 160 個字!')
      const image = req.files?.image ? req.files.image[0] : null
      const backgroundImage = req.files?.backgroundImage ? req.files.backgroundImage[0] : null
      return Promise.all([
        User.findByPk(UserId),
        imgurFileHandler(image),
        imgurFileHandler(backgroundImage)
      ])
        .then(([user, imageFilePath, backgroundFilePath]) => {
          if (user?.role === 'admin') throw new Error('此帳號不存在')
          return user.update({ name, introduction, image: imageFilePath || user.image, backgroundImage: backgroundFilePath || user.backgroundImage })
            .then(user => res.status(200).json(user))
            .catch(error => next(error))
        })
        .catch(error => next(error))
    }
  },
  getTweets: (req, res, next) => {
    const UserId = req.params.id
    return Tweet.findAll({
      where: { UserId },
      include: [User, Reply, Like],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const tweetData = tweets.map(tweet => ({
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          replyNum: tweet.Replies.length,
          likeNum: tweet.Likes.length,
          isLiked: tweet.Likes.some(like => like.UserId === req.user.id),
          user: {
            name: tweet.User.name,
            account: tweet.User.account,
            image: tweet.User.image
          }
        }))
        return res.status(200).json(tweetData)
      })
      .catch(error => next(error))
  },
  getRepliedTweets: (req, res, next) => {
    const UserId = req.params.id
    return Reply.findAll({
      where: { UserId },
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        const repliedData = replies.map(reply => ({
          id: reply.id,
          comment: reply.comment,
          UserId: reply.UserId,
          TweetId: reply.TweetId,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          user: {
            name: reply.User.name,
            account: reply.User.account,
            image: reply.User.image
          }
        }))
        return res.status(200).json(repliedData)
      })
      .catch(error => next(error))
  },
  getLikes: (req, res, next) => {
    const UserId = req.params.id
    return Like.findAll({
      where: { UserId },
      include: [{
        model: Tweet,
        include: [User, Reply, Like]
      }],
      order: [['createdAt', 'DESC']]
    })
      .then(likes => {
        const likedData = likes.map(like => ({
          id: like.id,
          UserId: like.UserId,
          TweetId: like.TweetId,
          isLiked: like.isLiked,
          createdAt: like.createdAt,
          updatedAt: like.updatedAt,
          description: like.Tweet.description,
          replyNum: like.Tweet.Replies.length,
          likeNum: like.Tweet.Likes.length,
          user: {
            id: like.Tweet.User.id,
            name: like.Tweet.User.name,
            account: like.Tweet.User.account,
            image: like.Tweet.User.image
          }
        }))
        return res.status(200).json(likedData)
      })
      .catch(error => next(error))
  },
  getFollowings: (req, res, next) => {
    const UserId = Number(req.params.id)
    const getUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(UserId, {
        include: [{ model: User, as: 'Followings' }],
        order: [['Followings', Followship, 'createdAt', 'DESC']]
      }),
      Followship.findAll({
        where: { followerId: UserId },
        raw: true
      })
    ])
      .then(([user, followings]) => {
        if (user?.role === 'admin') throw new Error('此帳號不存在')
        if (!followings.length) res.status(200).json(followings)
        const followingData = user.Followings.map(fg => ({
          id: fg.id,
          name: fg.name,
          account: fg.account,
          image: fg.image,
          introduction: fg.introduction,
          followingId: fg.id,
          followerId: UserId,
          isFollowing: getUser.Followings.some(f => f.id === fg.id)
        }))
        return res.status(200).json(followingData)
      })
      .catch(error => next(error))
  },
  getFollowers: (req, res, next) => {
    const UserId = Number(req.params.id)
    const getUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(UserId, {
        include: [{ model: User, as: 'Followers' }],
        order: [['Followers', Followship, 'createdAt', 'DESC']]
      }),
      Followship.findAll({
        where: { followingId: UserId },
        raw: true
      })
    ])
      .then(([user, followers]) => {
        if (user?.role === 'admin') throw new Error('此帳號不存在')
        if (!followers.length) res.status(200).json(followers)
        const followerData = user.Followers.map(fr => ({
          id: fr.id,
          name: fr.name,
          account: fr.account,
          image: fr.image,
          introduction: fr.introduction,
          followingId: UserId,
          followerId: fr.id,
          isFollowing: getUser.Followings.some(f => f.id === fr.id)
        }))
        return res.status(200).json(followerData)
      })
      .catch(error => next(error))
  },
  getTopUsers: (req, res, next) => {
    const getUser = helpers.getUser(req)
    return User.findAll({
      include: [{ model: User, as: 'Followers', attributes: ['id'] }],
      attributes:
        { exclude: ['createdAt', 'updatedAt'] },
      where: {
        account: {
          [Op.notIn]: [getUser.account, 'root']
        }
      }
    })
      .then(users => {
        const topUsers = users.map(user => ({
          id: user.id,
          name: user.name,
          account: user.account,
          image: user.image,
          isFollowing: getUser.Followings.some(f => f.id === user.id),
          followerNum: user.Followers.length
        }))
          .sort((a, b) => b.followerNum - a.followerNum)
          .slice(0, 10)
        return res.status(200).json(topUsers)
      })
      .catch(error => next(error))
  },
  currentUser: (req, res, next) => {
    try {
      const { id, account, email, name, role, image } = helpers.getUser(req)
      if (role === 'admin') throw new Error('此帳號不存在')
      const currentUser = {
        id, account, email, name, role, image
      }

      res.status(200).json({
        status: 'success',
        data: currentUser
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
