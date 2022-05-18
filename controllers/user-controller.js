const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')

const { User, Tweet, Followship, Reply, Like } = require('../models')

const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    // make sure all fields are filled
    if (!account || !password) throw new Error('帳號和密碼為必填！')

    User.findOne({ where: { account } })
      .then(user => {
        if (!user || user.role === 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password)) { throw new Error('密碼錯誤！') }
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })
        return res.status(200).json({
          message: '成功登入！',
          token,
          user: userData
        })
      })
      .catch(err => next(err))
  },

  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符！')
    if (!account || !name || !email || !password || !checkPassword) { throw new Error('此欄位不可空白！') }

    // 確認資料裡面沒有相同的 email，若有，就建立一個 Error 物件並拋出
    User.findAll({
      $or: [{ where: { email } }, { where: { account } }]
    })
      .then(users => {
        if (users.some(u => u.email === email)) { throw new Error('此 Email 已被註冊！') }
        if (users.some(u => u.account === account)) { throw new Error('此帳號已被註冊！') }
        if (name.length > 50 || account.length > 50) { throw new Error('字數上限為 50 個字！') }

        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash,
          role: ''
        })
      })
      .then(newUser => {
        const userData = newUser.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })
        return res.status(200).json({
          message: '成功註冊！',
          token,
          user: userData
        })
      })
      .catch(err => next(err))
  },

  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    return User.findByPk(userId, {
      include: [
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user || user.role === 'admin') throw new Error('帳號不存在！')
        const { id, account, name, email, introduction, avatar, cover, createdAt } = user
        return res.status(200).json({
          message: '成功取得使用者資料！',
          id,
          account,
          name,
          email,
          introduction,
          avatar,
          cover,
          createdAt,
          tweetCount: user.Tweets.length,
          followingCount: user.Followings.length,
          followerCount: user.Followers.length
        })
      })
      .catch(err => next(err))
  },

  getCurrentUser: (req, res, next) => {
    try {
      const userData = (({ id, account, name, email, avatar, role }) => ({ id, account, name, email, avatar, role }))(helpers.getUser(req))
      return res.status(200).json({ message: '成功取得目前登入的使用者資料！', userData })
    } catch (err) {
      next(err)
    }
  },

  getTopUsers: (req, res, next) => {
    const userId = Number(req.params.id)
    const reqUserId = helpers.getUser(req).id
    return User.findAll({
      include: { model: User, as: 'Followers' },
      attributes: ['id', 'account', 'name', 'avatar', 'createdAt'],
      where: { role: '' }
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id),
            owner: reqUserId !== userId
          }))
          .sort((a, b) => b.followerCount - a.followerCount || b.createdAt - a.createdAt)
          .slice(0, 10)

        result.forEach(r => {
          delete r.Followers
        })

        return res.status(200).json({ message: '成功取得前十位最多追蹤者的使用者資料！', result })
      })
      .catch(err => next(err))
  },

  putUserSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const userId = Number(req.params.id)
    const reqUserId = helpers.getUser(req).id

    if (userId !== reqUserId) throw new Error('使用者只能修改自己的資料！')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符！')
    if (!account) throw new Error('帳號欄位不可空白！')
    if (!name) throw new Error('名稱欄位不可空白！')
    if (!email) throw new Error('Email 欄位不可空白！')
    if (!password) throw new Error('密碼欄位不可空白！')
    if (!checkPassword) throw new Error('確認密碼欄位不可空白！')
    if (name.length > 50 || account.length > 50) { throw new Error('字數上限為 50 個字！') }

    return Promise.all([
      User.findAll({ $or: [{ where: { email } }, { where: { account } }] }),
      User.findByPk(userId, {
        attributes: ['id', 'account', 'name', 'email', 'password', 'createdAt']
      }),
      bcrypt.hash(password, 10)
    ])
      .then(([checkUsers, user, hash]) => {
        if (!user) throw new Error('帳號不存在！')
        if (checkUsers.some(u => u.email === email && u.id !== reqUserId)) { throw new Error('此 Email 已被註冊！') }
        if (checkUsers.some(u => u.account === account && u.id !== reqUserId)) { throw new Error('此帳號已被註冊！') }
        return user.update({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(updatedUser => res.status(200).json({ message: '成功編輯使用者個人資料！', user: updatedUser }))
      .catch(err => next(err))
  },

  putUser: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const reqUser = helpers.getUser(req).id

      const { name, introduction } = req.body
      const { files } = req
      if (!name || !introduction) throw new Error('名字和自介欄位不可空白！')
      if (name.length > 50) throw new Error('名稱欄位字數上限為 50 個字！')
      if (introduction.length > 160) throw new Error('自介欄位字數上限為 160 個字！')

      let avatar = files?.avatar || null
      let cover = files?.cover || null
      if (avatar) avatar = await imgurFileHandler(avatar[0])
      if (cover) cover = await imgurFileHandler(cover[0])

      const user = await User.findByPk(UserId)
      const data = await user.update({
        name,
        introduction,
        avatar: avatar || reqUser.avatar,
        cover: cover || reqUser.cover
      })
      res.status(200).json({ message: '成功編輯使用者資料！', data })
    } catch (err) {
      next(err)
    }
  },

  getUsersTweets: (req, res, next) => {
    const UserId = Number(req.params.id)
    Promise.all([
      Tweet.findAll({
        where: { UserId },
        attributes: {
          include: [
            [Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Tweet.id = Replies.Tweet_id )'), 'replyCount'],
            [Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Tweet.id = Likes.Tweet_id)'), 'likeCount']
          ]
        },
        include: [
          { model: User, as: 'TweetUser', attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      User.findByPk(UserId)
    ])

      .then(([tweets, user]) => {
        if (!user) throw new Error('使用者不存在！')
        if (tweets.length <= 0) throw new Error('該使用者沒有推文！')
        const likedTweetId = helpers.getUser(req)?.LikedTweets ? helpers.getUser(req).LikedTweets.map(l => l.id) : []
        const tweetList = tweets.map(data => ({
          ...data,
          isLiked: likedTweetId.some(item => item === data.id)
        }))
        res.status(200).json(tweetList)
      })
      .catch(err => next(err))
  },

  getUsersReplies: (req, res, next) => {
    const UserId = Number(req.params.id)
    Promise.all([
      Reply.findAll({
        where: { UserId },
        attributes: ['id', 'UserId', 'TweetId', 'comment', 'createdAt', 'updatedAt'],
        include: [
          { model: User, as: 'ReplyUser', attributes: ['id', 'name', 'account', 'avatar'] },
          {
            model: Tweet,
            include: [{ model: User, as: 'TweetUser', attributes: ['id', 'name', 'account'] }]
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      User.findByPk(UserId)
    ])
      .then(([replies, user]) => {
        if (!user) throw new Error('使用者不存在！')
        if (replies.length <= 0) throw new Error('該使用者沒有回覆！')
        const replyList = replies.map(data => ({
          ...data,
          Tweet: { id: data.Tweet.id },
          TweetUser: data.Tweet.TweetUser
        }))
        return res.status(200).json(replyList)
      })
      .catch(err => next(err))
  },

  getUsersLikes: (req, res, next) => {
    const UserId = Number(req.params.id)

    Promise.all([
      Like.findAll({
        where: { UserId },
        attributes: ['id', 'UserId', 'TweetId'],
        include: [
          {
            model: Tweet,
            attributes: [
              'id',
              'description',
              [Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Tweet.id = Replies.Tweet_id )'), 'replyCount'],
              [Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Tweet.id = Likes.Tweet_id)'), 'likeCount']
            ],
            include: [
              {
                model: User,
                as: 'TweetUser',
                attributes: ['id', 'name', 'account', 'avatar']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      User.findByPk(UserId)
    ])

      .then(([likes, user]) => {
        if (!user) throw new Error('使用者不存在！')
        if (likes.length <= 0) throw new Error('該使用者沒有Like任何推文!')
        const likedTweetId = helpers.getUser(req)?.LikedTweets ? helpers.getUser(req).LikedTweets.map(l => l.id) : []
        const likeList = likes.map(data => ({
          ...data,
          Tweet: {
            id: data.Tweet.id,
            description: data.Tweet.description,
            likeCount: data.Tweet.likeCount,
            replyCount: data.Tweet.replyCount
          },
          TweetUser: data.Tweet.TweetUser,
          isLiked: likedTweetId.some(item => item === data.Tweet.id)
        }))
        res.status(200).json(likeList)
      })
      .catch(err => next(err))
  },

  getFollowings: (req, res, next) => {
    const UserId = Number(req.params.id)
    const reqUserId = helpers.getUser(req)
    return Promise.all([
      User.findByPk(UserId, {
        include: { model: User, as: 'Followings' }
      }),
      Followship.findAll({
        where: { followerId: reqUserId },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
    ])
      .then(([user, following]) => {
        if (!user.Followings.length) { res.status(200).json({ message: '沒有追隨者名單！' }) }

        const currentUserFollowing = following.map(f => f.followingId)
        const data = user.Followings.map(f => ({
          followingId: f.id,
          account: f.account,
          name: f.name,
          avatar: f.avatar,
          introduction: f.introduction,
          createdAt: f.createdAt,
          isFollowed: currentUserFollowing.some(u => u.id === reqUserId)
        }))
        return res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  getFollowers: (req, res, next) => {
    const UserId = Number(req.params.id)
    const reqUserId = helpers.getUser(req)
    return Promise.all([
      User.findByPk(UserId, {
        include: { model: User, as: 'Followers' }
      }),
      Followship.findAll({
        where: { followingId: reqUserId },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
    ])
      .then(([user, follower]) => {
        if (!user.Followers.length) { res.status(200).json({ message: '沒有粉絲名單！' }) }

        const currentUserFollowing = follower.map(f => f.followingId)
        const data = user.Followers.map(f => ({
          followerId: f.id,
          account: f.account,
          name: f.name,
          avatar: f.avatar,
          introduction: f.introduction,
          createdAt: f.createdAt,
          isFollowed: currentUserFollowing.some(u => u.id === reqUserId)
        }))
        return res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  addFollowing: (req, res, next) => {
    const followingId = Number(req.body.id)
    const followerId = helpers.getUser(req).id

    if (followingId === followerId) throw new Error('不能追蹤自己!')
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
    ])
      .then(([user, isFollowed]) => {
        if (!user) throw new Error('使用者不存在!')
        if (isFollowed) throw new Error('你已經追蹤該使用者！')
        return Followship.create({
          followingId,
          followerId
        })
        // .then(followship => {
        //   Promise.all([
        //     User.findByPk(+followerId).then(currentUser => currentUser.increment({ followingCount: 1 })),
        //     User.findByPk(+followingId).then(followingUser => followingUser.increment({ followerCount: 1 }))
        //   ])
        // })
      })
      .then(getFollowing => {
        res.status(200).json({ message: '成功追蹤使用者！', getFollowing })
      })
      .catch(err => next(err))
  },

  removeFollowing: (req, res, next) => {
    const followingId = Number(req.params.id)
    const followerId = helpers.getUser(req).id
    if (followingId === followerId) throw new Error('不能取消追蹤自己!')
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
    ])
      .then(([user, isFollowed]) => {
        if (!user) throw new Error('無法取消追蹤不存在的使用者!')
        if (!isFollowed) throw new Error('你尚未追蹤該名使用者！')
        return Followship.destroy({
          where: {
            followingId,
            followerId
          }
        })
      })
      .then(removeFollowing => res.status(200).json({ message: '成功取消追蹤該名使用者！', removeFollowing }))
      .catch(err => next(err))
  }
}

module.exports = userController
