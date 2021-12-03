const { Followship } = require('../models')
const { User } = require('../models')

const followController = {
  getTopUser: async (req, res) => {
    const limit = 10
    const users = await User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })

    let result = users.map((user) => ({
      id: user.dataValues.id,
      avatar: user.dataValues.avatar,
      account: user.dataValues.account,
      name: user.dataValues.name,
      followersCount: user.dataValues.Followers.length,
      isFollowing: false,
    }))

    result = result.sort((a, z) => z.followersCount - a.followersCount)

    console.log(result)
  }
}

module.exports = followController