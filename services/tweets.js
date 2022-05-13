const { Tweet } = require('../models')
const tweets = {
  getAll: async () => {
    try {
      const tweets = await Tweet.findAll({ raw: true })
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
