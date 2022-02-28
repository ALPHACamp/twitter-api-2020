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
  }
}

module.exports = userServices