const helpers = require('../_helpers')

const db = require('../models')
const Like = db.Like

const likeController = {
  unlikeTweet: (req, res) => {
    Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      }
    })
      .then(() => res.json({ status: 'success', message: '取消Like推文' }))
  },

  likeTweet: (req, res) => {
    Like.create({ UserId: helpers.getUser(req).id, TweetId: req.params.tweet_id })
      .then(() => res.json({ status: 'success', message: '成功Like推文' }))
  }
}
module.exports = likeController