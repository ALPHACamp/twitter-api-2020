const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

let tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [{ model: User, attributes: ['name', 'avatar', 'account'] }, { model: Like }],
      order: [['createdAt', 'DESC']],
      raw: true,
    })
      .then((tweets) => {
        return res.json(tweets)
      })
      .catch((err) => next(err))
  },

  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweetId, { include: { model: Reply } })
      .then((tweet) => {
        return res.json(tweet)
      })
      .catch((err) => next(err))
  },

  postTweets: (req, res, next) => {
    if (!req.body.description) throw new Error('請輸入必填項目')
    if (req.body.description.length > 140) throw new Error('數入字數超過140字')

    return Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id,
    })
      .then((tweet) => {
        res.json(tweet)
      })
      .catch((err) => next(err))
  },

  putTweet: (req, res, next) => {
    Tweet.findByPk(req.params.tweetId).then((tweet) => {
      if (!tweet) {
        return res.redirect('back')
      }
      tweet
        .update({ description: req.body.description })
        .then((tweet) => {
          return res.json(tweet)
        })
        .catch((err) => next(err))
    })
  },

  likeTweet: (req, res, next) => {
    Like.findOne({ where: { UserId: helpers.getUser(req).id, TweetId: req.params.tweetId } })
      .then(isLiked => {
        if (isLiked) throw new Error('你已經喜歡過這則貼文')
        
        return Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweetId
        })
      })

      .then(tweet => {
        return res.json({ status: 'success', message: 'You had successfully like this tweet' })
      })
      .catch(err => next(err))
  },

  unlikeTweet: (req, res, next) => {
    return Like.findOne({ where: { UserId: helpers.getUser(req).id, TweetId: req.params.tweetId } }).then((tweet) => {
      // if (!tweet) {
      //   return res.redirect('back')
      // }
      tweet
        .destroy()
        .then(res.json({ status: 'success', message: 'You had successfully unlike this tweet' }))
        .catch((err) => {
          next(err)
        })
    })
  },
}

module.exports = tweetController
