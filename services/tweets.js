const { Tweet, User, Like, Reply } = require('../models')

const tweets = {
  getAll: async () => {
    try {
      const rawTweets = await Tweet.findAll({
        attributes: {
          exclude: ['updatedAt']
        },
        include: [
          {
            model: User,
            attributes: ['name']
          }
        ],
        raw: true
      })
      const likes = await Like.count({
        group: ['Tweet_id'],
        raw: true
      })
      const replies = await Reply.count({
        group: ['Tweet_id'],
        raw: true
      })

      // 下面可能可以用 [sequelize.fn("COUNT", sequelize.col('')), "count"]] 合併到資料庫搜索語法

      const tweets = []
      for (let likeIndex = 0; likeIndex < likes.length; likeIndex++) {
        for (let tweetIndex = 0; tweetIndex < rawTweets.length; tweetIndex++) {
          if (rawTweets[tweetIndex].id === likes[likeIndex].Tweet_id) {
            rawTweets[tweetIndex].likeCounts = likes[likeIndex].count
          }
        }
      }
      for (let replyIndex = 0; replyIndex < replies.length; replyIndex++) {
        for (let tweetIndex = 0; tweetIndex < rawTweets.length; tweetIndex++) {
          if (rawTweets[tweetIndex].id === replies[replyIndex].Tweet_id) {
            rawTweets[tweetIndex].replyCounts = replies[replyIndex].count
            tweets.push(rawTweets[tweetIndex])
          }
        }
      }
      tweets.forEach(element => {
        if (element.likeCounts === undefined) element.likeCounts = 0
        if (element.replyCounts === undefined) element.replyCounts = 0
      })
      return tweets
    } catch (err) {
      console.log(err)
    }
  },
  getOne: async (tweetId) => {
    try {
      const tweet = await Tweet.findByPk(tweetId, { raw: true })
      return tweet
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweets
