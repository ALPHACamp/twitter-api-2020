const { Tweet, User, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req)?.id
    const [descriptionMin, descriptionMax] = [1, 140]
    if (description.length < descriptionMin || description.length > descriptionMax) throw new Error(`字數限制需在 ${descriptionMin} ~ ${descriptionMax} 之內`)

    User.findByPk(UserId) // 查看user是否存在
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        return Tweet.create({
          description,
          UserId
        })
      })
      .then(tweet => {
        res.json(tweet)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'profilePhoto'] }
      ],
      attributes: {
        include:
        [[sequelize.literal('( SELECT COUNT(*) FROM Replies AS repliesCount  WHERE Tweet_id = Tweet.id)'), 'repliesCount'], [sequelize.literal('( SELECT COUNT(*) FROM Likes AS likedCount  WHERE Tweet_id = Tweet.id)'), 'likedCount']
        ]
      },
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const tweetId = req.params.tweet_id
    Tweet.findByPk(tweetId, {
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'profilePhoto'] }
      ],
      attributes: {
        include:
        [[sequelize.literal('( SELECT COUNT(*) FROM Replies AS repliesCount  WHERE Tweet_id = Tweet.id)'), 'repliesCount'], [sequelize.literal('( SELECT COUNT(*) FROM Likes AS likedCount  WHERE Tweet_id = Tweet.id)'), 'likedCount']
        ]
      }
    })
      .then(tweet => {
        if (!tweet) throw new Error('此推文不存在')
        res.json(tweet)
      })
      .catch(err => next(err))
  },
  likeTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    const UserId = helpers.getUser(req)?.id
    return Promise.all([
      Tweet.findByPk(TweetId, { raw: true }),
      Like.findOne({
        where: { UserId, TweetId }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在')
        if (like) throw new Error('按過喜歡了')
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(like => {
        res.json(like)
      })
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    const UserId = helpers.getUser(req)?.id
    return Promise.all([
      Tweet.findByPk(TweetId, { raw: true }),
      Like.findOne({
        attributes: ['id', 'UserId', 'TweetId', 'createdAt', 'updatedAt'],
        where: { UserId, TweetId }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在')
        if (!like) throw new Error('沒按過')
        return like.destroy()
      })
      .then(like => {
        res.json(like)
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)
    const { comment } = req.body
    const UserId = helpers.getUser(req)?.id
    Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('此貼文不存在')
        return Reply.create({
          comment,
          UserId,
          TweetId
        })
      })
      .then(reply => {
        res.json(reply)
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)
    Promise.all([
      Tweet.findByPk(TweetId),
      Reply.findAll({
        where: { TweetId },
        include: [{ model: User, attributes: ['id', 'account', 'name', 'profilePhoto'] }]
      })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) throw new Error('此推文不存在')
        res.json(replies)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
