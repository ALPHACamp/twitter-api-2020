const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply
const helper = require('../../_helpers')
const { sequelize } = require('../../models')
const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: [] },
          { model: Like, attributes: [] }
        ],
        attributes: [
          [sequelize.col('User.id'), 'userId'],
          [sequelize.col('User.name'), 'name'],
          [sequelize.col('User.cover'), 'userCover'],
          [sequelize.col('User.avatar'), 'userAvatar'],
          [
            sequelize.fn(
              'COUNT',
              sequelize.fn('DISTINCT', sequelize.col('likes.id'))
            ),
            'likesCount'
          ],
          [
            sequelize.fn(
              'COUNT',
              sequelize.fn('DISTINCT', sequelize.col('Tweet.id'))
            ),
            'tweetsCount'
          ],
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
          ]
        ],
        group: ['User.id']
      })
      return res.json(users)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
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
