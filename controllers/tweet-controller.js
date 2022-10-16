const { Like, Reply, Tweet, User } = require('../models')
const { getUser } = require('../_helpers')
const charLimit = 140 // 推文及回覆的字元上限

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
      attributes: ['id']}
      ],
      order: [['createdAt', 'DESC']]
    })
    .then(tweets => {
      const result = []
      tweets.forEach(tweet => {
        tweet = tweet.toJSON()
        tweet.likeCounts = tweet.Likes.length
        tweet.replyCounts = tweet.Replies.length
        const isLiked = tweet.Likes.some(like => like.UserId === getUser(req).dataValues.id)
        tweet.isLiked = isLiked
        delete tweet.Likes
        delete tweet.Replies
        result.push(tweet)
      })
      res.status(200).json(result)
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
    .then(tweet => {
      if (!tweet) throw new Error('Tweet does not exist!')
      const isLiked = tweet.dataValues.Likes.some(element => element.UserId === getUser(req).dataValues.id)
      tweet.dataValues.isLiked = isLiked
      tweet.dataValues.likeCounts = tweet.dataValues.Likes.length
      tweet.dataValues.replyCounts = tweet.dataValues.Replies.length
      delete tweet.dataValues.Likes
      delete tweet.dataValues.Replies
      res.status(200).json(tweet)
      })
    .catch(err => next(err))
  },
  postTweet:(req, res, next) => {
    // POST /api/tweets - 發布一筆推文
    const userId = getUser(req).dataValues.id
    const { description } = req.body
    if (!description) throw new Error('內容不可空白')
    if (description.length > charLimit) throw new Error(`推文不可超過 ${charLimit} 字元`)
    return User.findByPk(userId)
    .then(user => {
      if (!user) throw new Error("User didn't exist!")
      return Tweet.create({
        UserId: userId,
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
    const tweetId = req.params.id
    const userId = req.user.dataValues.id
    return Promise.all([
      Tweet.findOne({
        where: { id: tweetId }
      }),
      Like.findOne({
        where: {
          TweetId: tweetId,
          UserId: userId
        }
      })
    ])
    .then(([tweet, likedTweet]) => {
      if (!tweet) throw new Error('Tweet does not exist!')
      if (likedTweet) throw new Error('You have liked this Tweet!')
      return Like.create({
        TweetId: tweetId,
        UserId: userId
      })
    })
    .then(likeRecord => res.status(200).json(likeRecord))
    .catch(err => next(err))
  },
  unlikeTweet:(req, res, next) => {
    // POST /api/tweets/:tweet_id/unlike - 取消喜歡一則推文
    const tweetId = req.params.id
    const userId = req.user.dataValues.id
    return Promise.all([
      Tweet.findOne({
        where: { id: tweetId }
      }),
      Like.findOne({
        where: {
          TweetId: tweetId,
          UserId: userId
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
    return Reply.findAll({
      where: { TweetId: req.params.id },
      attributes: {exclude: ['updatedAt', 'UserId'] },
      include: [{
        model: User, 
        as: 'replyUser',
        attributes: ['id', 'account', 'avatar', 'name']
      },
      {
        model: Tweet,
        attributes: ['id'],
        include: [{
          model: User,
          as: 'tweetAuthor',
          attributes: ['account']
        }]
      }],
      order: [['createdAt', 'DESC']]
    })
    .then((result) => {
      if (!result) throw new Error('Tweet does not exist!')
      result = result.map(element => {
        element = element.toJSON(),
        element.tweetAuthorAccount =  element.Tweet.tweetAuthor.account
        delete element.Tweet
        return element
      })
      res.status(200).json(result)
    })
    .catch(err => next(err))
  },
  postReply:(req, res, next) => {
    // POST /api/tweets/:tweet_id/replies - 新增回覆
    const { comment } = req.body
    const targetTweetId = req.params.id
    const replierId = req.user.dataValues.id
    if (!comment) throw new Error('Comment text is required!')
    if (comment.length > charLimit) throw new Error(`回覆不可超過 ${charLimit} 字元`)
    return Promise.all([
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