const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  // 所有推文、作者 依date排序
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        include: [User,
          { model: User, as: 'LikedUsers' }
          , { model: User, as: 'RepliedUsers' }
        ]// 找到推問like,reply數量 作者name
      })

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