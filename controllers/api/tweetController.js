const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../../models')
const Tweet = db.Tweet
const helpers = require('../../_helpers');

const tweetController = {
  // getTweets: (req, res) => {
  //   Tweet.findAll({
  //     include: Reply,
  //     where: { UserId: req.user.id }
  //   })
  // }
}

module.exports = tweetController
