const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const helper = require('../../_helpers')
const { sequelize } = require('../../models')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: { role: null},
        raw: true,
        nest: true,
        include: [
          { model: Tweet, attributes: [] },
          { model: Like, attributes: [] }
        ],
        attributes: [
          [sequelize.col('User.id'), 'userId'],
          [sequelize.col('User.name'), 'name'],
          [sequelize.col('User.cover'), 'cover'],
          [sequelize.col('User.avatar'), 'avatar'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('likes.id'))), 'likesCount'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('tweets.id'))), 'tweetsCount'],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)`
            ),
            `followingsCount`
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)`
            ),
            `followersCount`
          ],
        ],
        group: ['User.id'],
        order: [
          [sequelize.literal('tweetsCount DESC')],
          [sequelize.literal('name ASC')] //推文一樣時，依userName排序
        ]
      })
      return res.status(200).json(users)
    } catch (err) {
      console.log(err)
      return res.status(400).json({ status: 'error', message: err })
    }
  },
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      include: [{ model: User, attributes: [] }],
      attributes: {
        include: [
          [sequelize.col('User.name'), 'UserName'],
          [sequelize.col('User.account'), 'UserAccount'],
          [sequelize.col('User.id'), 'UserId'],
          [sequelize.col('User.avatar'), 'UserAvatar']
        ]
      }
    })
    return res.status(200).json({ tweets })
  },
  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.destroy({ where: { id: req.params.id } })
      return res.status(200).json({ message: '刪除成功' })
    } catch (err) {
      console.log(err)
      return res.status(401).json(err)
    }
  }
}

module.exports = adminController
