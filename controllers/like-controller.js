const { Like, Tweet } = require('../models')
const helpers = require('../_helpers')

const likeController = {
  add:async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('無法喜歡不存在的推文')     
      const [liked, created] = await Like.findOrCreate({
        where: { UserId, TweetId }
      })
      if (!created) throw new Error('您已喜歡過該則推文')

      res.status(200).json({
        status: 'Success',
        message: '您已成功喜歡該則推文',
        data: liked
      })
    } catch (err) {
      next(err)
    }
  },
  remove: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('沒有該則推文')
	    const liked = await Like.destroy({
        where: { UserId, TweetId }
      })
      if (!liked) throw new Error('您未喜歡過該則推文')

      res.status(200).json({
        status: 'Success',
        message: '您已成功取消喜歡該則推文',
        data: tweet.toJSON()
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = likeController