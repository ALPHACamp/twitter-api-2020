const { Tweet, User } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  // GET /tweets - 所有推文，包括推文作者
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [User]
    })
      .then(tweets => res.json(tweets))
      .catch(err => next(err))
  },
  // GET /tweets/:tweet_id - 一筆推文
  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id, {
      include: [User]
    })
      .then(tweet => {
        if (!tweet) throw new Error('此推文不存在')
        res.json(tweet)
      })
      .catch(err => next(err))
  },
  // 新增推文 - POST /tweets
  postTweet: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const { description } = req.body

    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('此user不存在')
        if (!description) throw new Error('推文內容不可為空白')
        return Tweet.create({
          UserId: userId,
          description
        })
        // .catch(err => next(err))
      })
      .then(newTweet => res.json(newTweet))
      .catch(err => next(err))
  }
}

module.exports = tweetController
