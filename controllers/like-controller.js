const { Like, Tweet, User } = require('../models')
const helpers = require('../_helpers')
const likeController = {
  postLike: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      const { id } = helpers.getUser(req)
      if (!tweet) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '推文不存在'
          })
      }
      const like = await Like.findOne({
        where: {
          UserId: id,
          TweetId: req.params.id
        }
      })
      if (!like) {
        const likeData = await Like.create({
          UserId: id,
          TweetId: req.params.id,
          isDeleted: false
        })
        await tweet.increment('likeCount')
        const user = await User.findByPk(tweet.UserId)
        await user.increment('likedCount')
        //return res.status(200).json(likeData.dataValues)
        return res
          .status(200)
          .json({
            status: 'error',
            message: 'Like成功!'
          })
      } else if (like.isDeleted){
        await like.update({isDeleted: false})
        await tweet.increment('likeCount')
        const user = await User.findByPk(tweet.UserId)
        await user.increment('likedCount')
        // return res.status(200).json(like)
        return res
          .status(200)
          .json({
            status: 'error',
            message: '重新Like成功!'
          })
      } else if (!like.isDeleted) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '已經按過Like囉'
          })
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  },
  postUnlike: async (req, res, next) => {
    try {
      const { id } = helpers.getUser(req)
      const tweet = await Tweet.findByPk(req.params.id)
      const like = await Like.findOne({
        where: {
          UserId: id,
          TweetId: req.params.id,
        }
      })
      if (!tweet) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '推文不存在'
          })
      }
      if (!like) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '沒有喜歡過的紀錄'
          })
      } else {
        await like.destroy()
        await tweet.decrement('likeCount')
        await tweet.update({ isLiked: false })
        const user = await User.findByPk(tweet.UserId)
        await user.decrement('likedCount')
        return res.json({
          status: 'success',
          message: 'Unlike成功!'
        })
      }
      // if (like.isDeleted) {
      //   return res
      //     .status(400)
      //     .json({
      //       status: 'error',
      //       message: '已經按過Unlike囉'
      //     })
      // } else {
      //   await like.update({isDeleted: true})
      //   await tweet.decrement('likeCount')
      //   await tweet.update({ isLiked: false })
      //   const user = await User.findByPk(tweet.UserId)
      //   await user.decrement('likedCount')
      //   return res.status(200).json({
      //     status: 'success',
      //     message: 'Unlike成功!'
      //   })
      // }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  }
}
module.exports = likeController