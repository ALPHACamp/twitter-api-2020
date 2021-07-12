const db = require('../models')
const { User, Tweet, Sequelize } = db
const { Op } = require('sequelize')

const adminController = {

  getUsers: (req, res) => {
    return User.findAll({
      where: {
        [Op.or]: [
          { role: { [Op.not]: 'admin' } },
          { name: 'root' }
        ]
      },
      attributes: [
        'id', 'account', 'name', 'avatar', 'cover', 'followerCount', 'followingCount',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'tweetCount'],
        [Sequelize.fn('SUM', Sequelize.col('Tweets.likeCount')), 'likeCount']
      ],
      include: [
        {
          model: Tweet, attributes: []
        }
      ],
      group: 'id',
      // having: { role: { [Op.not]: 'admin' } }
    }).then(users => {
      res.status(200).json(users)
    })
  }
}

module.exports = adminController
