const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../../models')
const Tweet = db.Tweet
const Reply = db.Reply
const helpers = require('../../_helpers');

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: Reply,
    }).then(tweets => {
      res.json({ tweets: tweets })
    })
  }
}

module.exports = tweetController
