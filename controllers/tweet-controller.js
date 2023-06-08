const { Tweet, User, Like, Reply } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [
          User,
          Reply,
          Like,
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets) {
        return res.status(404).json({ status: 'error', message: "Tweets didn't exist!" })
      }
      data = tweets.map(tweet => {
        return {
          id: tweet.id,
          userId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          account: tweet.User.account,
          name: tweet.User.name,
          avatar: tweet.User.avatar,
          likedCount: tweet.Likes.length,
          repliedCount: tweet.Replies.length,
          // isLiked: tweet.LikedUsers.map(t => t.id).includes(req.user.id)
        }
      })
      return res.status(200).json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const id = req.params.id
      console.log(req.params)
      const tweet = await Tweet.findByPk(id,
        {
          include: [
            User,
            Like,
            Reply,
            { model: User, as: 'LikedUsers' }]
        })
      if (!tweet) {
        return res.status(404).json({ status: 'error', message: "Tweet didn't exist!" })
      }
      return res.status(200).json({
        status: 'success',
        data: {
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        account: tweet.User.account,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        likedCount: tweet.Likes.length,
        repliedCount: tweet.Replies.length,
        // isLike: tweet.LikedUsers.map(t => t.id).includes(req.user.id)
        }
      })
    } catch (err) {
      next(err)
    }
  },
}

module.exports = tweetController