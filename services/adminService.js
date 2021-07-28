const db = require('../models')
const { User, Tweet, Sequelize } = db
const { Op } = Sequelize
const RequestError = require('../libs/RequestError')

const adminService = {
  getUsers: (req, res) => {
    return User.findAll({
      where: {
        [Op.or]: [
          { role: { [Op.ne]: 'admin' } },
          { role: { [Op.is]: null } }
        ]
      },
      attributes: [
        'id', 'account', 'name', 'avatar', 'cover', 'followerCount', 'followingCount',
        [Sequelize.fn('COUNT', Sequelize.col('Tweets.UserId')), 'tweetCount'],
        [Sequelize.fn('SUM', Sequelize.col('Tweets.likeCount')), 'likeCount']
      ],
      include: [
        {
          model: Tweet, attributes: []
        }
      ],
      order: [[Sequelize.literal('tweetCount'), 'DESC']],
      group: 'id'
    }).then(users => {
      return users
    })
  },
}

module.exports = adminService
