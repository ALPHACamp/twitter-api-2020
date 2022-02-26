const helpers = require('../_helpers')
const { Like } = require('../models')

const likeController = {
  likeTweet: (req, res, next) => {
    Like.create({ UserId: helpers.getUser(req).id, TweetId: req.params.id })
     .then(() => res.json({ status: 'success', message: '喜歡一則推文'}))
     .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
    .then(() => res.json({ status: 'success', message: '移除喜歡一則貼文'}))
  }
}

module.exports = likeController