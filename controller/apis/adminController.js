const helper = require('../../_helpers')
const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
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
          [sequelize.col('User.name'), 'userName'],
          [sequelize.col('User.cover'), 'userCover'],
          [sequelize.col('User.avatar'), 'userAvatar'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('likes.id'))), 'likesCount'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Tweet.id'))), 'tweetsCount'],
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
          [sequelize.literal('followersCount DESC')],
          [sequelize.literal('userName ASC')] //追蹤人數一樣時，依userName排序
        ]
      })
      return res.json(users)
    } catch (err) {
      console.log(err)
    }
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
