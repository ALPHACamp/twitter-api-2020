const { Tweet, User, Like } = require('../models')
const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'desc']],
      include: [
        {
          model:User,
          attributes: ['id', 'account', 'name', 'avatar'],
          as:'TweetAuthor'
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
      .then((tweets) => {
        const tweetsData = tweets.map((tweet) => {
          console.log(tweet.LikedUsers)
          const { id, description, likeCount, replyCount, createdAt, updatedAt, TweetAuthor } = tweet
          return {
            id,
            description,
            likeCount,
            replyCount,
            createdAt,
            updatedAt,
            TweetAuthor,
            isLiked: tweet.LikedUsers.id !== null,
          }
        })
        return res.status(200).json(tweetsData)
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
  postTweet: (req, res) => {
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
        User.findByPk(UserId)
          .then(user => user.increment('tweetCount'))
          .then(() =>
            res.status(200).json({
              status: '200',
              message: 'Successfully post tweet.',
              Tweet: tweet
            })
          )
      })
      .catch((error) => res.status(500).json({
        status: 'error',
        message: error
      }))
  }
}
module.exports = tweetController