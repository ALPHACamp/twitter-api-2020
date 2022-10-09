const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Op } = require('sequelize')
const { User, Tweet, Reply, Followship, Like, sequelize } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    const { password, checkPassword, email, account, name } = req.body
    const [nameMin, nameMax] = [1, 50]

    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符')
    if (!password || !checkPassword || !email || !account || !name) throw new Error('欄位皆為必填')

    User.findOne({
      attributes: ['email', 'account'],
      where: {
        [Op.or]: [{ email }, { account }]
      }
    })
      .then(user => {
        if (!user) return bcrypt.hash(password, 10)
        if (name.length < nameMin || name.length > nameMax) throw new Error(`暱稱字數限制需在 ${nameMin}~ ${nameMax} 字之內`)
        if (user.email === email) throw new Error('該Email已被註冊!')
        if (user.account === account) throw new Error('該account已被註冊!')
      })
      .then(hash => User.create({
        name,
        account,
        email,
        role: 'user',
        password: hash,
        introduction: '此人很神秘，什麼都沒有寫',
        profilePhoto: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
        coverPhoto: 'https://i.imgur.com/t0YRqQH.jpg'
      }))
      .then(newUser => res.json(newUser))
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req)?.toJSON()
      if (userData.role !== 'user') {
        throw new Error('帳號不存在')
      }
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        token,
        userData
      })
    } catch (err) {
      next(err)
    }
  },
  getCurrentUser: (req, res, next) => {
    const currentUser = helpers.getUser(req)?.id

    User.findByPk(currentUser, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    })
      .then(user => res.json(user))
      .catch(err => next(err))
  },
  getUserProfile: (req, res, next) => {
    const id = Number(req.params.id)
    User.findByPk(id, {
      attributes: {
        include: [[
          sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE following_id = user.id )'), 'FollowingsCount'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE follower_id = user.id )'), 'FollowerCount'
        ]],
        exclude: ['password', 'email', 'updatedAt']
      }
    })
      .then(user => {
        if (!user) throw new Error('該使用者不存在')
        return res.json(user)
      })
      .catch(err => next(err))
  },
  putUserProfile: (req, res, next) => {
    const id = Number(req.params.id)
    const userId = helpers.getUser(req)?.id
    const { name, introduction } = req.body
    const { file } = req
    const [nameMin, nameMax] = [1, 50]
    const [introductionMin, introductionMax] = [1, 160]

    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (userId !== id) throw new Error('不具有權限')
        if (name.length < nameMin || name.length > nameMax) throw new Error(`暱稱字數限制需在 ${nameMin}~ ${nameMax} 字之內`)

        if (introduction.length < introductionMin || introduction.length > introductionMax) throw new Error(`自我介紹字數限制需在 ${introductionMin}~ ${introductionMax} 字之內`)

        return user.update({
          name,
          introduction,
          profilePhoto: filePath || user.profilePhoto,
          coverPhoto: filePath || user.coverPhoto
        })
      })
      .then(updateUser => {
        const user = updateUser.toJSON()
        delete user.password
        res.json(user)
      })
      .catch(err => next(err))
  },
  putUserSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const [nameMin, nameMax] = [1, 50]
    const id = req.params.id

    if (password !== checkPassword) throw new Error('密碼不相符')
    if (name.length < nameMin || name.length > nameMax) throw new Error(`暱稱字數限制需在 ${nameMin}~ ${nameMax} 字之內`)
    if (!account || !name || !email || !password || !checkPassword) {
      throw new Error('所有欄位都是必填的')
    }

    Promise.all([
      User.findAll({ raw: true }),
      User.findByPk(id)
    ])
      .then(([users, currentUser]) => {
        users.forEach(user => {
          if (user.id !== currentUser.id) {
            if (user.account === account) {
              throw new Error('此帳號已被使用')
            } else if (user.email === email) {
              throw new Error('此Email已被使用')
            }
          }
        })
        return currentUser.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, 10)
        })
      })
      .then(newUser => {
        const user = newUser.toJSON()
        delete user.password
        res.json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id // 當前登入使用者id
    const UserId = Number(req.params.id) // 動態路由取得的id
    let id // 最後要拿來查詢的id
    if (currentUserId === UserId) {
      id = currentUserId
    } else {
      id = UserId
    }
    Promise.all([User.findByPk(id),
      Tweet.findAll({
        where: { UserId: id },
        include: [{ model: User, attributes: ['id', 'account', 'name', 'profilePhoto'] }],
        attributes: {
          include: [
            [sequelize.literal(
              '(SELECT COUNT(*) FROM Replies WHERE Tweet_id = Tweet.id )'
            ), 'repliesCount'],
            [sequelize.literal(
              '(SELECT COUNT(*) FROM Likes  WHERE Tweet_id = Tweet.id )'
            ), 'likesCount']
          ]
        }
      })
    ])
      .then(([user, tweets]) => {
        if (!user) throw new Error('使用者不存在')
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id // 當前登入使用者id
    const UserId = Number(req.params.id) // 動態路由取得的id
    let id // 最後要拿來查詢的id
    if (currentUserId === UserId) {
      id = currentUserId
    } else {
      id = UserId
    }
    Promise.all([User.findByPk(id),
      Reply.findAll({
        where: { UserId: id },
        include: [{ model: User, attributes: ['id', 'account', 'name', 'profilePhoto'] }]
      })
    ])
      .then(([user, replies]) => {
        if (!user) throw new Error('使用者不存在')
        res.json(replies)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const UserId = req.params.id

    Like.findAll({
      where: { UserId },
      attributes: ['id', 'UserId', 'TweetId'],
      include: [{
        model: Tweet,
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'profilePhoto']
        }],
        attributes: {
          include: [[
            sequelize.literal(
              '(SELECT COUNT(*) FROM Replies AS ReplyUsers WHERE tweet_id = Tweet.id )'), 'ReplyCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM likes AS LikeUsers WHERE tweet_id = Tweet.id )'), 'LikeCount'
          ]]
        }
      }],
      order: [['createdAt', 'Desc']]
    })
      .then(likes => {
        res.json(likes)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id
    const UserId = req.params.id

    User.findByPk(UserId, {
      include: [{
        model: User,
        as: 'Followings',
        attributes: ['id', 'name', 'profilePhoto', 'introduction'],
        through: { attributes: [] },
        include: [{
          model: User,
          as: 'Followers'
        }]
      }]
    })
      .then(followings => {
        if (!followings) throw new Error('該使用者不存在')
        const result = followings.Followings
          .map(followings => {
            const { Followers, ...data } = followings.toJSON()
            data.followingId = followings.id
            data.isFollowed = followings.Followers.some(one => one.id === currentUserId)
            return data
          })
        res.json(result)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id
    const UserId = req.params.id

    User.findByPk(UserId, {
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id', 'name', 'profilePhoto', 'introduction'],
        through: { attributes: [] },
        include: [{
          model: User,
          as: 'Followers'
        }]
      }]
    })
      .then(followers => {
        if (!followers) throw new Error('該使用者不存在')
        const result = followers.Followers
          .map(followers => {
            const { Followers, ...data } = followers.toJSON()
            data.followerId = followers.id
            data.isFollowed = followers.Followers.some(one => one.id === currentUserId)
            return data
          })
        res.json(result)
      })
      .catch(err => next(err))
  },
  getTopFollowings: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id
    const topUserLimit = 10

    User.findAll({
      limit: topUserLimit,
      attributes: {
        include: [[
          sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE following_id = user.id )'), 'FollowingsCount'
        ]],
        exclude: ['password', 'email', 'coverPhoto', 'role', 'createdAt', 'updatedAt']
      },
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id', 'name']
      }],
      order: [[sequelize.literal('FollowingsCount'), 'Desc']]
    })
      .then(users => {
        const result = users
          .map(users => {
            const { Followers, ...data } = users.toJSON()
            data.isFollowed = Followers.some(one => one.id === currentUserId)
            return data
          })
        res.json(result)
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id
    const { id } = req.body
    Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId: id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('該使用者不存在')
        if (user.id === currentUserId) throw new Error('無法追蹤自己')
        if (followship) throw new Error('已追蹤過這個使用者')
        return Followship.create({
          followerId: currentUserId,
          followingId: Number(id)
        })
      })
      .then(followingUser => res.json(followingUser))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id
    const userId = req.params.followingId
    console.log(userId)
    Followship.findOne({
      where: {
        followerId: currentUserId,
        followingId: userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('尚未追蹤這個使用者')
        return followship.destroy()
      })
      .then(removeFollowingUser => res.json(removeFollowingUser))
      .catch(err => next(err))
  }
}

module.exports = userController
