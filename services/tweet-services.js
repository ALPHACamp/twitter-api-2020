const helpers = require('../_helpers')
const db = require('../models')
const { User, sequelize, Tweet, Reply, Like } = db

const tweetServices = {
  postTweet: (req, cb) => {
    const UserId = Number(helpers.getUser(req).id)
    Tweet.create({
      description: req.body.description,
      UserId
    })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err, null))
  },
  getTweets: (req, cb) => {
    const currentUserId = Number(helpers?.getUser(req).id)
    Promise.all([
      Tweet.findAll({
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
        ],
        attributes: {
          include: [
            [
              sequelize.literal(`(SELECT COUNT(*)FROM Likes WHERE Tweet_id = Tweet.id 
            )`), 'LikedCounts'
            ],
            [
              sequelize.literal(`(SELECT COUNT(*)FROM Replies WHERE Tweet_id = Tweet.id
                )`), 'RepliesCounts'
            ]
          ]
        },
        order: [['createdAt', 'DESC']]
      }),
      Like.findAll({ where: { UserId: currentUserId } })
    ])
      .then(([tweets, currentUserlikedtweets]) => {
        const result = tweets.map(t => ({
          ...t.toJSON(),
          isLiked: currentUserlikedtweets.some(l => l.TweetId === t.id) // 加入if isLikedBycurrentUser
        }))
        cb(null, result)
      })
      .catch(err => cb(err))
  },
  getTweet: async (req, cb) => {
    const currentUserId = Number(helpers?.getUser(req).id)
    const { id } = req.params

    try {
      const tweet = await Tweet.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          }
        ],
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Tweet_id = Tweet.id)'), 'LikedCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Tweet_id = Tweet.id)'), 'RepliesCounts'
            ]
          ]
        }
      })

      if (!tweet) throw new Error('此貼文不存在!')

      const currentUserLikedTweets = await Like.findAll({ where: { UserId: currentUserId } })
      const isLikedByCurrentUser = currentUserLikedTweets.some(l => l.TweetId === tweet.id)

      const tweetJSON = tweet.toJSON()
      tweetJSON.isLiked = isLikedByCurrentUser

      cb(null, tweetJSON)
    } catch (error) {
      cb(error)
    }
  },
  postReply: (req, cb) => {
    const UserId = Number(helpers.getUser(req).id)
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
          { model: Tweet, attributes: ['UserId'], include: { model: User, attributes: ['id', 'account'] } }
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
