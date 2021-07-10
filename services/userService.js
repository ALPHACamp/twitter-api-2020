const { User, Tweet, Reply, Like, Sequelize } = require('../models')
const { Op } = Sequelize

const RequestError = require('../utils/customError')

const userService = {
  signIn: async (email) => {
    return await User.findOne({ where: { email } })
  },

  signUp: async (formBody) => {
    await userService.checkUnique(formBody)
    const user = await User.create({ ...formBody })
    return user
  },

  getUser: async (viewingId, currentUserId = null) => {
    const user = await User.findByPk(viewingId, {
      attributes: [
        'id', 'email', 'name', 'avatar', 'introduction', 'cover', 'role', 'createdAt',
        [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account'],
        [Sequelize.literal(`exists (SELECT 1 FROM followships WHERE FollowerId = ${currentUserId} AND FollowingId = User.id)`), 'isFollowed']
      ],
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like }
      ]
    })
    return user
  },

  putUser: async (id, body) => {
    await userService.checkUnique(body, id)
    const user = await User.update({ ...body }, { where: { id } })
    return user
  },

  getFollowings: async (userId, currentUserId) => {
    const followings = await User.findAll({
      where: {
        id: {
          [Op.in]: [Sequelize.literal(`select followingId from followships where followerId = ${userId}`)]
        }
      },
      attributes: [
        ['id', 'followingId'], 'name', 'avatar', 'introduction',
        [Sequelize.fn('concat', '@', Sequelize.col('account')), 'account'],
        [Sequelize.literal(`exists (SELECT 1 FROM followships WHERE FollowerId = ${currentUserId} AND FollowingId = User.id)`), 'isFollowed']
      ]
    })
    return followings
  },

  getFollowers: async (userId, currentUserId) => {
    const followers = await User.findAll({
      where: {
        id: {
          [Op.in]: [Sequelize.literal(`select followerId from followships where followingId = ${userId}`)]
        }
      },
      attributes: [
        ['id', 'followerId'], 'name', 'avatar', 'introduction',
        [Sequelize.fn('concat', '@', Sequelize.col('account')), 'account'],
        [Sequelize.literal(`exists (SELECT 1 FROM followships WHERE FollowerId = ${currentUserId} AND FollowingId = User.id)`), 'isFollowed']
      ]
    })
    return followers
  },

  getTopUsers: async (id) => {
    return await User.findAll({
      where: { [Op.not]: { role: 'admin' } },
      attributes: [
        'id', 'name', 'avatar', 'introduction',
        [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account'],
        [Sequelize.literal(`exists (SELECT 1 FROM followships WHERE FollowerId = ${id} AND FollowingId = User.id)`), 'isFollowed'],
        [Sequelize.fn('count', Sequelize.col('Followers.id')), 'FollowerCount']
      ],
      include: { model: User, as: 'Followers', attributes: [], through: { attributes: [] } },
      order: [
        [Sequelize.col('FollowerCount'), 'DESC'],
        [Sequelize.col('isFollowed'), 'DESC']
      ],
      group: 'id',
      subQuery: false
    })
  },

  getLikes: async (id) => {
    const likes = await Tweet.findAll({
      where: {
        id: {
          [Op.in]: [Sequelize.literal(`select TweetId from Likes where UserId = ${id}`)]
        }
      },
      attributes: [
        ['id', 'TweetId'], 'createdAt',
        [Sequelize.literal('substring(description,1,50)'), 'description'],
        [Sequelize.literal('count(distinct Likes.id)'), 'LikesCount'],
        [Sequelize.literal('count(distinct Replies.id)'), 'RepliesCount'],
        [Sequelize.literal(`exists(select 1 from Likes where UserId = ${id} and TweetId = Tweet.id)`), 'isLike']
      ],
      group: 'TweetId',
      include: [
        { model: Like, attributes: [] },
        { model: Reply, attributes: [] },
        {
          model: User,
          attributes:
            ['id', 'name', 'avatar', [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account']]
        }
      ],
      order: [[Sequelize.literal('likes.createdAt DESC')]]
    })
    return likes
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
