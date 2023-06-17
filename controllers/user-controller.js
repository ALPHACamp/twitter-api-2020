if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-felpers')
const { Op } = require('sequelize')

const userController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => { res.json(users) })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    helpers.getUser(req)
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user) throw new Error('getUser查無此人')
        req.user.Followings = req.user.Followings || []
        req.user.Followers = req.user.Followers || []
        user = {
          ...user.toJSON(),
          isFollowing: req.user && req.user.Followings.some(following => following.id === user.id),
          isFollower: req.user && req.user.Followers.some(follower => follower.id === user.id),
          followersCount: user.Followers.length,
          followingsCount: user.Followings.length,
          tweetsCount: user.Tweets.length
        }
        // res.json({ status: 'success', user: user.toJSON() })
        delete user.password
        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getUsersTop: (req, res, next) => {
    return User.findAll({
      where: {
        account: { [Op.not]: 'root' },
        id: { [Op.not]: req.user.id }
      },
      attributes: { exclude: ['password'] },
      include: [{ model: User, as: 'Followers', attributes: { exclude: ['password'] } }]
    })
      .then(usersData => {
        usersData = usersData.map(user => ({
          ...user.toJSON(),
          followersCount: user.Followers.length,
          isFollowing: req.user && req.user.Followings.some(following => following.id === user.id)
        }))
          .sort((a, b) => b.followersCount - a.followersCount)
        usersData = usersData.slice(0, 10)
        res.json(usersData)
      })
      .catch(err => next(err))
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Password do not match!')
    return Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user1, user2]) => {
        if (user1) throw new Error('account 已重複註冊！')
        if (user2) throw new Error('email 已重複註冊！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash,
          avatar: 'https://i.imgur.com/V4RclNb.png',
          banner: 'https://i.imgur.com/ZFz8ZEI.png',
          role: 'user'
        })
      })
      .then(signUpUser => {
        signUpUser = signUpUser.toJSON()
        delete signUpUser.password
        res.json({ status: 'success', signUpUser })
      })
      .catch(err => next(err))
  },
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      // JWT (A, B, C)
      // A: payload, 要打包的資訊; B: 密鑰, 使用.env來寫; C: 設定, 這邊設定有效天數
      // process.env.JWT_SECRET
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  // userRequest #3
  getUserTweets: async (req, res, next) => {
    const userId = Number(req.params.id)
    Promise.all([
      User.findByPk(userId, { raw: true }),
      Tweet.findAll({
        where: { UserId: userId },
        include: [
          // 遇到 model User, 都要小心, 最好使用attributes: ['指定要傳那些資料出去']
          // 或是 使用 attributes: { exclude: ['不要傳出去的'] } }, 但是你不知道會不會傳出去些什麼
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply },
          { model: Like }
        ],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, tweetsData]) => {
        if (!user) throw new Error('getUserTweets說: 沒這人')
        req.user.Likes = req.user.Likes || []
        const tweets = tweetsData.map(t => ({
          ...t.toJSON(),
          repliesCount: t.Replies.length,
          likesCount: t.Likes.length,
          isLike: req.user && req.user.Likes.some(like => like.TweetId === t.id)
        }))
        res.status(200).json(tweets)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId),
      Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          {
            model: Tweet,
            include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
          }
        ],
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, repliesData]) => {
        if (!user) throw new Error('getUserReplies說: 沒這人')
        res.status(200).json(repliesData)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId),
      Like.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          {
            model: Tweet,
            include: [
              { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
              { model: Reply },
              { model: Like }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, likesData]) => {
        if (!user) throw new Error('getUserLikes說: 沒這人')
        const likes = likesData.map(l => ({
          ...l.toJSON(),
          repliesCount: l.Tweet.Replies.length,
          likesCount: l.Tweet.Likes.length
        }))
        res.status(200).json(likes)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    const userId = req.params.id
    return User.findByPk(userId, {
      include: [
        { model: User, as: 'Followings' }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then((followingsData) => {
        if (!followingsData) throw new Error('getUserFollowings說: 沒這人')
        const followings = followingsData.Followings.map(f => ({
          ...f.toJSON(),
          followingId: f.Followship.followingId
        }))
        res.status(200).json(followings)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    const userId = req.params.id
    return User.findByPk(userId, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then((followersData) => {
        if (!followersData) throw new Error('getUserFollowers說: 沒這人')
        const followingsPool = []
        followersData.Followings.forEach(f => {
          followingsPool.push(f.Followship.followingId)
        })
        const followers = followersData.Followers.map(f => ({
          ...f.toJSON(),
          followerId: f.Followship.followerId,
          isfollowing: followingsPool.includes(f.id)
        }))
        res.status(200).json(followers)
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    console.log('-- 進入putUser--')
    const userId = Number(req.params.id)
    let avatarFile, bannerFile
    if (helpers.getUser(req).id !== 1) {
      if (req.files.avatar) {
        avatarFile = req.files.avatar[0]
      }
      if (req.files.banner) {
        bannerFile = req.files.banner[0]
      }
    }
    // 沒有這條, 有了token之後, 就可以亂改他人資料了
    if (userId !== helpers.getUser(req).id) throw new Error('只能改自己的啦')
    const { name, introduction } = req.body
    return Promise.all([
      User.findByPk(userId),
      avatarFile ? imgurFileHandler(avatarFile) : Promise.resolve(),
      bannerFile ? imgurFileHandler(bannerFile) : Promise.resolve()
    ])
      .then(([userData, avatarUrl, bannerUrl]) => {
        if (!userData) throw new Error('putUser說: 沒這人')
        return userData.update({
          name: name || userData.name,
          introduction: introduction || userData.introduction,
          avatar: avatarUrl || userData.avatar,
          banner: bannerUrl || userData.banner
        })
      })
      .then(updatedUser => {
        delete updatedUser.password
        res.status(200).json(updatedUser)
      })
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    const userId = Number(req.params.id)
    // 沒有這條, 有了token之後, 就可以亂改他人資料了
    if (userId !== helpers.getUser(req).id) throw new Error('只能改自己的啦')
    const { name, account, email, password, checkPassword } = req.body
    const passwordLength = password ? password.length : ''
    if (passwordLength > 1) {
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符')
    }
    return Promise.all([
      // 反查, 但是要排除自己的account & email
      User.findOne({ where: { account, id: { [Op.not]: req.user.id } } }),
      User.findOne({ where: { email, id: { [Op.not]: req.user.id } } })
    ])
      .then(([user1, user2]) => {
        if (user1) throw new Error('account 已重複註冊！')
        if (user2) throw new Error('email 已重複註冊！')
        return User.findByPk(userId)
          .then(userData => {
            if (!userData) throw new Error('patchUser說: 沒這人')
            return bcrypt.hash(password, 10)
              .then(hash => {
                return userData.update({
                  name: name || userData.name,
                  account: account || userData.account,
                  email: email || userData.email,
                  password: hash || userData.password
                })
              })
          })
      })
      .then(updatedUser => {
        delete updatedUser.password
        res.status(200).json(updatedUser)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
