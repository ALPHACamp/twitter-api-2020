const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const validator = require('validator')
const uploadFile = require('../helpers/file')
const helpers = require('../_helpers')
const { getFollowshipId, getLikedTweetsIds } = require('../helpers/user')

const userServices = {
  login: async (email, password) => {
    if (!email || !password) throw new Error('Missing email or password!')

    let user = await User.findOne({ where: { email } })

    // User not found
    if (!user) throw new Error("This account doesn't exist.")

    // Password incorrect
    if (!bcrypt.compareSync(password, user.password)) throw new Error('Incorrect password.')

    user = user.toJSON()
    // Issue a token to user
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' })
    return ({
      status: 'success',
      data: {
        token,
        user
      }
    })
  },
  register: async (account, name, email, password, checkPassword) => {
    // Double check password
    if (password !== checkPassword)
      throw new Error('Please check your password again!')

    // Check if email is used
    const user = await User.findOne({ where: { email } })
    if (user) throw new Error('Email is already used!')

    // Check if account is used
    const accountIsUsed = await User.findOne({ where: { account } })
    if (accountIsUsed) throw new Error('Account is used.')

    // Check if name exceeds 50 words
    if (!validator.isByteLength(name, { min: 0, max: 50 }))
      throw new Error('Name must not exceed 50 words.')

    // Create new user
    const hash = bcrypt.hashSync(password, 10)
    const newUser = await User.create({
      account,
      name,
      email,
      password: hash,
      role: 'user'
    })

    // Protect sensitive user info
    newUser.password = undefined
    return newUser
  },
  getUser: async (req) => {
    let user = await User.findByPk(req.params.id, {
      include: [
        Tweet,
        {
          model: User,
          as: 'Followers',
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: User,
          as: 'Followings',
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ],
      attributes: {
        exclude: ['password']
      }
    })

    const userFollowingIds = getFollowshipId(req, 'Followings')

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
      introduction: '',
      isFollowed: userFollowingIds.includes(user.id),
      Followers,
      Followings
    }

    return user
  },
  putUser: async (userId, id, files, email, password, name, account, introduction) => {
    if (userId !== Number(id))
      throw new Error("You cannot edit other's profile.")

    const [usedEmail, usedAccount] = await Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])

    if (usedEmail || usedAccount)
      throw new Error('Email and account should be unique.')

    if (!validator.isByteLength(introduction, { min: 0, max: 160 }))
      throw new Error('Introduction must not exceed 160 words.')

    // Get user instance in db
    const user = await User.findByPk(id)

    await user.update({
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
      message: 'User profile successfully edited.'
    }
  },
  getTopUsers: async (req) => {
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
  }
}

module.exports = userServices