const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const { catchError } = require('../utils/errorHandling')
const db = require('../models')

const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const sequelize = db.sequelize

module.exports = {
  login: (req, res) => {
    const { account, password } = req.body
    // validate user input
    if (!account || !password) {
      return res.status(400).json({ status: 'error', message: "Required fields didn't exist." })
    }
    // validate account and password
    User.findOne({ where: { account } }).then(user => {
      if (!user) return res.status(400).json({ status: 'error', message: 'Account does not exist.' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ status: 'error', message: 'Passwords does not match.' })
      }
      if (user.role === 'admin') {
        return res.status(403).json({ status: 'error', message: 'User only. Administrator permission denied.' })
      }
      // issue a token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          introduction: user.introduction,
          role: user.role,
          account: user.account,
          cover: user.cover,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  },

  register: (req, res) => {
    const { email, password, name, account, checkPassword } = req.body

    const message = []

    // all input required
    if (!email || !password || !name || !account || !checkPassword) {
      message.push('Please complete all fields')
    }
    // check password
    if (checkPassword !== password) {
      message.push('Password and checkPassword are not match')
    }
    // check email
    if (email && !validator.isEmail(email)) {
      message.push('Invalid email address')
    }
    // check name length <= 25
    if (name && !validator.isByteLength(name, { min: 0, max: 25 })) {
      message.push('The name field can have no more than 25 characters')
    }
    // check email length <= 255
    if (email && !validator.isByteLength(email, { min: 0, max: 255 })) {
      message.push('The email field can have no more than 255 characters')
    }
    // check account length <= 255
    if (account && !validator.isByteLength(account, { min: 0, max: 255 })) {
      message.push('The account field can have no more than 255 characters')
    }
    // check password length <=255
    if (password && !validator.isByteLength(password, { min: 0, max: 255 })) {
      message.push('The password field can have no more than 255 characters')
    }
    if (message.length !== 0) {
      return res.status(400).json({ status: 'error', message })
    }

    // check if account and email used already
    const findByAccount = User.findOne({ where: { account: account } })
    const findByEmail = User.findOne({ where: { email: email } })
    return Promise.all([findByAccount, findByEmail])
      .then(values => {
        const [accountUser, emailUser] = [...values]
        if (accountUser) {
          message.push('Account already exist')
        }
        if (emailUser) {
          message.push('Email alreay exist')
        }
        if (message.length !== 0) {
          return res.status(400).json({ status: 'error', message })
        } else {
          User.create({
            email: email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
            name: name,
            account: account
          })
            .then(newUser => {
              return res.status(200).json({ status: 'success', message: 'Registered' })
            })
            .catch(error => {
              const data = { status: 'error', message: error.toString() }
              console.log(error)
              return res.status(500).json(data)
            })
        }
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  },

  getCurrentUser: (req, res) => {
    if (!req.user) {
      const data = { status: 'error', message: 'Current user not found.' }
      return res.status(404).json(data)
    }
    const { id, name, account, email, avatar } = req.user
    const user = { id, name, account, email, avatar }
    user.isAdmin = req.user.role === 'admin'
    return res.status(200).json({ currentUser: user })
  },

  getUser: (req, res) => {
    const { id } = req.params
    if (!validator.isNumeric(id, { no_symbols: true })) {
      const data = { status: 'error', message: 'id should be an integer.' }
      return res.status(400).json(data)
    }
    return User.findByPk(
      id,
      {
        attributes: ['id', 'account', 'name', 'email', 'introduction', 'avatar', 'cover', 'role'],
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      }
    )
      .then(user => {
        if (!user) {
          const data = { status: 'error', message: 'User not found.' }
          return res.status(404).json(data)
        }
        if (user.dataValues.role === 'admin') {
          const data = { status: 'error', message: 'Cannot view administrator.' }
          return res.status(400).json(data)
        }
        const data = {
          id: user.dataValues.id,
          account: user.dataValues.account,
          name: user.dataValues.name,
          email: user.dataValues.email,
          introduction: user.dataValues.introduction,
          avatar: user.dataValues.avatar,
          cover: user.dataValues.cover,
          tweetCount: user.Tweets.length,
          followingCount: user.Followings.length,
          followerCount: user.Followers.length,
          isFollowed: user.Followers.map(follower => follower.dataValues.id).includes(req.user.id)
        }
        return res.status(200).json(data)
      })
      .catch(error => {
        catchError(res, error)
      })
  },

  getTopUsers: (req, res) => {
    return User.findAll({
      attributes: [
        'id',
        'account',
        'name',
        'avatar',
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'),
          'followerCount'
        ]
      ],
      where: { role: 'user' },
      include: [{ model: User, as: 'Followers' }],
      order: [[sequelize.literal('followerCount'), 'DESC']],
      limit: 10
    })
      .then((users) => {
        if (!users) {
          return res.status(200).json(null)
        }
        const data = users.map(user => ({
          id: user.dataValues.id,
          account: user.dataValues.account,
          name: user.dataValues.name,
          avatar: user.dataValues.avatar,
          followerCount: user.dataValues.followerCount,
          isFollowed: user.Followers.map(follower => follower.id).includes(req.user.id)
        }))
        return res.status(200).json(data)
      })
      .catch(error => {
        catchError(res, error)
      })
  },

  getFollowings: (req, res) => {
    /*
    TODO: 優化方向：撈 followings 資料時，一併以該筆 followship 建立的時間 DESC 排序。
    痛點：User model 和 Followship model 之間並未建立關聯。
    */
    const { id } = req.params
    if (!validator.isNumeric(id, { no_symbols: true })) {
      const data = { status: 'error', message: 'id should be an integer.' }
      return res.status(400).json(data)
    }
    const findFollowingsOrderByFollowshipCreatedAtDESC = Followship.findAll({
      raw: true,
      attributes: ['followingId'],
      where: { followerId: id },
      order: [['createdAt', 'DESC']]
    })
    const findUserAndHisFollowings = User.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Followings',
          include: [{ model: User, as: 'Followers' }]
        }
      ]
    })
    return Promise.all([findFollowingsOrderByFollowshipCreatedAtDESC, findUserAndHisFollowings])
      .then((values) => {
        const [order, user] = values
        if (user.Followings.length === 0) {
          return res.status(200).json(null)
        }
        const followings = user.Followings.map(following => ({
          id: following.dataValues.id,
          name: following.dataValues.name,
          account: following.dataValues.account,
          avatar: following.dataValues.avatar,
          introduction: following.dataValues.introduction,
          ifFollowed: following.Followers.map(follower => follower.dataValues.id).includes(req.user.id)
        }))
        // order followings by createdAt column of followships table
        // time O(n^2)?
        const orderedFollowings = []
        order.forEach(item => {
          const index = followings.findIndex(following => following.id === order.followingId)
          orderedFollowings.push(followings.splice(index, 1)[0])
        })
        return res.status(200).json(orderedFollowings)
      })
      .catch(error => {
        catchError(res, error)
      })
  },

  getUserTweets: (req, res) => {
    const { id } = req.params
    if (!validator.isNumeric(id, { no_symbols: true })) {
      const data = { status: 'error', message: 'id should be an integer.' }
      return res.status(400).json(data)
    }
    Tweet.findAll({
      where: { UserId: id },
      attributes: ['id', 'description', 'createdAt'],
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Reply, attributes: ['id'] },
        { model: Like, attributes: ['UserId'] }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      if (!tweets) {
        const data = { status: 'error', message: 'Tweet not found.' }
        return res.status(404).json(data)
      }
      const userTweet = []
      tweets.forEach(tweet => {
        const data = {}
        data.id = tweet.dataValues.id
        data.description = tweet.dataValues.description
        data.createdAt = tweet.dataValues.createdAt
        data.replyCount = tweet.Replies.length
        data.likeCount = tweet.Likes.length
        data.isLiked = tweet.Likes.map(like => like.UserId).includes(req.user.id)
        data.User = tweet.dataValues.User.dataValues
        userTweet.push(data)
      })

      return res.status(200).json(userTweet)
    })
      .catch(error => {
        catchError(res, error)
      })
  },

  getRepliesOfTweet: (req, res) => {
    const { id } = req.params
    if (!validator.isNumeric(id, { no_symbols: true })) {
      const data = { status: 'error', message: 'id should be an integer.' }
      return res.status(400).json(data)
    }
    return Reply.findAll({
      where: { UserId: id },
      attributes: ['id', 'comment', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [
        { model: Tweet, include: [User, Reply, Like] }
      ]
    })
      .then(replies => {
        if (replies.length === 0) {
          return res.status(200).json(null)
        }
        const repliesOfTweet = []
        replies.forEach(reply => {
          const tweet = reply.dataValues.Tweet
          const data = {
            ReplyId: reply.dataValues.id,
            comment: reply.dataValues.comment,
            createdAt: reply.dataValues.createdAt
          }
          if (!tweet) { // ex: tweet was deleted
            data.Tweet = null
          } else {
            data.Tweet = {
              TweetId: tweet.dataValues.id,
              description: tweet.dataValues.description,
              createdAt: tweet.dataValues.createdAt,
              replyCount: tweet.dataValues.Replies.length,
              likeCount: tweet.dataValues.Likes.length,
              isLiked: tweet.dataValues.Likes
                .map(like => like.dataValues.UserId).includes(req.user.id),
              User: {
                id: tweet.User.id,
                account: tweet.User.account,
                name: tweet.User.name,
                avatar: tweet.User.avatar
              }
            }
          }
          repliesOfTweet.push(data)
        })
        return res.status(200).json(repliesOfTweet)
      })
      .catch(error => {
        catchError(res, error)
      })
  },

  getLikedTweet: (req, res) => {
    const { id } = req.params
    if (!validator.isNumeric(id, { no_symbols: true })) {
      const data = { status: 'error', message: 'id should be an integer.' }
      return res.status(400).json(data)
    }
    const findTweet = Tweet.findAll({
      attributes: ['id', 'description', 'createdAt'],
      order: [[Like, 'createdAt', 'DESC']],
      include: [
        User,
        Reply,
        { model: Like, where: { UserId: id } }
      ]
    })
    const findLike = Like.findAll({ raw: true, attributes: ['TweetID', 'UserId'] })
    return Promise.all([findTweet, findLike])
      .then(valuse => {
        const [tweets, likes] = valuse
        if (tweets.length === 0) {
          return res.status(200).json(null)
        }
        const likedTweets = []
        tweets.forEach(tweet => {
          const likedUser = likes.filter(like => like.TweetID === tweet.dataValues.id)
            .map(like => like.UserId)
          const data = {
            TweetId: tweet.dataValues.id,
            description: tweet.dataValues.description,
            createdAt: tweet.dataValues.createdAt,
            replyCount: tweet.dataValues.Replies.length,
            likeCount: likedUser.length,
            isLiked: likedUser.includes(req.user.id),
            User: {
              id: tweet.dataValues.User.id,
              account: tweet.dataValues.User.account,
              name: tweet.dataValues.User.name,
              avatar: tweet.dataValues.User.avatar
            }
          }
          likedTweets.push(data)
        })
        return res.status(200).json(likedTweets)
      })
      .catch(error => {
        catchError(res, error)
      })
  }
}
