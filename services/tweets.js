const { Tweet } = require('../models')
const tweets = {
  getAll: async () => {
    try {
      const tweets = await Tweet.findAll()
      return tweets
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweets
