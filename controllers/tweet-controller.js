const { Like, Reply, Tweet, User } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    // GET /api/tweets - 瀏覽所有推文
    return Tweet.findAll({
      attributes: { exclude:[ 'UserId', 'updatedAt' ] },
      include: [{
        model: User,
        as: 'tweetAuthor',
        attributes: [ 'id', 'account', 'name', 'avatar' ]
      }, 
      {model: Like,
      attributes: ['TweetId', 'UserId']},
      {model: Reply,
      attributes: ['id']},
    ]
    })
    .then(tweets => {
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        likeCounts: tweet.Likes.length,
        replyCounts: tweet.Replies.length
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
      res.status(200).json(data)
    })
    .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    // GET /api/tweets/:id - 瀏覽一則推文
    return Tweet.findByPk(req.params.id, {
      attributes: { exclude: ['updatedAt', 'UserId'] },
      include: [
        {
        model: User,
        as: 'tweetAuthor',
        attributes: ['id', 'avatar', 'name', 'account']
        },
        { model: Like,
          attributes: ['UserId']
        },
        { model: Reply,
          attributes: ['UserId']
        }
      ]
    })
    .then(tweet => res.status(200).json(tweet))
    .catch(err => next(err))
  },
  postTweet:(req, res, next) => {
    // POST /api/tweets - 發布一筆推文
    const UserId = getUser(req).dataValues.id
    const { description } = req.body
    if (!description) throw new Error('Description is required!')
    return User.findByPk(UserId)
    .then(user => {
      if (!user) throw new Error("User didn't exist!")
      return Tweet.create({
        UserId,
        description
      })
    })
    .then(data => {
      res.json({ 
        status: 'success',
        data
      })
    })
    .catch(err => next(err))
  },
  likeTweet:(req, res, next) => {
    // POST /api/tweets/:tweet_id/like - 喜歡一則推文
    const TweetId = req.params.id
    const UserId = req.user.dataValues.id
    return Promise.all([
      Tweet.findOne({
        where: { id: TweetId }
      }),
      Like.findOne({
        where: {
          TweetId,
          UserId
        }
      })
    ])
    .then(([tweet, likedTweet]) => {
      if (!tweet) throw new Error('Tweet does not exist!')
      if (likedTweet) throw new Error('You have liked this Tweet!')
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
    const TweetId = req.params.id
    const UserId = req.user.dataValues.id
    return Promise.all([
      Tweet.findOne({
        where: { id: TweetId }
      }),
      Like.findOne({
        where: {
          TweetId,
          UserId
        }
      })
    ])
    .then(([tweet, likedTweet]) => {
      if (!tweet) throw new Error('Tweet does not exist!')
      if (!likedTweet) throw new Error('You have not liked this Tweet!')
      return likedTweet.destroy()
    })
    .then(destroyedRecord => res.status(200).json({ destroyedRecord }))
    .catch(err => next(err))
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
          as: 'replyUser',
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
  }
}

module.exports = tweetController