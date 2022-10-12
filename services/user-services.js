const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const { Op } = require('sequelize')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helper')

const userServices = {
  signUp: (req, cb) => {
    // 密碼輸入不一致
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    return User.findOne({
      where: { [Op.or]: [{ account: req.body.account }, { email: req.body.email }] }
    })
      .then(user => {
        // 錯誤處理: user已註冊
        if (user) {
          if (user.account === req.body.account) throw new Error('Account already exists!')
          if (user.email === req.body.email) throw new Error('Email already exists!')
        }
        // user未註冊過
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash,
        role: 'user'
      }))
      .then(newUser => cb(null, { newUser }))
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      const userData = getUser(req).toJSON()
      if (userData.role !== 'user') throw new Error('user permission denied')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getTweets: (req, cb) => {
    return Tweet.findAll({
      where: {
        UserId: req.params.id
      },
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        Reply,
        { model: Like, include: User }
      ],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likedCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'repliedCount']
        ]
      },
      order: [['createdAt', 'DESC']],
      nest: true
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: Reply, include: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like, include: Tweet }
      ],
      attributes: {
        include: [[sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount']]
      }
    })
      .then(user => {
        if (!user) {
          const err = new Error("User didn't exist!")
          err.status = 404
          throw err
        }
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  putUserSetting: (req, cb) => {
    const { name, account, email, password, checkPassword } = req.body
    const UserId = getUser(req).dataValues.id
    // 密碼輸入不一致
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    // 資料輸入不完整
    if (!name || !account || !email || !password || !checkPassword) throw new Error('All fields are required.')
    return User.findByPk(UserId)
      .then(user => {
        // 檢查user是否存在
        if (!user) throw new Error("User didn't exist.")
        // 比對account和email的唯一性
        // 如果account或email有更動
        if (account !== user.account || email !== user.email) {
          // 確認DB裡面除了舊資料以外沒有重複的資料
          return User.findAll({
            where: {
              [Op.or]: [{ account }, { email }]
            }
          })
            .then(confirmUser => {
              // db已有重複資料
              if (confirmUser.length > 1) {
                throw new Error('Account or email has already exist.')
              // db除了user的舊資料，未有重複資料
              } else {
                return bcrypt.hash(password, 10)
                  .then(hash => {
                    user.update({
                      name,
                      email,
                      account,
                      password: hash
                    })
                  })
                  .then(updatedUser => cb(null, updatedUser))
                  .catch(err => cb(err))
              }
            })
            .catch(err => cb(err))
          // 如果account、email皆未更動
        } else {
          return bcrypt.hash(password, 10)
            .then(hash => {
              return user.update({
                account,
                name,
                email,
                password: hash
              })
            })
            .then(updatedUser => cb(null, updatedUser))
            .catch(err => cb(err))
        }
      })
      .catch(err => cb(err))
  },
  // putUserProfile: (req, cb) => {
  // const { account, name, email, password, introduction } = req.body
  //   // 找到圖檔的path
  //   const avatarUploaded = req.files?.avatar[0]
  //   const coverPhotoUploaded = req.files?.coverPhoto[0]
  //   return Promise.all([
  //     User.findByPk(req.params.id),
  //     imgurFileHandler(avatarUploaded), // 上傳至imgur
  //     imgurFileHandler(coverPhotoUploaded)
  //   ])
  //     .then(([user, avatarFilePath, coverPhotoFilePath]) => {
  //       if (!user) throw new Error("User didn't exist.")
  //       return user.update({
  //         account: account || user.account,
  //         name: name || user.name,
  //         email: email || user.email,
  //         password: password || user.password,
  //         introduction: introduction || user.introduction,
  //         avatar: avatarFilePath || user.avatar,
  //         coverPhoto: coverPhotoFilePath || user.coverPhoto
  //       })
  //     })
  //     .then(user => {
  //       return cb(null, user)
  //     })
  //     .catch(err => cb(err))
  // },
  getRepliedTweets: (req, cb) => {
    // tweetId, userId, repliedId 看見某使用者發過回覆的推文
    // 新增按讚數+留言數+username
    return Promise.all([User.findByPk(req.params.id), Reply.findAll({
      where: {
        UserId: req.params.id
      },
      include: [
        Tweet,
        { model: User, attributes: ['name', 'account', 'avatar'] }
      ],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likedCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'repliedCount']
        ]
      },
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']]
    })])
      .then(([user, replies]) => {
        if (!user) throw new Error("User didn't exist.")
        return cb(null, replies)
      })
      .catch(err => cb(err))
  },
  getLikes: (req, cb) => {
    // 看見某使用者點過 Like的推文(text)
    return Promise.all([
      User.findByPk(req.params.id),
      Like.findAll({
        where: {
          UserId: req.params.id
        }
      })
    ])
      .then(([user, likedTweet]) => {
        if (!user) {
          const err = new Error("User didn't exist!")
          err.status = 404
          throw err
        }
        return cb(null, likedTweet)
      })
      .catch((err) => cb(err))
  },
  getFollowings: (req, cb) => {
    // 看見某使用者跟隨中的人
    return Promise.all([
      User.findByPk(req.params.id),
      Followship.findAll({
        where: {
          followerId: req.params.id
        }
      })
    ])
      .then(([user, following]) => {
        if (!user) throw new Error("User didn't exist.")
        if (!following) throw new Error("This user isn't following anyone.")
        return cb(null, following)
      })
      .catch(err => cb(err))
  },
  getFollowers: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Followship.findAll({
        where: {
          followingId: req.params.id
        }
      })
    ])
      .then(([user, follower]) => {
        if (!user) throw new Error("User didn't exist.")
        if (!follower) throw new Error('This user has no followers.')
        return cb(null, follower)
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices
