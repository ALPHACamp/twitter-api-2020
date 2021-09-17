const { User, Tweet, Reply, Like, Followship, Sequelize } = require('../models')
const { Op } = require('sequelize')
const ApiError = require('../utils/customError')

const userService = {
  signIn: async (account) => {
    return await User.findOne({ where: { account } })
  },

  getCurrentUser: async (id) => {
    return await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'Followers', attributes: { exclude: ['password'] } },
        {
          model: User,
          as: 'Followings',
          attributes: { exclude: ['password'] }
        },
        { model: Like }
      ]
    })
  },

  postUser: async (body) => {
    const { account, name, email, password } = body

    // Check if user is exists by email
    const checkEmail = await User.findOne({ where: { email } })
    if (checkEmail) {
      throw new ApiError('EmailExistsError', 401, 'Email already exists')
    }
    // Check if user is exists by account
    const checkAccount = await User.findOne({ where: { account } })
    if (checkAccount) {
      throw new ApiError('AccountExistsError', 401, 'Account already exists')
    }
    // Check if user is exists by name
    const checkName = await User.findOne({ where: { name } })
    if (checkName) {
      throw new ApiError('NameExistsError', 401, 'Name already exists')
    }

    // Create user
    return await User.create({
      account,
      name,
      email,
      password
    })
  },

  getUser: async (targetUserId, currentUserId) => {
    return await User.findOne({
      where: { id: targetUserId },
      include: [
        { model: Tweet, attributes: [] },
        {
          model: User,
          as: 'Followers',
          attributes: [],
          through: {
            attributes: []
          }
        },
        {
          model: User,
          as: 'Followings',
          attributes: [],
          through: {
            attributes: []
          }
        }
      ],
      attributes: [
        'id',
        'email',
        'name',
        'avatar',
        'introduction',
        'role',
        'account',
        'cover',
        'createdAt',
        'updatedAt',
        [
          Sequelize.literal(
            `exists(select 1 from Followships where followerId = ${currentUserId} and followingId = User.id)`
          ),
          'isFollowed'
        ],
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Tweets WHERE Tweets.userId = User.id)'
          ),
          'TweetsCount'
        ],
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
          ),
          'FollowersCount'
        ],
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'
          ),
          'FollowingsCount'
        ]
      ]
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
          'LikesCount'
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
      attributes: [
        'id',
        [Sequelize.col('Tweet.id'), 'TweetId'],
        'comment',
        'createdAt'
      ],
      order: [['createdAt', 'DESC']],
      group: ['id']
    })
  },

  getUserLikedTweets: async (targetUserId, currentUserId) => {
    return await Tweet.findAll({
      raw: true,
      nest: true,
      include: [
        { model: Like, attributes: [], where: { UserId: targetUserId } },
        { model: Reply, attributes: [] },
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      attributes: [
        ['id', 'TweetId'],
        'createdAt',
        'description',
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'
          ),
          'LikesCount'
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
      group: ['TweetId'],
      order: [['Likes', 'createdAt', 'DESC']]
    })
  },

  getUserFollowings: async (targetUserId, currentUserId) => {
    return await User.findAll({
      raw: true,
      nest: true,
      include: {
        model: User,
        as: 'Followers',
        where: { id: targetUserId },
        attributes: [],
        through: {
          attributes: []
        }
      },
      attributes: [
        [
          Sequelize.literal(
            `exists(select 1 from Followships where followerId = ${currentUserId} and followingId = User.id)`
          ),
          'isFollowed'
        ],
        ['id', 'followingId'],
        'name',
        'avatar',
        'introduction',
        'account'
      ],
      group: ['User.id'],
      order: [['Followers', 'createdAt', 'DESC']]
    })
  },

  getUserFollowers: async (targetUserId, currentUserId) => {
    return await User.findAll({
      raw: true,
      nest: true,
      include: {
        model: User,
        as: 'Followings',
        where: { id: targetUserId },
        attributes: [],
        through: {
          attributes: []
        }
      },
      attributes: [
        [
          Sequelize.literal(
            `exists(select 1 from Followships where followerId = ${currentUserId} and followingId = User.id)`
          ),
          'isFollowed'
        ],
        ['id', 'followerId'],
        'name',
        'avatar',
        'introduction',
        'account'
      ],
      group: ['User.id'],
      order: [['Followings', 'createdAt', 'DESC']]
    })
  },

  putUser: async (id, body) => {
    const { account, name, email } = body

    // Check if user is exists by email
    if (email) {
      const checkEmail = await User.findOne({
        where: { id: { [Op.not]: id }, email }
      })
      if (checkEmail) {
        throw new ApiError('EmailExistsError', 401, 'Email already exists')
      }
    }
    // Check if user is exists by account
    if (account) {
      const checkAccount = await User.findOne({
        where: { id: { [Op.not]: id }, account }
      })
      if (checkAccount) {
        throw new ApiError('AccountExistsError', 401, 'Account already exists')
      }
    }
    // Check if user is exists by name
    if (name) {
      const checkName = await User.findOne({
        where: { id: { [Op.not]: id }, name }
      })
      if (checkName) {
        throw new ApiError('NameExistsError', 401, 'Name already exists')
      }
    }

    const user = await User.findByPk(id)
    return await user.update(body)
  },

  getTopUsers: async (currentUserId) => {
    return await User.findAll({
      where: { id: { [Op.not]: currentUserId }, role: 'user' },
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: [],
          through: { attributes: [] }
        }
      ],
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'introduction',
        [
          Sequelize.literal(
            `exists(select 1 from Followships where followerId = ${currentUserId} and followingId = User.id)`
          ),
          'isFollowed'
        ],
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
          ),
          'FollowersCount'
        ]
      ],
      group: ['id'],
      order: [[Sequelize.col('FollowersCount'), 'DESC']],
      limit: 10
    })
  }
}

module.exports = userService
