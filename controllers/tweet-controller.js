const { Tweet, User, Like, sequelize } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const userId = getUser(req).id
      const [tweets, likes] = await Promise.all([
        Tweet.findAll({
          order: [['createdAt', 'desc']],
          include: [{
            model: User,
            attributes: ['account', 'name', 'avatar']
          }],
          attributes: {
            include: [
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'
                ),
                'likesNum'
              ],
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`TweetId` = `Tweet`.`id`)'
                ),
                'repliesNum'
              ]
            ]
          },
          nest: true,
          raw: true
        }),
        Like.findAll({
          where: { UserId: userId }
        })
      ])
      const result = tweets.map(tweet => ({
        ...tweet,
        isLiked: likes.some(like => like.TweetId === tweet.id)
      }))
      return res.json(result)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = tweetController
