const tweetDummy = require('./dummy/tweet-dummy.json')

const tweetController = {
  getTweets: (req, res, next) => {
    console.log('getTweets')
    res.json(tweetDummy.getTweets)
  },
  getTweet: (req, res, next) => {
    res.json(tweetDummy.getTweet)
  }
}

module.exports = tweetController
