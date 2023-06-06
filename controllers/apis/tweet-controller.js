const { getUser } = require('../../_helpers')
const { Tweet } = require('../../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
    //   const { description } = req.body
      const user = getUser(req)
      console.log(user)
      //   const tweet = await Tweet.create({
      //     UserId: user.id,
      //     description
      //   })
      return res.json({ status: 'success', data: user })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
