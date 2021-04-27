const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  //  列出所有tweets以及資訊
  getTweets: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      let tweets = await Tweet.findAll({
        order: [['updatedAt', 'DESC']],
        include: [User, Like, Reply]
      })
      // const Liked = tweets.LikedUsers

      if (tweets.length === 0) {
        return res.json({ status: 'error', message: 'There is no tweets in database.' })
      }

      tweets = tweets.map(tweet => {
        const likes = tweet.Likes.map(Like => {
          if (UserId === Like.UserId) {
            return true
          }
        })
        console.log(likes)
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          likedCount: tweet.Likes.length,
          repliedCount: tweet.Replies.length,
          isLiked: likes ? likes.includes(true) : null
          ,
          user: {
            avatar: tweet.User.avatar,
            name: tweet.User.name,
            account: tweet.User.account
          }
        }
      })

      return res.json(tweets)

    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  getTweet: async (req, res) => {
    try {
      const tweetId = req.params.tweet_Id
      const UserId = helpers.getUser(req).id
      let tweet = await Tweet.findByPk(tweetId, {
        include: [User, Like, { model: Reply, include: [User] }],
        order: [
          [{ model: Reply }, 'updatedAt', 'DESC']
        ]
      })

      if (tweet === null) {
        return res.json({ status: 'error', message: "Can't find this tweet." })
      }

      const tweetReplies = helpers.repliesInfos(tweet)
      const likes = tweet.Likes.map(Like => {
        if (UserId === Like.UserId) {
          return true
        }
      })
      tweet = {
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        likedCount: tweet.Likes.length,
        repliedCount: tweet.Replies.length,
        isLiked: likes ? likes.includes(true) : null,
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        },
        tweetReplies: tweetReplies
      }
      return res.json(tweet)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  postTweet: async (req, res) => {
    try {
      const { description } = req.body
      const UserId = helpers.getUser(req).id

      if (!description) {
        return res.json({ status: 'error', message: "It must have description to tweet." })
      } else if (description.length > 140) {
        return res.json({ status: 'error', message: "Description max length is 140 words" })
      }
      await Tweet.create({ UserId, description })
      return res.json({ status: 'success', message: 'Tweet has built successfully!' })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  getReplies: async (req, res) => {
    try {
      const tweetId = req.params.tweet_Id
      const tweet = await Tweet.findByPk(tweetId, {
        include: [{ model: Reply, include: [User] }],
        order: [
          [{ model: Reply }, 'updatedAt', 'DESC']
        ]
      })

      if (tweet === null) {
        return res.json({ status: 'error', message: "Can't find this tweet." })
      }

      const tweetReplies = helpers.repliesInfos(tweet)

      return res.json(tweetReplies)
    }
    catch (e) {
      console.log(e)
      return next(e)
    }
  },
  postReply: async (req, res) => {
    try {
      const { comment } = req.body
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.tweet_Id

      if (!comment) {
        return res.json({ status: 'error', message: "It must have comment to reply." })
      } else if (await Tweet.findByPk(TweetId) === null) {
        return res.json({ status: 'error', message: "This tweetId doesn't exist." })
      } else if (comment.length > 140) {
        return res.json({ status: 'error', message: "comment max length is 140 words" })
      }
      await Reply.create({ TweetId, UserId, comment })
      return res.json({ status: 'success', message: 'Reply has built successfully!' })

    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  tweetLike: async (req, res) => {
    try {
      const TweetId = req.params.tweet_Id
      if (await Tweet.findByPk(TweetId) === null) {
        return res.json({ status: 'error', message: "This tweetId doesn't exist." })
      } else {
        await Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: TweetId
        })
      }

      return res.json({ status: 'success', message: 'Like has built successfully!' })
    } catch (e) { return res.json({ status: 'error', message: 'Failed to build a like.' }) }
  },
  tweetUnlike: async (req, res) => {
    try {
      like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweet_Id
        }
      })
      await like.destroy()
      return res.json({ status: 'success', message: 'Like has removed successfully!' })
    } catch (e) { return res.json({ status: 'error', message: 'Failed to remove a like.' }) }
  }
}

module.exports = tweetController