const { Tweet, User } = require('../models')
const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'desc']],
      include: [User]
    })
      .then(tweets => { return res.status(200).json(tweets) })
      .catch((error) => res.status(500).json({
        status: 'error',
        message: error
      }))
  },
  postTweet: (req, res) => {
    const { UserId, description } = req.body
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
      .then(tweets => {return res.status(200).json(tweets)})
      .catch((error) => res.status(500).json({
        status: 'error',
        message: error
      }))
  }
}
module.exports = tweetController