const db = require("../models")
const Tweet = db.Tweet
const User = db.User
const Like = db.Like


const TweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [User],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
    })
      .then(tweets => {
        return res.status(200).json(tweets)
      })
      .catch(error => console.log('error'))

  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.tweet_id, {
      include: [
        User,
        Like,]
    })
      .then(tweet => {
        return res.status(200).json({
          description: tweet.description,
          tweet,
          LikeCount: tweet.Likes.length,
          status: 'success',
          message: 'Get the tweet successfully'
        })
      })
      .catch(error => console.log('error'))
  },
  postTweet: async (req, res) => {
    if (!req.body.description) { return res.status(204).json({ status: 'error', message: 'Please input tweet' }) }
    else if (req.body.description.length >= 140) { return res.status(409).json({ status: 'error', message: 'tweet can\'t be more than 140 words' }) }
    else {
      await Tweet.create({
        UserId: req.user.id,
        description: req.body.description
      })
        .then((tweet) => { res.status(200).json({ status: 'success', message: 'The tweet was successfully created' }) })
        .catch(error => console.log('error'))
    }


  }

}


module.exports = TweetController