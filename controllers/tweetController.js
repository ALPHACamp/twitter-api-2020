const db = require("../models")
const Tweet = db.Tweet
const User = db.User


const TweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
    })
      .then(tweets => { res.json({ tweets }) })

  },
  /*getTweet: (req, res) => {
    return Tweet.findbyPK(req.params.id)
      .then(tweet => { res.json({ tweet }) })

  },*/

}


module.exports = TweetController