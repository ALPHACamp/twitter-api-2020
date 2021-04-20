const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  //  列出所有tweets以及資訊
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        order: [['updatedAt', 'DESC']],
        include: [User,
          { model: User, as: 'LikedUsers' }
          , { model: User, as: 'RepliedUsers' }
        ]
      })

      if (tweets.length === 0) {
        return res.json({ message: 'There is no tweets in database.' })
      }

      tweets = tweets.map(tweet => ({
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        likedCount: tweet.LikedUsers.length,
        repliedCount: tweet.RepliedUsers.length,
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        }
      }))

      return res.json(tweets)

    } catch (e) {
      console.log(e)
    }
  },
  getTweet: async (req, res) => {
    try {
      const tweetId = req.params.tweet_Id
      let tweet = await Tweet.findByPk(tweetId, {
        include: [User, Like, { model: Reply, include: [User] }],
        order: [
          [{ model: Reply }, 'updateAt', 'DESC']
        ]
      })
      cleanTweet = {
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        likedCount: tweet.Likes.length,
        repliedCount: tweet.Replies.length,
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        },
        Replies: tweet.Replies.map(r => ({
          id: r.id,
          comment: r.comment,
          updatedAt: r.updatedAt,
          User: {
            id: r.User.id,
            avatar: r.User.avatar,
            name: r.User.name,
            account: r.User.account
          }
        }))

      }
      return res.json({ cleanTweet })
    } catch (e) { console.log(e) }


  }
}

module.exports = tweetController