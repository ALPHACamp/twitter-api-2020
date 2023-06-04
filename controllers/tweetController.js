const { getUser } = require('../_helpers')
// helpers.getUser(req);
const { Op } = require('sequelize')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    // 確認user存在
    try {
      const user = getUser(req)
      // console.log(req)
      if (!(user instanceof User)) {
        return res.status(400).json({ error: 'User not found' })
      }
      const userData = user.get({ plain: true })
      delete userData.password
      // console.log(userData)

      // 先找到user追蹤的人
      const followships = await Followship.findAll({
        where: { followerId: userData.id },
        attributes: ['followingId'],
        raw: true
      })
      const followingIds = followships.map(followship => followship.followingId)

      const tweets = await Tweet.findAll({
        attributes: [
          'id',
          'description',
          'createdAt',
          [
            sequelize.fn('COUNT', sequelize.col('Replies.TweetId')),
            'replyCount'
          ],
          [sequelize.fn('COUNT', sequelize.col('Likes.TweetId')), 'likeCount']
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
            // where: {
            //   id: {
            //     [Op.in]: followingIds
            //   }
            // }
          },
          {
            model: Reply,
            attributes: []
          },
          {
            model: Like,
            // where: { isLiked: true },
            attributes: []
          }
        ],
        group: ['Tweet.id', 'User.id'],
        order: [['createdAt', 'DESC']],
        raw: true
      })

      const data = tweets.map(tweet => {
        return {
          tweetId: tweet.id,
          tweetText: tweet.description,
          user: {
            id: tweet['User.id'],
            name: tweet['User.name'],
            avatar: tweet['User.avatar'],
            account: tweet['User.account']
          },
          tweetTime: tweet.createdAt,
          replyCount: tweet.replyCount || 0,
          likeCount: tweet.likeCount || 0
        }
      })
      // ------------------------------
      return res.status(200).json({
        tweets: data
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
