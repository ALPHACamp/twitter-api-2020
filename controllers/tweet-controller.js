const tweetController = {
  getTweet: (req, res, next) => {
    res.send('hello world tweets!') // this is for route testing
  }
}

module.exports = tweetController
