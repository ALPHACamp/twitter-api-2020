const db = require('../../models')

const { Tweet, Reply, Like } = db

const tweetController = {
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll()
    console.log(tweets)
    return res.json(tweets)
  },
  getTweet: async (req, res) => {
    const tweet = await Tweet.findByPk(req.params.id)
    console.log(tweet)
    return res.json(tweet)
  },
  getReplies: async (req, res) => {
    const replies = await Reply.findAll({
      where: { TweetId: req.params.id }
    })
    console.log(replies)
    return res.json(replies)
  },
  postTweet: async (req, res) => {
    const { description } = req.body
    if (!description) {
      // 400 = bad request
      return res.status(400).json({ status: 'error', message: 'description is required' })
    }
    const userId = req.user ? req.user.id : 1 // 1 is for testing only
    const tweet = await Tweet.create({
      UserId: userId,
      description
    })
    return res.json(tweet)
  },
  postReply: async (req, res) => {
    const { comment } = req.body
    const { tweetId } = req.params
    if (!comment) {
      return res.status(400).json({ status: 'error', message: 'comment is required' })
    }

    const userId = req.user ? req.user.id : 1 // 1 is for testing only
    const reply = await Reply.create({
      UserId: userId,
      TweetId: tweetId,
      comment
    })
    return res.json(reply)
  },
  likeTweet: async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user ? req.user.id : 1 // 1 is for testing only
    // check if tweet id exist
    const tweet = await Tweet.findByPk(tweetId)
    if (!tweet) {
      return res.status(400).json({ status: 'error', message: 'tweet doesn\'t exist' })
    }
    // check if already liked
    const like = await Like.findOne({
      where: { UserId: userId, TweetId: tweetId }
    })
    if (like) {
      return res.status(400).json({ status: 'error', message: 'tweet already liked by this user' })
    }
    // create like
    await Like.create({
      UserId: userId,
      TweetId: tweetId
    })
    return res.json({ status: 'success', message: 'Success' })
  },
  unlikeTweet: async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user ? req.user.id : 1 // 1 is for testing only

    const like = await Like.findOne({
      where: { UserId: userId, TweetId: tweetId }
    })
    if (!like) {
      return res.status(400).json({ status: 'error', message: 'no liked record or tweet not exist' })
    }
    await like.destroy()
    return res.json({ status: 'success', message: 'Success' })
  }
}

module.exports = tweetController
