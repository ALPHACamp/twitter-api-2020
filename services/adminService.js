// TODO: 目前getUsers取出的資料含root，前端可能不需要。

const { User, Tweet, Like, Sequelize } = require('../models')
const { Op } = Sequelize

const adminService = {
  deleteTweet: async (tweetId) => {
    await Tweet.destroy({ where: { id: tweetId } })
    return ({ status: 'success', message: `the tweet id ${tweetId} deleted successfully` })
  },

  getUsers: async () => {
    return await User.findAll({
      raw: true,
      nest: true,
      where: { role: { [Op.not]: 'admin' } },
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'cover',
        [Sequelize.literal('count(distinct Tweets.id)'), 'TweetsCount'],
        [Sequelize.literal('count(distinct Likes.id)'), 'LikesCount'],
        [Sequelize.literal('count(distinct Followers.id)'), 'FollowersCount'],
        [Sequelize.literal('count(distinct Followings.id)'), 'FollowingsCount']
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
