// 載入所需套件
const { Like } = require('../models')
const { Op } = require('sequelize')
const helpers = require('../_helpers')
const ReqError = require('../helpers/ReqError')

const likeService = {
  postLike: async (req, res, callback) => {
    const like = await Like.findOne({ where: { [Op.and]: [{ UserId: helpers.getUser(req).id }, { TweetId: req.params.tweet_id }] } })

    // 確認是否重複按讚
    if (like) {
      throw new ReqError('已按過讚！')
    } else {
      await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      })
      return callback({ status: 'success', message: '成功按讚' })
    }
  },

  postUnlike: async (req, res, callback) => {
    //刪除該貼文的按讚
    await Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      }
    })
    return callback({ status: 'success', message: '已收回按讚' })
  }
}


// likeController exports
module.exports = likeService
