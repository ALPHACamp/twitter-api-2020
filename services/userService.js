const { User, Tweet, Reply, Like, Sequelize } = require('../models')
const { Op } = Sequelize

const RequestError = require('../utils/customError')

const userService = {
  signIn: async (email) => {
    return await User.findOne({ where: { email } })
  },

  signUp: async (formBody) => {
    await userService.checkUnique(formBody)
    return await User.create({ ...formBody })
  },

  getUser: async (viewingId, currentUserId = null) => {
    return await User.findByPk(viewingId, {
      attributes: [
        'id', 'email', 'name', 'avatar', 'introduction', 'cover', 'role', 'createdAt',
        [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account'],
        [Sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE FollowerId = ${currentUserId} AND FollowingId = User.id)`), 'isFollowed'],
        [Sequelize.literal('COUNT(DISTINCT Tweets.id)'), 'tweetsCount']
      ],
      group: 'User.id',
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like },
        { model: Tweet, attributes: [] }
      ]
    })
  },

  putUser: async (id, body) => {
    await userService.checkUnique(body, id)
    return await User.update({ ...body }, { where: { id } })
  },

  getFollowings: async (userId, currentUserId) => {
    return await User.findAll({
      where: {
        id: {
          [Op.in]: [Sequelize.literal(`SELECT followingId FROM Followships WHERE followerId = ${userId}`)]
        }
      },
      attributes: [
        ['id', 'followingId'], 'name', 'avatar', 'introduction',
        [Sequelize.fn('concat', '@', Sequelize.col('account')), 'account'],
        [Sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE FollowerId = ${currentUserId} AND FollowingId = User.id)`), 'isFollowed']
      ]
    })
  },

  getFollowers: async (userId, currentUserId) => {
    return await User.findAll({
      where: {
        id: {
          [Op.in]: [Sequelize.literal(`SELECT followerId FROM Followships WHERE followingId = ${userId}`)]
        }
      },
      attributes: [
        ['id', 'followerId'], 'name', 'avatar', 'introduction',
        [Sequelize.fn('concat', '@', Sequelize.col('account')), 'account'],
        [Sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE FollowerId = ${currentUserId} AND FollowingId = User.id)`), 'isFollowed']
      ]
    })
  },

  getTopUsers: async (id) => {
    return await User.findAll({
      where: { [Op.not]: { role: 'admin' } },
      attributes: [
        'id', 'name', 'avatar', 'introduction',
        [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account'],
        [Sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE FollowerId = ${id} AND FollowingId = User.id)`), 'isFollowed'],
        [Sequelize.fn('count', Sequelize.col('Followers.id')), 'FollowerCount']
      ],
      include: { model: User, as: 'Followers', attributes: [], through: { attributes: [] } },
      order: [
        [Sequelize.col('FollowerCount'), 'DESC'],
        [Sequelize.col('isFollowed'), 'DESC']
      ],
      group: 'id',
      subQuery: false,
      limit: 10
    })
  },

  getLikes: async (id) => {
    return await Tweet.findAll({
      where: {
        id: {
          [Op.in]: [Sequelize.literal(`SELECT TweetId FROM Likes WHERE UserId = ${id}`)]
        }
      },
      attributes: [
        ['id', 'TweetId'], 'createdAt',
        [Sequelize.literal('Likes.createdAt'), 'LikesCreatedAt'],
        [Sequelize.literal('SUBSTRING(description,1,50)'), 'description'],
        [Sequelize.literal('COUNT(DISTINCT Likes.id)'), 'LikesCount'],
        [Sequelize.literal('COUNT(DISTINCT Replies.id)'), 'RepliesCount'],
        [Sequelize.literal(`EXISTS(SELECT 1 FROM Likes WHERE UserId = ${id} AND TweetId = Tweet.id)`), 'isLike']
      ],
      group: 'TweetId',
      include: [
        { model: Like, attributes: ['createdAt'] },
        { model: Reply, attributes: [] },
        {
          model: User,
          attributes:
            ['id', 'name', 'avatar', [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account']]
        }
      ],
      order: [[Sequelize.col('Likes.createdAt'), 'DESC']]
    })
  },

  checkUnique: async ({ email, account }, userId = null) => {
    if (email) {
      email = await User.findOne({ where: { email, [Op.not]: { id: userId } } })
      if (email) throw new RequestError('This email is exist.')
    }
    if (account) {
      account = await User.findOne({ where: { account, [Op.not]: { id: userId } } })
      if (account) throw new RequestError('This account is exist.')
    }
  }
}

module.exports = userService
