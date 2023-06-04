const { getUser } = require('../_helpers')
const { Op } = require('sequelize')

const { User, Tweet, Reply, Like, Followship } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    // name, accout, tweet, count(reply), count(like)
    // 確認user存在
    try {
      const user = getUser(req)
      console.log(req)
      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }
      const userData = user.toJSON()

      // 先找到user追蹤的人
      const followingIds = await Followship.findAll({
        where: { followerId: userData.id },
        attributes: ['followingId'],
        raw: true
      }).map(followship => followship.followingId)

      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            as: 'Users',
            attributes: ['id', 'name', 'account'],
            where: {
              id: {
                [Op.in]: followingIds
              }
            }
          },
          {
            model: Reply,
            as: 'Replies'
          },
          {
            model: Like,
            as: 'Likes'
          }
        ],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      const data = tweets.rows.map(t => ({
        ...t,
        replyCount: t['Replies.length'],
        likeCount: t['Likes.length']
      }))
      console.log(data)
      res(null, { tweets: data })

      return res.status(200).json({
        tweets: data
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
