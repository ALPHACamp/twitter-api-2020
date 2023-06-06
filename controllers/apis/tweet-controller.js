// const tweetServices = require('../../services/restaurant-services')
const tweetController = {
    getTweets: (req, res, next) => {
      res.send('Hello World!')
      // tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
    }
}
module.exports = tweetController