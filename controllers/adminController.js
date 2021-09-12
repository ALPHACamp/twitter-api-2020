const adminService = require('../services/adminService')

const adminController = {
  getUsers: async (req, res) => {
    const users = await adminService.getUsers()

    // Check whether users exists
    if (!users) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No users found' })
    }

    return res
      .status(200)
      .json(users)
  },

  getTweets: async (req, res) => {
    const tweets = await adminService.getTweets()

    // Check whether tweets exists
    if (!tweets.length) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No tweets found' })
    }

    return res
      .status(200)
      .json(tweets)
  },

  deleteTweet: async (req, res) => {
    const tweet = await adminService.deleteTweet(req.params.id)

    // Check whether tweet exists
    if (!tweet) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No tweet found' })
    }
    
    await tweet.destroy()
    return res
      .status(200)
      .json({
        status: 'success',
        message: `The tweet id ${tweet.id} deleted successfully`
      })

  }
}

module.exports = adminController
