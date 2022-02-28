const helpers = require('../_helpers')
const { Like, Tweet } = require('../models')

const likeController = {
  likeTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        // 檢查是否有推文
        if (!tweet) return res.json({ status: 'error', message: '推文不存在' })

        // 新增like資料，並回傳成功訊息
        Like.findOrCreate({ where: { UserId: helpers.getUser(req).id, TweetId: req.params.id } })
          .then(() => res.json({ status: 'success', message: '喜歡一則推文' }))
      })
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then(() => res.json({ status: 'success', message: '移除喜歡一則貼文' }))
      .catch(err => next(err))
  }
}

module.exports = likeController