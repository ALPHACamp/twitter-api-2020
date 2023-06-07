const { getUser } = require('../../_helpers')
const { Tweet } = require('../../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      console.log('req--------------------------req')
      console.log(req.user)
      const user = getUser(req)
      const tweet = await Tweet.create({
        UserId: user.id,
        description
      })
      return res.json({ status: 'success', data: tweet })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
