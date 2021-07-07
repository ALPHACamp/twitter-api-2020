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
    if (!req.body.description) {
      res.json({ status: 'error', message: "description didn't exist" })
      return res.redirect('back')
    }
    if (req.body.description.length > 140) {
      res.json({ status: 'error', message: 'description only allow 140 characters' })
      return res.redirect('back')
    }
    return Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id,
    })
      .then((tweet) => {
        res.json({ status: 'success', message: 'description was successfully created' })
      })
      .catch((err) => next(err))
  },

  likeTweet: (req, res, next) => {
    // const isLiked = Like.findOne({ where: { UserId: helpers.getUser(req).id, TweetId: req.params.tweetId } })
    // if (isLiked) {
    //   return res.redirect('back')
    // }
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweetId,
    })
      .then((tweet) => {
        return res.json({ status: 'success', message: 'You had successfully like this tweet' })
      })
      .catch((err) => next(err))
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
