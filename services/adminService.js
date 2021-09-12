const { User, Tweet, Like, Reply, sequelize } = require('../models')
const Sequelize = require('sequelize')

const adminService = {
  getUsers: async () => {
    return await User.findAll({
      raw: true,
      where: { role: 'user' },
      include: [
        {
          model: User,
          as: 'Followings',
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'Followers',
          attributes: [],
          through: { attributes: [] }
        },
        { model: Like, attributes: [] },
        { model: Tweet, attributes: [] }
      ],
      group: ['user.id'],
      order: [
        [Sequelize.literal('tweetsCount'), 'DESC'],
        ['createdAt', 'DESC']
      ],
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'cover',
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Tweets WHERE Tweets.userId = User.id)'
          ),
          'tweetsCount'
        ],
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Likes WHERE Likes.userId = User.id)'
          ),
          'likesCount'
        ],
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
          ),
          'followersCount'
        ],
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'
          ),
          'followingsCount'
        ]
      ]
    })
  },

  getTweets: async () => {
    return await Tweet.findAll({
      include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
      attributes: [
        'id',
        [
          Sequelize.literal(
            '(SELECT id FROM Users WHERE Users.id = Tweet.userId)'
          ),
          'UserId'
        ],
        'description',
        'createdAt',
        'updatedAt'
      ],
      group: ['id'],
      order: [['createdAt', 'DESC']]
    })
  },

  deleteTweet: async (id) => {
    const tweet = await Tweet.findByPk(id)

    // Check whether tweet exists
    if (!tweet) {
      return { status: 'error', message: 'No tweet found' }
    }

    await tweet.destroy()
    return {
      status: 'success',
      message: `The tweet id ${tweet.id} deleted successfully`
    }
  }
}

module.exports = adminService
