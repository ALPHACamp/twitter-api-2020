const { User, Like, sequelize } = require('../models')

const userService = {
  signIn: async (email) => {
    return await User.findOne({
      where: { email }
    })
  },

  signUp: async (formBody) => {
    const [user, created] = await User.findOrCreate({
      where: { email: formBody.email },
      defaults: {
        ...formBody
      }
    })
    if (!created) throw new Error('This email is already exist.')
    return user
  },

  getUser: async (id) => {
    const user = await User.findByPk(id)
    return user.toJSON()
  },

  putUser: async (id, body) => {
    // TODO: Need to check 'email' and 'account' are both unique.
    // const existAccount = await User.fineOne({ where: { account: body.account } })
    // if (existAccount) throw new Error('This account name is already exist.')
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
        [sequelize.literal(`(exists (SELECT 1 FROM followships WHERE FollowerId = ${id} AND FollowingId = User.id))`), 'isFollowed'],
        [sequelize.fn('count', sequelize.col('Followers.id')), 'FollowerCount']
      ],
      include: { model: User, as: 'Followers', attributes: [], through: { attributes: [] } },
      order: [
        [sequelize.col('FollowerCount'), 'DESC'],
        [sequelize.col('isFollowed'), 'DESC']
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
  }
}

module.exports = userService
