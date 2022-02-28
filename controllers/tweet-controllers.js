const helpers = require('../_helpers')
const { User, Tweet, Reply, Like } = require("../models");

const tweetController = {
  getReplies: async (req, res, next) => {
    const { tweet_id } = req.params;
    try {
      const tweet = await Tweet.findByPk(tweet_id, {
        include: [
          { model: Reply, other: ['createAt', 'DESC'], include: [{model: User, attributes: ['id', 'name', 'account', 'avatar']}]},
          { model: User }
        ],
      })
          if (!tweet) return res.json({ status: "error", message: "Tweet didn't exist!" });
          
          return res.json(tweet);
    } catch (err) { next(err) }
  },

  addLike: async (req, res, next) => {
    const UserId = helpers.getUser(req).id;
    const TweetId = req.params.tweet_id

    try {
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.json({ status: "error", message: "Tweet didn't exist!"})

      const like = await Like.findOne({ where: { UserId, TweetId }})
      if (like) return res.json({ status: "error", message: "You have like this tweet!"})

      return Like.create({ UserId, TweetId })
      .then(() => res.json({ status: 'success'}))
    } catch(err) { next(err) }
  },

  removeLike: async (req, res, next) => {
    const UserId = helpers.getUser(req).id;
    const TweetId = req.params.tweet_id

    try {
      const like = await Like.findOne({ where: { UserId, TweetId }})
      if (!like) return res.json({ status: "error", message: "You haven't like this tweet!"})

      return like.destroy()
      .then(() => res.json({ status: 'success'}))
    } catch(err) { next(err) }
  },

  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [{ model: User },
          { model: Reply },
          { model: Like }]
      })
      if (!tweets) {
        return res.json({ status: 'error', message: 'No tweets.' })
      }
      const result = tweets.map(tweet => {
        return {
          TweetId: tweet.id,
          description: tweet.description,
          createdAt: tweet.createdAt,
          tweetUserId: tweet.User.id,
          tweetUserName: tweet.User.name,
          tweetUserAccount: tweet.User.account,
          avatar: tweet.User.avatar,
          repliedCount: tweet.Replies.length,
          likeCount: tweet.Likes.length,
          liked: req.user?.LikedTweets ? req.user.LikedTweets.some(l => l.id === tweet.id) : false
        }
      })
      return res.json(result)
    } catch (err) {
      next(err)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        order: [['createdAt', 'DESC']],
        include: [{ model: User },
          { model: Reply, include: User },
          { model: Like }]
        })
      if (!tweet) {
        return res.json({ status: 'error', message: "This tweet didn't exist!" })
      }
      const reply = tweet.Replies
      const replyResult = reply.map(r => ({
        repliedComment: r.comment,
        createdAt: r.createdAt,
        repliedUser: r.User.id,
        repliedUserName: r.User.name,
        repliedUserAvatar: r.User.avatar
      }))
      const result = {
        TweetId: tweet.id,
        description: tweet.description,
        createdAt: tweet.createdAt,
        tweetUserName: tweet.User.name,
        tweetUserId: tweet.User.id,
        tweetUserAccount: tweet.User.account,
        avatar: tweet.User.avatar,
        repliedCount: reply.length,
        likeCount: tweet.Likes.length,
        liked: req.user?.LikedTweets ? req.user.LikedTweets.some(l => l.id === tweet.id) : false,
        replyResult
      }
      
      return res.json(result)
    } catch (err) {
      next(err)
    }
  },
  
  postTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) return res.json({ status: 'error', message: 'Description is required' })
    if (description.length > 140) return res.json({ status: 'error', message: 'Tweet text must be less than 140 characters.' })
    try {
      await Tweet.create({
        description,
        UserId
      })
      return res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
