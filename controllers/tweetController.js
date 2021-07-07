const db = require("../models")
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply


const TweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
    })
      .then(tweets => { return res.json({ tweets }) })

  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.tweet_id, {
      include: [
        User,
        { model: Reply, include: [User] }]
    })
      .then(tweet => { return res.json({ tweet }) })
  },

}


module.exports = TweetController