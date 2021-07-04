const { User, Tweet, Like, sequelize } = require('../models')
const { Op } = require('sequelize')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminService = {
  signIn: async (email, pw) => {
    if (!(email && pw)) {
      throw new Error('email and password are required')
    }

    const user = await User.findOne({ where: { email: email } })
    if (!user) return { status: 404, message: 'user no found' }
    if (!bcrypt.compareSync(pw, user.password)) return { status: 401, message: 'password not match' }
    const payload = { id: user.id }
    const token = jwt.sign(payload, 'JWTSecretIsWeird')
    return { message: 'OK', token: token, user: user }
  },

  deleteTweet: async (tweetId) => {
    await Tweet.destroy({ where: { id: tweetId } })
    return ({ message: `the tweet id ${tweetId} deleted successfully` })
  },

  getUsers: async () => {
    return await User.findAll({
      raw: true,
      nest: true,
      where: { id: { [Op.not]: 1 } },
      attributes: [
        'id',
        'name',
        'avatar',
        'cover',
        [sequelize.literal('count(distinct Tweets.id)'), 'TweetsCount'],
        [sequelize.literal('count(distinct Likes.id)'), 'LikesCount'],
        [sequelize.literal('count(distinct Followers.id)'), 'FollowersCount'],
        [sequelize.literal('count(distinct Followings.id)'), 'FollowingsCount']
      ],
      group: 'id',
      include: [
        { model: Tweet, attributes: [] },
        { model: Like, attributes: [] },
        { model: User, as: 'Followers', attributes: [], through: { attributes: [] } },
        { model: User, as: 'Followings', attributes: [], through: { attributes: [] } }
      ]
    })
  }
}

module.exports = adminService
