const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Followship } = require('../models')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (password !== checkPassword) {
      const err = new Error("Password don't match")
      err.status = 403
      throw err
    }

    User.findOne({
      where: { [Op.or]: [{ email }, { account }] }
    })
      .then(user => {
        if (user) throw new Error('Email or Account already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      .then(user => {
        const userData = user.toJSON()
        delete userData.password
        return res.status(200).json({ status: 'success', user: userData })
      })
      .catch(err => next(err))
  },
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      const user = await User.findOne({ where: { account } })

      if (!user) throw new Error('帳號不存在')
      if (!bcrypt.compareSync(password, user.password)) throw new Error('密碼不正確')

      const userData = user.toJSON()
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
      next(err)
    }
  },
  getUser: (req, res, next) => {
    const id = req.params.id
    User.findByPk(id)
      .then(user => {
        if (!user) throw new Error("User doesn't exist.")

        const userData = user.toJSON()
        delete userData.password
        return res.json({ status: 'success', user: userData })
      })
  },
  editUser: async (req, res, next) => {
    const userId = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id

    if (userId !== currentUserId) throw new Error('You have no available to edit.')

    const { account, name, email, password, checkPassword, introduction } = req.body
    try {
      let hash = ''
      if (password && password === checkPassword) {
        hash = await bcrypt.hash(password, 10)
      } else if (password !== checkPassword) throw new Error("Password doesn't match.")

      const user = await User.findByPk(userId)
      const avatarLink = await imgurFileHandler(req.files.avatar ? req.files.avatar[0] : null)
      const coverLink = await imgurFileHandler(req.files.cover ? req.files.cover[0] : null)

      console.log('user: ', user.dataValues)
      console.log('avatarLink: ', avatarLink)
      console.log('coverLink: ', coverLink)

      if (!user) {
        const err = new Error("User doesn't exist.")
        err.status(404)
        throw err
      }

      const userData = {
        account: account || user.dataValues.account,
        name: name || user.dataValues.name,
        email: email || user.dataValues.email,
        password: hash,
        introduction: introduction || user.dataValues.introduction,
        avatar: avatarLink || user.dataValues.avatar,
        cover: coverLink || user.dataValues.cover
      }

      await User.update({ userData }, { where: { id: currentUserId } })

      delete userData.password
      return res.status(200).json({ status: 'success', user: userData })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const currentUserId = helpers.getUser(req).id

      const user = await User.findByPk(userId, {
        raw: true,
        nest: true,
        attributes: { exclude: ['password'] }
      })

      if (!user) throw new Error("User doesn't exist.")

      const tweets = await Tweet.findAll({
        where: { userId },
        include: [
          { model: Reply },
          {
            model: User,
            as: 'LikedUsers',
            attributes: ['id']
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      const tweetData = tweets.map(tweet => {
        return {
          ...tweet.toJSON(),
          likedUsersCount: tweet.LikedUsers.length,
          repliesCount: tweet.Replies.length,
          isLiked: tweet.LikedUsers.some(liked => liked.id === currentUserId)
        }
      })

      res.status(200).json({
        status: 'success',
        data: tweetData
      })
    } catch (err) {
      next(err)
    }
  },
  getUsersFollowings: async (req, res, next) => {
    const userId = req.params.id
    const currentUserId = helpers.getUser(req).id

    const user = await User.findByPk(userId, {
      include: [
        { model: User, as: 'Followings' }
      ]
    })

    const currenUserFolloings = await Followship.findAll({
      where: { followerId: currentUserId },
      nest: true,
      raw: true
    })

    const userfollowings = user.toJSON().Followings.map(followingUser => {
      return {
        followingId: followingUser.id,
        account: followingUser.account,
        name: followingUser.name,
        email: followingUser.email,
        avatar: followingUser.avatar,
        isFollowed: currenUserFolloings.some(f => f.followingId === followingUser.id)
      }
    })

    const data = {
      ...user.toJSON(),
      userfollowings
    }

    res.status(200).json({
      status: 'success',
      data
    })
  },
  getUsersFollowers: async (req, res, next) => {
    const userId = req.params.id
    const currentUserId = helpers.getUser(req).id

    const user = await User.findByPk(userId, {
      include: [
        { model: User, as: 'Followers' }
      ]
    })

    const currenUserFolloings = await Followship.findAll({
      where: { followerId: currentUserId },
      nest: true,
      raw: true
    })

    const userfollowers = user.toJSON().Followers.map(followerUser => {
      return {
        followerId: followerUser.id,
        account: followerUser.account,
        name: followerUser.name,
        email: followerUser.email,
        avatar: followerUser.avatar,
        isFollowed: currenUserFolloings.some(f => f.followingId === followerUser.id)
      }
    })

    const data = {
      ...user.toJSON(),
      userfollowers
    }

    res.status(200).json({
      status: 'success',
      data
    })
  }
}

module.exports = userController
