const { Like, Reply, Tweet, User } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      attributes: { exclude:[ 'updatedAt' ] },
      include: [{
        model: User,
        attributes: [ 'id', 'account', 'name', 'avatar' ]
      }, 
      {model: Like},
      {model: Reply},
    ]
    })
    .then(tweets => {
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        likeCount: tweet.Likes.length,
        replyCount: tweet.Replies.length
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
      res.status(200).json(data)
    })
    .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id, {
      include: [{ model: User }],
      nest: true,
      raw: true
    })
    .then(tweet => {
      return res.json(tweet)
    })
    .catch(err => next(err))
  },
  postTweet:(req, res, next) => {
    // POST /api/tweets - 發布一筆推文
    const UserId = req.user.dataValues.id
    const { description } = req.body
    if (!description) throw new Error('Description is required!')
    return User.findByPk(UserId)
    .then((user) => {
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
  },
  unlikeTweet:(req, res, next) => {
  }
}

module.exports = tweetController