const db = require("../models")
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like


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
        Like,
        { model: Reply, include: [User] }]
    })
      .then(tweet => {
        return res.json({
          tweet,
          LikeCount: tweet.Likes.length
        })
      })
  },
  postTweet: (req, res) => {
    if (!req.body.description) { return res.json({ status: 'error', message: 'Please input tweet' }) }
    else {
      return Tweet.create({
        UserId: req.user.id,
        description: req.body.description
      })
        .then((tweet) => { res.json({ status: 'success', message: 'The tweet was successfully created' }) })
    }


  }

}


module.exports = TweetController