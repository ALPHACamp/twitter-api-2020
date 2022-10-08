const { Like, Reply, Tweet, User } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    // GET /api/tweets - 瀏覽所有推文
    return Tweet.findAll({
      attributes: { exclude:[ 'updatedAt' ] },
      include: [{
        model: User,
        attributes: [ 'id', 'account', 'name', 'avatar' ]
      }, 
      {model: Like},
      {model: Reply},
    ]
    })
    .then(tweets => {
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        likeCount: tweet.Likes.length,
        replyCount: tweet.Replies.length
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
      res.status(200).json(data)
    })
    .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    // GET /api/tweets/:tweet_id - 讀取特定推文
  },
  postTweet:(req, res, next) => {
    // POST /api/tweets - 發布一筆推文
  },
  likeTweet:(req, res, next) => {
    // POST /api/tweets/:tweet_id/like - 喜歡一則推文
    const TweetId = req.params.id
    const UserId = req.user.id
    return Promise.all([
      Tweet.findByPK(TweetId),
      Like.findOne({
        where: {
          TweetId,
          UserId
        }
      })
    ])
    .then(([tweet, likedTweet]) => {
      if (!tweet) throw new Error('Tweet does not exist!')
      if (likedTweet) throw new Error('You hav liked this Tweet!')
      return Like.create({
        TweetId,
        UserId
      })
    })
    .then(likeRecord => res.status(200).json(likeRecord))
    .catch(err => next(err))
  },
  unlikeTweet:(req, res, next) => {
    // POST /api/tweets/:tweet_id/unlike - 取消喜歡一則推文
  },
  getReplies:(req, res, next) => {
    // GET /api/tweets/:tweet_id/replies - 讀取回覆串
  },
  postReply:(req, res, next) => {
    // POST /tweets/:tweet_id/replies - 新增回覆
  }
}

module.exports = tweetController