const adminDummy = require('./dummy/admin-dummy.json')
const tweetDummy = require('./dummy/tweet-dummy.json')
const userDummy = require('./dummy/users-dummy.json')

const dummyController = {
  adminGetUsersDummy: (req, res, next) => {
    res.json(adminDummy.getUsers)
  },
  adminGetTweetsDummy: (req, res, next) => {
    res.json(adminDummy.getTweets)
  },
  adminDeleteTweetDummy: (req, res, next) => {
    res.json(adminDummy.deleteTweet)
  },
  getTopUsersDummy: (req, res, next) => {
    res.json(userDummy.getTopUsers)
  },
  getUserDummy: (req, res, next) => {
    res.json(userDummy.getUser)
  },
  getUsersDummy: (req, res, next) => {
    res.json(userDummy.getUsers)
  },
  getTweetDummy: (req, res, next) => {
    res.json(tweetDummy.getTweet)
  },
  getTweetsDummy: (req, res, next) => {
    res.json(tweetDummy.getTweets)
  },
  getUserTweet: (req, res, next) => {
    res.json(userDummy.getUserTweet)
  }
}

module.exports = dummyController
