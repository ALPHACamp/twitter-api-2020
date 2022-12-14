const { Tweet } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return res.send('tweets')
  },
  postTweets: (req, res, next) => {
    const { description } = req.body
    if (description.length > 120) throw new Error('description is limited to 120 words!')
    if (!description.trim()) throw new Error('description can not be blank!')
    if (!description) throw new Error('description is required!')
    return Tweet.create({
      description,
      UserId: req.user.id
    })
      .then(newTweet => {
        const data = { tweet: newTweet }
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
