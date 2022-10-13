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
    const id = req.params.id
    return Promise.all([
      Tweet.findAll({
        where: { UserId: id },
        attributes: ['id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likedCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'),
            'repliedCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.user_id = ${getUser(req).dataValues.id} AND Likes.tweet_id = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      User.findByPk(id, { raw: true, nest: true })
    ])
      .then(([tweets, user]) => {
        if (!tweets.length) return cb(null, [])
        const data = tweets.map(t => ({
          id: t.id,
          userData: {
            id: user.id,
            account: user.account,
            name: user.name,
            avatar: user.avatar
          },
          description: t.description,
          repliedCount: t.repliedCount,
          likedCount: t.likedCount,
          isLiked: Boolean(t.isLiked),
          createdAt: t.createdAt
        }))
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' }
      ],
      attributes: {
        include: [[sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount']]
      }
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        const { Followers, ...userData } = {
          ...user.toJSON(),
          isFollowed: user.Followers.some(user => user.id === getUser(req).dataValues.id)
        }
        return cb(null, userData)
      })
      .catch(err => cb(err))
  },
  putUserSetting: (req, cb) => {
    const { name, account, email, password, checkPassword } = req.body
    const UserId = getUser(req).dataValues.id
    if (Number(req.params.id) !== Number(UserId)) throw new Error('Not authorized to edit.')
    // 密碼輸入不一致
    if (password !== checkPassword) throw new Error('Passwords do not match!')
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
  putUser: (req, cb) => {
    const { name, introduction } = req.body
    const UserId = getUser(req).dataValues.id
    // 找到圖檔的path
    const avatarUploaded = req.body.avatar
    const coverPhotoUploaded = req.body.coverPhoto
    if (Number(req.params.id) !== Number(UserId)) throw new Error('Not authorized to edit.')
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(avatarUploaded), // 上傳至imgur
      imgurFileHandler(coverPhotoUploaded)
    ])
      .then(([user, avatarFilePath, coverPhotoFilePath]) => {
        if (!user) throw new Error("User didn't exist.")
        return user.update({
          name: name || user.name,
          introduction: introduction || user.introduction,
          avatar: avatarFilePath || user.avatar,
          coverPhoto: coverPhotoFilePath || user.coverPhoto
        })
      })
      .then(user => {
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  getRepliedTweets: (req, cb) => {
    // tweetId, userId, repliedId 看見某使用者發過回覆的推文
    // 新增按讚數+留言數+使用者reply +tweet被回覆的 username/account
    return Promise.all([User.findByPk(req.params.id), Reply.findAll({
      where: {
        UserId: req.params.id
      },
      include: {
        model: Tweet,
        include: [
          { model: User, attributes: ['name', 'account', 'id'] }
        ]
      },
      attributes: [
        'id',
        'comment',
        'TweetId',
        'UserId',
        'createdAt',
        'updatedAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'repliedCount']
      ],
      order: [['createdAt', 'DESC']],
      nest: true
    })
    ])
      .then(([user, replies]) => {
        if (!user) throw new Error("User didn't exist.")
        if (!replies.length) return cb(null, [])
        const repliedData = replies.map(r => ({
          id: r.id,
          comment: r.comment,
          TweetId: r.TweetId,
          UserId: r.UserId,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          likedCount: r.likedCount,
          repliedCount: r.repliedCount,
          description: r.Tweet.description,
          userData: {
            id: r.Tweet.User.id,
            name: r.Tweet.User.name,
            account: r.Tweet.User.account
          }
        }))
        return cb(null, repliedData)
      })
      .catch(err => cb(err))
  },
  getLikes: (req, cb) => {
    // 看見某使用者點過 Like的推文(text)
    const id = req.params.id
    return Like.findAll({
      where: { UserId: id },
      include: {
        model: Tweet,
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        attributes: ['id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likedCount'],
          [sequelize.literal('(SELECT COUNT(*)  FROM Replies WHERE Replies.tweet_id = Tweet.id)'),
            'repliedCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.user_id = ${getUser(req).dataValues.id} AND Likes.tweet_id = Tweet.id)`), 'isLiked']
        ]
      },
      order: [['createdAt', 'Desc']],
      raw: true,
      nest: true
    })
      .then(likes => {
        if (!likes.length) return cb(null, [])
        const data = likes.map(l => ({
          TweetId: l.Tweet.id,
          userData: {
            id: l.Tweet.User.id,
            account: l.Tweet.User.account,
            name: l.Tweet.User.name,
            avatar: l.Tweet.User.avatar
          },
          description: l.Tweet.description,
          repliedCount: l.Tweet.repliedCount,
          likedCount: l.Tweet.likedCount,
          isLiked: Boolean(l.Tweet.isLiked),
          createdAt: l.Tweet.createdAt,
          likedCreatedAt: l.createdAt
        }))
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getFollowings: (req, cb) => {
    // 看見某使用者跟隨中的人
    return Promise.all([
      User.findByPk(req.params.id, {
        include: { model: User, as: 'Followings' }
      }),
      Followship.findAll({
        where: { followerId: getUser(req).dataValues.id },
        raw: true,
        nest: true
      })
    ])
      .then(([user, following]) => {
        if (!user) throw new Error("User didn't exist.")
        const currentUserFollowing = following.map(f => f.followingId)
        const userFollowingData = user.Followings.map(f => ({
          followingId: f.id,
          account: f.account,
          name: f.name,
          avatar: f.avatar,
          introduction: f.introduction,
          isFollowed: currentUserFollowing.some(id => id === f.id)
        }))
        return cb(null, userFollowingData)
      })
      .catch(err => cb(err))
  },
  getFollowers: (req, cb) => {
    // 看見某使用者的跟隨者
    return Promise.all([
      User.findByPk(req.params.id, {
        include: { model: User, as: 'Followers' }
      }),
      Followship.findAll({
        where: { followerId: getUser(req).dataValues.id },
        raw: true,
        nest: true
      })
    ])
      .then(([user, following]) => {
        if (!user) throw new Error("User didn't exist.")
        const currentUserFollowing = following.map(f => f.followingId)
        const userFollowerData = user.Followers.map(f => ({
          followerId: f.id,
          account: f.account,
          name: f.name,
          avatar: f.avatar,
          introduction: f.introduction,
          isFollowed: currentUserFollowing.some(id => id === f.id)
        }))
        return cb(null, userFollowerData)
      })
      .catch(err => cb(err))
  },
  getCurrentUser: (req, cb) => {
    return User.findByPk(getUser(req).dataValues.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    })
      .then(user => cb(null, user))
      .catch(err => cb(err))
  }
}

module.exports = userServices
