const tweetServices = require('../services/tweet-services')
const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data }))
  },

}
module.exports = tweetController