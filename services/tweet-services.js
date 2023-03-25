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
  }

}

module.exports = tweetServices
