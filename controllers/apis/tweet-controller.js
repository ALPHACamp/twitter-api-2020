const { Tweet } = require('../../models')
const helpers = require('../../_helpers')

const tweetController = {
  postTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req)?.id

    try {
      if (!description || !UserId) {
        throw new Error('Data is missing a description or UserId!!')
      }
      const data = await Tweet.create({
        description,
        UserId
      })

      return res.json({
        status: 'success',
        data
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
