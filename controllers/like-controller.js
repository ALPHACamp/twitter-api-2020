const { Like, Tweet } = require('../models')
const likeController = {
  postLike: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
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
          UserId: req.user.id,
          TweetId: req.params.id
        }
      })
      if (!like) {
        await Like.create({
          UserId: req.user.id,
          TweetId: req.params.id,
          isDeleted: false
        })
        await tweet.increment('likeCount')
        const tweet2 = await Tweet.findByPk(tweet.id)
        console.log(tweet2)
        await User.findByPk(tweet2.UserId).increment('likedCount')
        // const user = await User.findByPk(tweet.UserId).increment('likedCount')
        // user.increment('likedCount')
        return res.status(200).json({
          status: 'success',
          message: '成功加入喜歡的貼文!'
        })
      } else if (like.isDeleted) {
        await like.update({
          isDeleted: !like.isDeleted
        })
        await tweet.increment('likeCount')
        const user = await User.findByPk(tweet.UserId)
        user.increment('likedCount')
        return res.status(200).json({
          status: 'success',
          message: 'Like成功!'
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
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId
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
      if (like.isDeleted) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '已經按過Unlike囉'
          })
      } else {
        const toggleLike = await like.update({
          isDeleted: !like.isDeleted
        })
        if (toggleLike) {
          await tweet.decrement('likeCount')
          const user = await User.findByPk(tweet.UserId)
          user.decrement('likedCount')
          return res.status(200).json({
            status: 'success',
            message: 'Unlike成功!'
          })
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  }
}
module.exports = likeController