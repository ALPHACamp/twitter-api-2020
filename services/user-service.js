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
  }
}

module.exports = userServices