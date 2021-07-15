// TODO: 目前getUsers取出的資料含root，前端可能不需要。

const { User, Tweet, Like, Sequelize } = require('../models')
const { Op } = Sequelize

const RequestError = require('../utils/customError')

const adminService = {
  deleteTweet: async (tweetId) => {
    const tweet = await Tweet.findByPk(tweetId, { include: [Like] })
    if (!tweet) throw new RequestError(`Cannot find tweet id ${tweetId}`)
    await tweet.destroy()
    return ({ status: 'success', message: `the tweet id ${tweetId} deleted successfully` })
  },

  getUsers: async () => {
    return await User.findAll({
      where: { role: { [Op.not]: 'admin' } },
      attributes: [
        'id',
        'name',
        [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account'],
        'avatar',
        'cover',
        [Sequelize.literal('count(distinct Tweets.id)'), 'TweetsCount'],
        [Sequelize.literal('count(distinct Likes.id)'), 'LikesCount'],
        [Sequelize.literal('count(distinct Followers.id)'), 'FollowersCount'],
        [Sequelize.literal('count(distinct Followings.id)'), 'FollowingsCount']
      ],
      group: 'id',
      order: [[Sequelize.literal('TweetsCount'), 'DESC']],
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
