const db = require('../../models')
const { Tweet, User, Reply, Like, Sequelize } = db
const helpers = require('../../_helpers')
const { Op } = Sequelize

const tweetController = {
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        attributes: [
          ['id', 'TweetId'],
          'createdAt',
          'description',
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.tweetId = Tweet.id)'
            ),
            'LikesCount'
          ],
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Replies WHERE Replies.tweetId = Tweet.id)'
            ),
            'RepliesCount'
          ]
        ],
        group: 'TweetId',
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'avatar', 'account'],
            where: {
              role: {
                [Op.or]: {
                  [Op.ne]: 'admin',
                  [Op.eq]: null //for test
                }
              }
            }
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      tweets = tweets.map((tweet) => ({
        ...tweet,
        isLiked: req.user.LikedTweets
          ? req.user.LikedTweets.map((like) => like.id).includes(tweet.TweetId)
          : null
      }))
      return res.json(tweets)
    } catch (err) {
      console.log(err)
    }
  },
  postTweet: async (req, res) => {
    try {
      if (helpers.getUser(req).role === 'admin') {
        return res.json({
          status: 'error',
          message: '管理者無法推文!'
        })
      }
      const { description } = req.body
      if (!description.trim()) {
        return res.json({
          status: 'error',
          message: '內容不可空白'
        })
      }
      if (description.length > 140) {
        return res.json({
          status: 'error',
          message: '字數超出上限！'
        })
      }

      await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      return res.json({
        status: 'success',
        message: '推文成功'
      })
    } catch (err) {
      console.log(err)
    }
  },
  getTweet: async (req, res) => {
    try {
      const { id } = req.params
      let tweet = await Tweet.findByPk(id, {
        attributes: [
          ['id', 'TweetId'],
          'description',
          'createdAt',
          'updatedAt',
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.tweetId = Tweet.id)'
            ),
            'LikesCount'
          ],
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Replies WHERE Replies.tweetId = Tweet.id)'
            ),
            'RepliesCount'
          ]
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'avatar', 'account']
          }
        ]
      })

      if (!tweet) {
        return res.json({
          status: 'error',
          message: 'Can not find this tweet!'
        })
      }
      tweet = tweet.toJSON()
      tweet.isLiked = req.user.LikedTweets
        ? req.user.LikedTweets.map((like) => like.id).includes(tweet.TweetId)
        : null
      return res.json(tweet)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweetController
