const db = require("../models")
const { Tweet, User, Like, Reply } = db



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
      .catch(error => {
        console.log('error')
        res.status(500).json({ status: 'error', message: 'error' })
      })

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
      .catch(error => {
        console.log('error')
        res.status(500).json({ status: 'error', message: 'error' })
      })
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
        .catch(error => {
          console.log('error')
          res.status(500).json({ status: 'error', message: 'error' })
        })
    }

  },
  getReplies: (req, res) => {
    return Reply.findAll({
      where: { TweetId: req.params.tweet_id }
    })
      .then(replies => {
        return res.status(200).json(replies)
      })
      .catch(error => {
        console.log('error')
        res.status(500).json({ status: 'error', message: 'error' })
      }
      )
  },
  postReply: async (req, res) => {
    if (!req.body.comment) { return res.status(204).json({ status: 'error', message: 'Please input comment' }) }
    else if (req.body.comment.length >= 50) { return res.status(409).json({ status: 'error', message: 'comment can\'t be more than 50 words' }) }
    else {
      await Reply.create({
        UserId: req.user.id,
        TweetId: req.params.tweet_id,
        comment: req.body.comment
      })
        .then((reply) => { res.status(200).json({ status: 'success', message: 'The comment was successfully created' }) })
        .catch(error => {
          console.log('error')
          res.status(500).json({ status: 'error', message: 'error' })
        })
    }

  },
  postLike: async (req, res) => {
    let liked = await Like.findOne({
      where: { UserId: req.user.id, TweetId: req.params.id }
    })
    if (liked) { res.status(400).json({ status: 'error', message: 'error' }) }
    else {
      Like.create({ UserId: req.user.id, TweetId: req.params.id })
        .then(like => { res.status(200).json({ status: 'success', message: 'The like was successfully created' }) })
        .catch(error => {
          console.log('error')
          res.status(500).json({ status: 'error', message: 'error' })
        })

    }

  },
  postUnlike: (req, res) => {

  },

}


module.exports = TweetController