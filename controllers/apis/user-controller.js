const bcrypt = require('bcryptjs')
const { User, Reply, Tweet, Followship, Like } = require('../../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../../helpers/file-helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role === 'admin') throw new Error('Account does not exist!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message })
    }
  },
  signUp: (req, res) => {
    const { name, email, password, avatar, introduction, role, account, passwordCheck } = req.body
    new Promise((resolve, reject) => {
      if (!account) {
        reject(new Error('Account is required'))
      } else if (account.length > 50) {
        reject(new Error(`Account too long`))
      }
      if (name && name.length > 50) { reject(new Error(`Name too long`)) }
      if (introduction && introduction.length > 160) reject(new Error('Introduction too long'))
      if (password != passwordCheck) reject(new Error('Password do not match'))
      resolve()
    })
      .then(() => {
        return Promise.all([
          User.findOne({ where: { email } }),
          User.findOne({ where: { account } })
        ])
      })
      .then(([user, account]) => {
        if (user) throw new Error('Email already exists!')
        if (account) throw new Error('Account already registered!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          email,
          avatar,
          introduction,
          role,
          account,
          banner: 'https://i.imgur.com/jsrSDDm.png',
          password: hash
        })
      })
      .then((user) => {
        user = user.toJSON()
        delete user.password
        return res.status(200).json({ status: 'success', data: { user } })
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
  getUser: (req, res) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Tweet.findAll({
        //取得req.params.id的所有tweets
        where: {
          userId: req.params.id
        },
        //額外取得兩個屬性
        include: [
          { model: Reply },
          { model: Like, }
        ],
      }),
      Followship.findOne({
        where: {
          followingId: req.user.id,
          followerId: req.params.id
        }
      }),
      User.findOne({
        where: { id: req.params.id },
        include: [{ model: User, as: 'Followings' }]
      }),
      User.findOne({
        where: { id: req.params.id },
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([user, tweets, followship, followings, followers]) => {
        if (!user) throw new Error(`User didn't exist`)
        tweets = tweets.map(tweet => {
          const tweetData = tweet.toJSON()
          tweetData.RepliesCount = tweet.Replies.length
          tweetData.LikesCount = tweet.Likes.length
          return tweetData
        })
        const isFollowing = followship ? true : false
        const followingsCount = followings.Followings.length
        const followersCount = followers.Followers.length
        user = user.toJSON()
        delete user.password
        return res.status(200).json({ status: 'success', user, tweets, isFollowing, followingsCount, followersCount })
      })
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error(`User didn't exist`)
        user = user.toJSON()
        delete user.password
        return res.status(200).json({ status: 'success', user })
      })
      .catch(err => res.status(500).json({ status: 'error', error: err }))
  },
  putUser: (req, res) => {
    const { name, introduction } = req.body
    const files = req.files || {}
    if (!name) throw new Error('User name is required')
    return Promise.all([
      User.findByPk(req.user.id),
      files.avatar ? imgurFileHandler(files.avatar[0]) : null,
      files.banner ? imgurFileHandler(files.banner[0]) : null
    ])
      .then(([user, avatarPath, bannerPath]) => {
        if (!user) throw new Error("User didn't exist!")
        if (user.id !== Number(req.params.id)) throw new Error('Edit self profile only!')
        return user.update({
          name,
          introduction,
          avatar: avatarPath || user.avatar,
          banner: bannerPath || user.banner
        })
      })
      .then((updatedUser) => {
        updatedUser = updatedUser.toJSON()
        delete updatedUser.password
        return res.status(200).json({ status: 'success', updatedUser })
      })
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  addLike: (req, res) => {
    const { tweetId } = req.params
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId: req.user.id,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error(`tweet didn't exist!`)
        if (like) throw new Error(`You have liked this tweet!`)
        return Like.create({
          userId: req.user.id,
          tweetId
        })
      })
      .then((likedTweet) => res.status(200).json({ status: 'success', likedTweet }))
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  removeLike: (req, res) => {
    Like.findOne({
      where: {
        userId: req.user.id,
        tweetId: req.params.tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error(`You haven't liked this tweet`)
        return like.destroy()
      })
      .then(() => res.status(200).json({ status: 'success' }))
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  }
}

module.exports = userController