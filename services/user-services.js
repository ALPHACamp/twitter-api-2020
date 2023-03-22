const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, sequelize } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../_helpers')

const userServices = {
  signIn: (req, cb) => {
    try {
      const userData = helpers.getUser(req).toJSON()

      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  },
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account?.trim().length === 0 || !name?.trim().length === 0 || !email.trim()?.length === 0 || !password?.trim().length === 0) throw new Error('還有欄位沒填')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不同!')
    if (name && name.length > 50) throw new Error('暱稱上限50字!')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([userAccount, userEmail]) => {
        console.log(userAccount)
        console.log(userEmail)
        if (userAccount) throw new Error('account 已重複註冊!')
        if (userEmail) throw new Error('email 已重複註冊!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        role: 'user',
        password: hash
      }))
      .then(newUser => {
        newUser = newUser.toJSON()
        delete newUser.password
        delete newUser.role
        cb(null, { user: newUser })
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    const userId = req.params.id
    const nowUser = helpers.getUser(req)
    return User.findOne({
      where: { id: userId },
      attributes: [
        'id', 'name', 'account', 'avatar', 'cover', 'introduction',
        [sequelize.literal(`EXISTS (SELECT * FROM Followships WHERE Followships.following_id = User.id AND Followships.follower_id = ${nowUser.id})`), 'isFollowed'],
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetsCounts'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followingCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followerCounts']
      ],
      nest: true,
      raw: true
    })
      .then(getUser => {
        cb(null, getUser)
      })
      .catch(err => cb(err))
  },
  putUser: async (req, cb) => {
    try {
      const userId = req.params.id
      const nowUser = helpers.getUser(req)
      if (Number(userId) !== nowUser.id) throw new Error('無權限修改其他使用者資料')

      const { account, name, email, password, checkPassword, introduction } = req.body
      const { Avatar, Cover } = req.files || {}

      if (!account?.trim().length === 0 || !name?.trim().length === 0 || !email?.trim().length === 0 || !password?.trim().length === 0) throw new Error('還有欄位沒填')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不一樣!')
      if (name && name.length > 50) throw new Error('暱稱上限50字!')

      const [user, userAccount, userEmail, filePathAvatar, filePathCover] = await Promise.all([
        User.findByPk(userId),
        account ? User.findOne({ where: { account }, raw: true }) : Promise.resolve(null),
        email ? User.findOne({ where: { email }, raw: true }) : Promise.resolve(null),
        Avatar ? imgurFileHandler(Avatar[0]) : Promise.resolve(null),
        Cover ? imgurFileHandler(Cover[0]) : Promise.resolve(null)
      ])

      if (userAccount && userAccount.id !== nowUser.id) throw new Error('帳戶名稱已經註冊過!')
      if (userEmail && userEmail.id !== nowUser.id) throw new Error('信箱已經註冊過!')

      const updateUser = await user.update({
        account,
        name,
        email,
        introduction: introduction || user.introduction,
        avatar: filePathAvatar || user.avatar,
        cover: filePathCover || user.cover,
        password: password ? bcrypt.hashSync(password, 10) : user.password
      })
      const newData = updateUser.toJSON()
      delete newData.password
      delete newData.role
      cb(null, { updateUser: newData })
    } catch (err) {
      cb(err)
    }
  },
  getUserTweets: (req, cb) => {
    const nowUser = helpers.getUser(req)
    const userId = req.params.id
    return Tweet.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Tweet,
          attributes: ['id', 'account', 'avatar', 'name']
        }
      ],
      attributes: {
        exclude: ['updatedAt'],
        include: [
          'id',
          'UserId',
          'description',
          'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likeNum'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.user_id = ${nowUser.id} AND Likes.tweet_id = Tweet.id)`), 'isliked']
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        if (!tweets) throw new Error('這篇推文不存在!')
        cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getLikeTweets: async (req, cb) => {
    try {
      const nowUser = helpers.getUser(req)
      const userId = req.params.id
      const LikeTweets = await Like.findAll({
        where: { UserId: userId },
        include: {
          model: Tweet,
          attributes: {
            include: [
              'id', 'UserId', 'description',
              [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyNum'],
              [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likeNum'],
              [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.user_id = ${nowUser.id} AND Likes.tweet_id = Tweet.id)`), 'isliked']
            ]
          },
          include: [{
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          }]
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!LikeTweets) throw new Error('此推文不存在')
      cb(null, LikeTweets)
    } catch (err) {
      cb(err)
    }
  },
  getRepliedTweets: async (req, cb) => {
    try {
      const userId = req.params.id
      const RepliedTweets = await Reply.findAll({
        where: { UserId: userId },
        include: {
          model: Tweet,
          attributes: ['id'],
          include: [{
            model: User,
            attributes: ['id', 'name', 'avatar', 'account']
          }]
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!RepliedTweets) throw new Error('此推文不存在')
      cb(null, RepliedTweets)
    } catch (err) {
      cb(err)
    }
  },
  getUsersFollowings: async (req, cb) => {
    try {
      const userId = req.params.id
      const nowUser = helpers.getUser(req)
      const following = await User.findAll({
        where: {
          id: userId
        },
        attributes: {
          include: [
            'id', 'name', 'avatar', 'account', 'introduction',
            [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.follower_id = ${nowUser.id} AND Followships.following_id = Followings.id)`), 'isFollowed']
          ],
          exclude: ['password', 'role', 'createdAt', 'updatedAt']
        },
        include: [{
          model: User,
          as: 'Followings',
          attributes: ['id', 'name', 'avatar', 'account', 'introduction']
        }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: false
      })
      if (!following) throw new Error('沒有追蹤!')
      cb(null, following)
    } catch (err) {
      cb(err)
    }
  },
  getUsersFollowers: async (req, cb) => {
    try {
      const userId = req.params.id
      const nowUser = helpers.getUser(req)
      const follower = await User.findAll({
        where: {
          id: userId
        },
        attributes: {
          include: [
            'id', 'name', 'avatar', 'account', 'introduction',
            [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.follower_id = ${nowUser.id} AND Followships.following_id = Users.id)`), 'isFollowed']
          ],
          exclude: ['password', 'role', 'createdAt', 'updatedAt']
        },
        include: [{
          model: User,
          as: 'Followers',
          attributes: ['id', 'name', 'avatar', 'account', 'introduction']
        }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: false
      })
      if (!follower) throw new Error('沒有追隨!')
      cb(null, follower)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
