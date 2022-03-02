const { Tweet, User, Like } = require('../models')
const user = require('../models/user')
const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'desc']],
      include: [{
        model: User,
        attributes: ['id','name','account','avatar']
      }]
    })
      .then(tweets => {
        const tweetsLiked = tweets.map(tweet => ({
          ...tweet,
          isLiked: req.user.LikedTweets.some(f => f.id === tweet.id)
        }))
        return res.status(200).json(tweetsLiked)
      })
      .catch((error) => res.status(500).json({
        status: 'error',
        message: error
      }))
  },
  getTweet: (req, res) => {
    const TweetId = req.params.id
    Tweet.findByPk(TweetId, {
        include: [{
          model: User,
          as: 'TweetAuthor',
          attributes: ['id','name','account','avatar']
        },
        {
          model: User,
          as: 'LikedUsers',
          attributes: ['id'],
          through: {
            attributes: []
          }
        }
      ]
    })
      .then((tweet) => {
        if (!tweet) {
          return res.status(404).json({
            status: 'error',
            message: '推文不存在'
          })
        } else {
          tweet_toJSON = tweet.toJSON()
          const { id, description, createdAt, updatedAt, likeCount, replyCount, TweetAuthor } = tweet_toJSON
          return res.status(200).json({
            id,
            description,
            createdAt,
            updatedAt,
            likeCount,
            replyCount,
            TweetAuthor,
            isLiked: tweet.LikedUsers.some((user) => user.id === req.user.id)
          })
        }
      })
      .catch((error) => res.status(500).json({
        status: 'error',
        message: error
      }))
  },
  postTweet: async (req, res) => {
    const { description } = req.body
    const UserId = req.user.id
    if (!description) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: '內容不可為空白'
        })
    }
    if (description.length > 140) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: '不可超過140字'
        })
    }
    Tweet.create({
        description,
        UserId
      })
      .then(tweet => {
        return User.findByPk(UserId)
          .then(user => user.increment('tweetCount'))
          .then(() => res.status(200).json(tweet))
      })
      .catch(error => res.status(500).json({
        status: 'error',
        message: error
      }))
  }
}
module.exports = tweetController