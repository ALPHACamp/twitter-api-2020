const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  //  列出所有tweets以及資訊
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        order: [['updatedAt', 'DESC']],
        include: [User,
          { model: User, as: 'LikedUsers' }
          , { model: User, as: 'RepliedUsers' }
        ]
      })

      if (users.length === 0) {
        return res.json({ message: 'There is no tweets in database.' })
      }

      tweets = tweets.map(t => ({
        ...t.dataValues,
        description: t.dataValues.description.substring(0, 100),
        likedCount: t.LikedUsers.length,
        repliedCount: t.RepliedUsers.length
      }))

      return res.json(tweets)

    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = tweetController