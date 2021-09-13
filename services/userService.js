const { User, Tweet, Reply, Like, Sequelize } = require('../models')
const bcrypt = require('bcryptjs')

const userService = {
  signIn: async (account) => {
    return await User.findOne({ where: { account } })
  },

  getCurrentUser: async (id) => {
    return await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like }
      ]
    })
  },

  postUser: async (body) => {
    const { account, name, email, password } = body
    // Check if user is exists by email
    const checkEmail = await User.findOne({ where: { email } })
    if (checkEmail) {
      return { status: 'error', message: 'Email already exists' }
    }

    // Check if user is exists by account
    const checkAccount = await User.findOne({ where: { account } })
    if (checkAccount) {
      return { status: 'error', message: 'Account already exists' }
    }

    // Create user
    await User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    })

    return { status: 'success', message: 'Registration success' }
  },

  getUser: async (id) => {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
  },

  getUserTweets: async (targetUserId, currentUserId) => {
    return await Tweet.findAll({
      where: { UserId: targetUserId },
      attributes: [
        ['id', 'TweetId'],
        'createdAt',
        'description',
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'
          ),
          'likesCount'
        ],
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'
          ),
          'RepliesCount'
        ],
        [
          Sequelize.literal(
            `exists(select 1 from Likes where UserId = ${currentUserId} and TweetId = Tweet.id)`
          ),
          'isLike'
        ]
      ],
      include: [
        { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
        { model: Like, attributes: [] },
        { model: Reply, attributes: [] }
      ],
      order: [['createdAt', 'DESC']],
      group: ['TweetId']
    })
  },

  getUserRepliedTweets: async (UserId) => {
    return await Reply.findAll({
      where: { UserId },
      include: [
        { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
        {
          model: Tweet,
          attributes: ['description'],
          include: [{ model: User, attributes: ['id', 'account'] }]
        }
      ],
      attributes: ['id', [Sequelize.col('Tweet.id'), 'TweetId'], 'comment', 'createdAt'],
      order: [['createdAt', 'DESC']],
      group: ['id']
    })
  }
}

module.exports = userService
