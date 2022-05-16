const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { User, Tweet, Followship, Reply, Like } = require('../models')

const { getUser } = require('../_helpers')
const Sequelize = require('sequelize')

const userController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    // make sure all fields are filled
    if (!account || !password) throw new Error('帳號和密碼為必填！')

    User.findOne({ where: { account } })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password)) { throw new Error('密碼錯誤！') }
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })
        return res.status(200).json({
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
          token,
          user: userData
        })
      })
      .catch(err => next(err))
  },

  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    const reqUserId = getUser(req).id
    return User.findByPk(userId, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user || user.role === 'admin') throw new Error('帳號不存在！')
        user.dataValues.isFollowed = user.Followers.map(u => u.id).includes(reqUserId)
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },

  getCurrentUser: (req, res, next) => {
    try {
      const userData = (({ id, account, name, email, avatar, role }) => ({ id, account, name, email, avatar, role }))(getUser(req))
      return res.status(200).json(userData)
    } catch (err) {
      next(err)
    }
  },

  getTopUsers: (req, res, next) => {
    const userId = Number(req.user.id)
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
            owner: Number(user.id) !== userId
          }))
          .sort((a, b) => b.followedCount - a.followedCount || b.createdAt - a.createdAt)
          .slice(0, 10)

        result.forEach(r => {
          delete r.Followers
        })

        return res.status(200).json(result)
      })
      .catch(err => next(err))
  },

  putUserSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const userId = Number(req.params.id)
    const reqUserId = getUser(req).id

    if (userId !== reqUserId) throw new Error('Permission denied')
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
      .then(updatedUser => res.status(200).json({ user: updatedUser }))
      .catch(err => next(err))
  },

  putUser: async (req, res, next) => {
    try {
      const UserId = Number(req.params.id)
      const user = await User.findByPk(UserId)
      const userUpdate = await user.update(req.body)
      res.status(200).json(userUpdate)
    } catch (err) {
      next(err)
    }
    res.status(200).json()
  },

  getUsersTweets: (req, res, next) => {
    const UserId = Number(req.params.id)
    Promise.all([
      Tweet.findAndCountAll({
        where: { UserId },
        attributes: ['id', 'description', 'createdAt', 'updatedAt', 'replyCount', 'likeCount'],
        include: [
          { model: User, as: 'TweetUser', attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      User.findByPk(UserId)
    ])
      .then(([tweets, userOnChecked]) => {
        // update user tweetCount
        userOnChecked.update({
          tweetCount: tweets.count
        })
        const likedTweetId = getUser(req)?.LikedTweets ? getUser(req).LikedTweets.map(l => l.id) : []
        const tweetList = tweets.rows.map(data => ({
          ...data,
          isLiked: likedTweetId.some(item => item === data.id)
        }))
        res.status(200).json(tweetList)
      })
      .catch(err => next(err))
  },

  getUsersReplies: (req, res, next) => {
    const UserId = Number(req.params.id)

    Reply.findAll({
      where: { UserId },
      attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
      include: [
        { model: User, as: 'ReplyUser', attributes: ['id', 'name', 'account', 'avatar'] },
        {
          model: Tweet,
          attributes: ['id'],
          include: [{ model: User, as: 'TweetUser', attributes: ['id', 'name', 'account'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(replies => res.status(200).json(replies))
      .catch(err => next(err))
  },

  getUsersLikes: (req, res, next) => {
    const UserId = Number(req.params.id)

    Promise.all([
      Like.findAndCountAll({
        where: { UserId },
        attributes: ['id', 'createdAt', 'TweetId', 'UserId'],
        include: [
          {
            model: Tweet,
            attributes: ['id', 'description', 'likeCount', 'replyCount'],
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
      .then(([likes, userOnChecked]) => {
        userOnChecked.update({
          likeCount: likes.count
        })
        const likedTweetId = getUser(req)?.LikedTweets ? getUser(req).LikedTweets.map(l => l.id) : []
        const likeList = likes.rows.map(data => ({
          ...data,
          isLiked: likedTweetId.some(item => item === data.Tweet.id)
        }))
        res.status(200).json(likeList)
      })
      .catch(err => next(err))
  }

  getFollowings: (req, res, next) => {
    const UserId = Number(req.params.id)
    Followship.findAll({
      where: { followerId: UserId },
      attributes: [
        'followingId', 'createdAt',
        [Sequelize.literal('(SELECT account FROM Users WHERE id = following_id)'), 'account'],
        [Sequelize.literal('(SELECT name FROM Users WHERE id = following_id)'), 'name'],
        [Sequelize.literal('(SELECT avatar FROM Users WHERE id = following_id)'), 'avatar'],
        [Sequelize.literal('(SELECT introduction FROM Users WHERE id = following_id)'), 'introduction'],
        [Sequelize.literal(`(CASE WHEN following_id = ${UserId} THEN true ELSE false END)`), 'isFollowing']
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(followers => res.status(200).json(followers))
      .catch(err => next(err))
  },

  getFollowers: (req, res, next) => {
    const UserId = Number(req.params.id)
    Followship.findAll({
      where: { followingId: UserId },
      attributes: [
        'followerId', 'createdAt',
        [Sequelize.literal('(SELECT account FROM Users WHERE id = follower_id)'), 'account'],
        [Sequelize.literal('(SELECT name FROM Users WHERE id = follower_id)'), 'name'],
        [Sequelize.literal('(SELECT avatar FROM Users WHERE id = follower_id)'), 'avatar'],
        [Sequelize.literal('(SELECT introduction FROM Users WHERE id = follower_id)'), 'introduction'],
        [Sequelize.literal(`(CASE WHEN follower_id = ${UserId} THEN true ELSE false END)`), 'isFollowing']
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(followers => res.status(200).json(followers))
      .catch(err => next(err))
  }
}

module.exports = userController
