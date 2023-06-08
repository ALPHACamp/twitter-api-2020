const tweetDummy = require('./dummy/tweet-dummy.json')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

const tweetController = {
  getTweets: (req, res, next) => {
    console.log('getTweets')
    res.json(tweetDummy.getTweets)
  },
  getTweet: (req, res, next) => {
    res.json(tweetDummy.getTweet)
  },
  signUp: (req, res, next) => {
  }
}

module.exports = tweetController
