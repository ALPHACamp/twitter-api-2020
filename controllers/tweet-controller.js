const { Like, Reply, Tweet, User } = require('../models')
const { getUser } = require('../_helpers')
const tweetController = {
  getTweets: (req, res, next) => {
    // GET /api/tweets - 瀏覽所有推文
  },
  getTweet: (req, res, next) => {
    // GET /api/tweets/:tweet_id - 讀取特定推文
  },
  postTweet:(req, res, next) => {
    // POST /api/tweets - 發布一筆推文
  },
  likeTweet:(req, res, next) => {
    // POST /api/tweets/:tweet_id/like - 喜歡一則推文
  },
  unlikeTweet:(req, res, next) => {
    // POST /api/tweets/:tweet_id/unlike - 取消喜歡一則推文
  },
  getReplies:(req, res, next) => {
    // GET /api/tweets/:tweet_id/replies - 讀取回覆串
    return Promise.all([
      Tweet.findByPk(req.params.id, {
        attributes: ['id'],
        include: [{
          model: User,
          as: 'tweetAuthor',
          attributes: ['account']
        }]
      }),
      Tweet.findByPk(req.params.id,{
      include: [{
        model: Reply, include: [{
          model: User,
          attributes: ['id', 'account', 'avatar', 'name']
        }],
        attributes: { exclude: ['UserId', 'updatedAt'] }
      },
    ]
      })
    ])
    .then(([author, result]) => {
      if (!result) throw new Error('The tweet does not exist')
      result = result.Replies.map(reply => ({
        ...reply.toJSON(),
        tweetAuthorAccount: author.tweetAuthor.account
      }))
      .sort((a,b) => b.createdAt - a.createdAt)
      res.status(200).json(
        result
      )
    })
    .catch(err => next(err))
  },
  postReply:(req, res, next) => {
    // POST /api/tweets/:tweet_id/replies - 新增回覆
    const { comment } = req.body
    const targetTweetId = req.params.id
    const replierId = req.user.dataValues.id
    if (!comment) throw new Error('Comment text is required!')
    return Promise.allSettled([
      Tweet.findByPk(targetTweetId),
      User.findByPk(replierId)
    ])
    .then(([tweet, user]) => {
      if (!user) throw new Error('User does not exist!')
      if (!tweet) throw new Error('Tweet does not exist!')
      return Reply.create({
        UserId: replierId,
        TweetId: targetTweetId,
        comment
      })
    })
    .then(reply => {
      res.status(200).json(reply)
    })
    .catch(err => next(err))
  },
}

module.exports = tweetController