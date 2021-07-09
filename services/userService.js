const { User, Like, Sequelize } = require('../models')
const { Op } = Sequelize

const RequestError = require('../utils/customError')

const userService = {
  signIn: async (email) => {
    return await User.findOne({
      where: { email }
    })
  },

  signUp: async (formBody) => {
    await userService.checkUnique(formBody)
    const user = await User.create({
      ...formBody
    })
    return user
  },

  getUser: async (viewingId, currentUserId = null) => {
    const user = await User.findByPk(viewingId, {
      attributes: [
        'id', 'email', 'name', 'avatar', 'introduction', 'cover', 'account', 'role', 'createdAt',
        [Sequelize.literal(`if(exists (SELECT 1 FROM followships WHERE FollowerId = ${currentUserId} AND FollowingId = User.id), 'true','false')`), 'isFollowed']
      ],
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like }
      ]
    })
    return user.toJSON()
  },

  putUser: async (id, body) => {
    await userService.checkUnique(body, id)
    const user = await User.update(
      { ...body },
      { where: { id } }
    )
    return user
  },

  getFollowings: async (id) => {
    const followings = await User.findByPk(id, {
      attributes: [],
      include: [
        {
          model: User,
          as: 'Followings',
          attributes: [['id', 'followingId'], 'account', 'name', 'avatar', 'introduction'],
          through: { attributes: [] }
        }
      ]
    })
    return followings.toJSON().Followings
  },

  getFollowers: async (id) => {
    const followers = await User.findByPk(id, {
      attributes: [],
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: [['id', 'followerId'], 'account', 'name', 'avatar', 'introduction'],
          through: { attributes: [] }
        }
      ]
    })
    return followers.toJSON().Followers
  },

  getTopUsers: async (id) => {
    return await User.findAll({
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'introduction',
        [Sequelize.literal(`if(exists (SELECT 1 FROM followships WHERE FollowerId = ${id} AND FollowingId = User.id),'true','false')`), 'isFollowed'],
        [Sequelize.fn('count', Sequelize.col('Followers.id')), 'FollowerCount']
      ],
      include: { model: User, as: 'Followers', attributes: [], through: { attributes: [] } },
      order: [
        [Sequelize.col('FollowerCount'), 'DESC'],
        [Sequelize.col('isFollowed'), 'DESC']
      ],
      group: ['id'],
      subQuery: false,
      raw: true,
      nest: true
    })
  },

  getLikes: async (id) => {
    const likes = await User.findByPk(id, {
      attributes: [],
      include: Like
    })
    return likes.toJSON().Likes
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
