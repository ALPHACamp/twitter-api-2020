const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like

const sequelize = require('sequelize')
const helpers = require('../../_helpers.js')


const tweetController = {

  replyTweet: async (req, res, next) => { },

  getReplies: async (req, res, next) => { },

  likeTweet: async (req, res, next) => { },

  unlikeTweet: async (req, res, next) => { },

  getTweet: async (req, res, next) => { },

  postTweet: async (req, res, next) => { },

  getTweets: async (req, res, next) => {
    try {
      const rawTweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'repliesCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likesCount'],
          ],
          exclude: ['updatedAt']
        }
      })
      const likedTweets = await Like.findAll({
        raw: true,
        nest: true,
        where: { UserId: helpers.getUser(req).id },
        attributes: ['TweetId']
      })
      const tweets = rawTweets.map(t => ({
        ...t,
        isLiked: likedTweets.map(element => element.TweetId).includes(t.id)
      }))

      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  },

}

module.exports = tweetController