const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const validator = require('validator')
const uploadFile = require('../helpers/file')
const helpers = require('../_helpers')
const { getFollowshipId, getLikedTweetsIds } = require('../helpers/user')

const userServices = {
  login: async (account, password) => {
    if (!account || !password) throw new Error('Missing account or password!')

    let user = await User.findOne({ where: { account } })

    // User not found
    if (!user) throw new Error("This account doesn't exist.")

    // Password incorrect
    if (!bcrypt.compareSync(password, user.password))
      throw new Error('Incorrect password.')

    user = user.toJSON()
    // Issue a token to user
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' })
    return {
      status: 'success',
      data: {
        token,
        user
      }
    }
  },

  register: async (account, name, email, password, checkPassword) => {
    // Double check password
    if (password !== checkPassword)
      return { status: 'error', message: 'Please check your password again!' }

    // Check if email is used
    const user = await User.findOne({ where: { email } })
    if (user) return { status: 'error', message: 'Email is already used!' }

    // Check if account is used
    const accountIsUsed = await User.findOne({ where: { account } })
    if (accountIsUsed) return { status: 'error', message: 'Account is used.' }

    // Check if name exceeds 50 words
    if (!validator.isByteLength(name, { min: 0, max: 50 }))
      return { status: 'error', message: 'Name must not exceed 50 words.' }

    // Check if account exceeds 50 words
    if (!validator.isByteLength(account, { min: 0, max: 50 }))
      return { status: 'error', message: 'Account must not exceed 50 words.' }

    // Create new user
    const newUser = await User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role: 'user'
    })

    // Protect sensitive user info
    newUser.password = undefined
    return { status: 'success', message: 'New user created.' }
  },

  getUser: async req => {
    const id = req.params.id
    let user = await User.findByPk(id, {
      include: [
        Tweet,
        {
          model: User,
          as: 'Followers',
          attributes: [
            'id',
            'name',
            'account',
            'avatar',
            [
              sequelize.literal('`Followers->Followship`.`createdAt`'),
              'createdAt'
            ]
          ]
        },
        {
          model: User,
          as: 'Followings',
          attributes: [
            'id',
            'name',
            'account',
            'avatar',
            [
              sequelize.literal('`Followings->Followship`.`createdAt`'),
              'createdAt'
            ]
          ]
        }
      ],
      attributes: {
        exclude: ['password']
      }
    })
    if (!user) throw new Error("This user don't exist!")

    const userFollowingIds = getFollowshipId(req, 'Followings')

    // sort by created date
    user.Followers.sort((a, b) => b.createdAt - a.createdAt)
    user.Followings.sort((a, b) => b.createdAt - a.createdAt)

    // Clean data
    const Followers = user.Followers.map(user => ({
      id: user.id,
      name: user.name,
      account: user.account,
      avatar: user.avatar,
      isFollowed: userFollowingIds.includes(user.id)
    }))

    const Followings = user.Followings.map(user => ({
      id: user.id,
      name: user.name,
      account: user.account,
      avatar: user.avatar,
      isFollowed: userFollowingIds.includes(user.id)
    }))

    user = {
      ...user.dataValues,
      introduction: user.introduction || '',
      isFollowed: userFollowingIds.includes(user.id),
      Followers,
      Followings
    }

    return user
  },

  putUser: async (id, files, email, password, name, account, introduction) => {
    // Get user instance in db
    const user = await User.findByPk(id)

    if (user.id !== Number(id))
      return {
        status: 'error',
        message: "You cannot edit other's profile."
      }

    // Check if user is using the same email or account
    if (user.email !== email) {
      const usedEmail = await User.findOne({ where: { email } })
      if (usedEmail)
        return {
          status: 'error',
          message: 'Email should be unique.'
        }
    }

    if (user.account !== account) {
      const usedAccount = await User.findOne({ where: { account } })
      if (usedAccount)
        return {
          status: 'error',
          message: 'Account should be unique.'
        }
    }

    if (!validator.isByteLength(introduction, { min: 0, max: 160 }))
      return {
        status: 'error',
        message: 'Introduction must not exceed 160 words.'
      }

    // Check if it's initial intro
    if (!introduction) {
      introduction === user.introduction
    }

    if (password === user.password) {
      // User didn't change password
      password = null
    }

    const userProfile = await user.update({
      email,
      password: password ? bcrypt.hashSync(password, 10) : user.password,
      name,
      account,
      introduction
    })

    // If user uploads images
    const images = {}
    if (files) {
      for (const key in files) {
        images[key] = await uploadFile(files[key][0])
      }
      await user.update({
        cover: images ? images.cover : user.cover,
        avatar: images ? images.avatar : user.avatar
      })
    }

    return {
      status: 'success',
      message: 'User profile successfully edited.',
      userProfile
    }
  },

  getTopUsers: async req => {
    let topUsers = await User.findAll({
      where: { role: 'user' },
      attributes: {
        exclude: ['password']
      },
      order: [['followerCount', 'DESC']],
      limit: 10,
      raw: true
    })

    const followingIds = getFollowshipId(req, 'Followings')

    // Clean data
    topUsers = topUsers.map(user => ({
      ...user,
      isFollowed: followingIds.includes(user.id)
    }))

    return topUsers
  },

  getUserTweets: async (req, user) => {
    let [tweets, userLikes] = await Promise.all([
      Tweet.findAll({
        where: { UserId: req.params.id },
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        raw: true,
        nest: true
      }),
      Like.findAll({
        where: { UserId: user.id },
        raw: true
      })
    ])
    if (!tweets) throw new Error("This user doesn't publish any tweets")

    // Clean like data
    userLikes = userLikes.map(like => like.TweetId)

    // Clean like data
    tweets = tweets.map(tweet => ({
      ...tweet,
      isLiked: userLikes.includes(tweet.id)
    }))

    return tweets
  },

  getUserRepliedTweet: async req => {
    let replies = await Reply.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Tweet,
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ]
        }
      ],
      raw: true,
      nest: true
    })
    if (!replies) throw new Error("This user doesn't reply any tweets")

    const userLikes = await getLikedTweetsIds(req)

    replies = replies.map(reply => ({
      ...reply,
      likedTweet: userLikes.includes(reply.Tweet.id)
    }))

    return replies
  },

  getUserLikes: async req => {
    let likes = await Like.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        {
          model: Tweet,
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ]
        }
      ],
      raw: true,
      nest: true
    })
    if (!likes) throw new Error("This user doesn't like any tweets")

    const userLikes = await getLikedTweetsIds(req)
    // Clean data
    likes = likes.map(like => ({
      ...like,
      likedTweet: userLikes.includes(like.TweetId)
    }))

    return likes
  },

  getUserFollowings: async req => {
    const followings = await Followship.findAll({
      where: { followerId: req.params.id }
    })
    if (!followings) throw new Error("This user doesn't following anyone")

    return followings
  },

  getUserFollowers: async req => {
    const followers = await Followship.findAll({
      where: { followingId: req.params.id }
    })
    if (!followers) throw new Error("This user doesn't have any followers")

    return followers
  },

  getCurrentUser: async req => {
    let user = helpers.getUser(req)
    user = await User.findById(user.id, {
      raw: true
    })

    if (!user.introduction) {
      user.introduction = ''
    }

    return user
  }
}

module.exports = userServices
