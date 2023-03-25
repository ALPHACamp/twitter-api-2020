const { getUser } = require('../_helpers')
const db = require('../models')
const { User, sequelize, Tweet, Reply, Like } = db

const tweetServices = {
  postTweet: (req, cb) => {
    const UserId = getUser(req)?.dataValues.id
    Tweet.create({
      description: req.body.description,
      UserId
    })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err, null))
  },
  getTweets: (req, cb) => {
    const currentUserId = getUser(req).dataValues.id
    return Tweet.findAll({
      include: [
        { model: User, as: 'Author', attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Like, attributes: ['UserId'] }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(SELECT COUNT(*)FROM likes WHERE Tweet_id = Tweet.id 
            )`), 'LikedCounts'
          ],
          [
            sequelize.literal(`(SELECT COUNT(*)FROM replies WHERE Tweet_id = Tweet.id
                )`), 'RepliesCounts'
          ]
        ]
      },
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const result = tweets.map(t => ({
          ...t.toJSON(),
          isLiked: t.Likes.some(l => l.UserId === Number(currentUserId)) // 加入if isLikedBycurrentUser
        }))
        cb(null, result)
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const currentUserId = getUser(req).dataValues.id
    const { id } = req.params
    return Tweet.findByPk(id, {
      include: [
        { model: User, as: 'Author', attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Like, attributes: ['UserId'] }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(SELECT COUNT(*)FROM likes WHERE Tweet_id = Tweet.id 
            )`), 'LikedCounts'
          ],
          [
            sequelize.literal(`(SELECT COUNT(*)FROM replies WHERE Tweet_id = Tweet.id
                )`), 'RepliesCounts'
          ]
        ]
      }
    })
      .then(tweet => {
        if (!tweet) throw new Error('此貼文不存在!')
        tweet = tweet.toJSON()
        tweet.isLiked = tweet.Likes.some(l => l.UserId === Number(currentUserId)) // 加入if isLikedBycurrentUser
        cb(null, tweet)
      })
      .catch(err => cb(err))
  },
  postReply: (req, cb) => {
    const UserId = getUser(req)?.dataValues.id
    const TweetId = req.params.tweet_id
    Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('找不到這篇推文')
        return Reply.create({
          comment: req.body.comment,
          UserId,
          TweetId
        })
      })
      .then(reply => cb(null, reply))
      .catch(err => cb(err, null))
  },
  getReplies: (req, cb) => {
    const TweetId = req.params.tweet_id
    Promise.all([
      Tweet.findByPk(TweetId),
      Reply.findAll({
        where: { TweetId },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Tweet, attributes: ['UserId'], include: { model: User, as: 'Author', attributes: ['id', 'account'] } }
        ]
      })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) throw new Error('找不到這篇推文')
        cb(null, replies)
      })
      .catch(err => cb(err, null))
  }

}

module.exports = tweetServices
