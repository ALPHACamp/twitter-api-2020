const { User, Like, Sequelize } = require('../models')

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

  // TODO: 
  getUser: async (viewingId, currentUserId = 0) => {
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
    await userService.checkUnique(body)
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

  checkUnique: async ({ email, account }) => {
    if (email) {
      email = await User.findOne({ where: { email } })
      if (email) throw new Error('This email is exist.')
    }
    if (account) {
      account = await User.findOne({ where: { account } })
      if (account) throw new Error('This account is exist.')
    }
  }
}

module.exports = userService
