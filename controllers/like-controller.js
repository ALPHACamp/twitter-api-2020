const { Like, Tweet, User } = require('../models')
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
        const likeData = await Like.create({
          UserId: req.user.id,
          TweetId: req.params.id,
          isDeleted: false
        })
        await tweet.increment('likeCount')
        const tweetFind = await Tweet.findByPk(tweet.id)
        const user = await User.findByPk(tweetFind.UserId)
        await user.increment('likedCount')
        res.status(200).json(likeData)
      } else if (like && like.isDeleted === true) {
        await like.update({
          isDeleted: !like.isDeleted
        })
        await tweet.increment('likeCount')
        const tweetFind = await Tweet.findByPk(tweet.id)
        const user = await User.findByPk(tweetFind.UserId)
        await user.increment('likedCount')
        return res.status(200).json()
      } else if (like && like.isDeleted === false) {
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
      const tweet = await Tweet.findByPk(req.params.id)
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId: req.params.id
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
      if (like && like.isDeleted ===true) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '已經按過Unlike囉'
          })
      } else if (like && like.isDeleted ===false) {
        const toggleLike = await like.update({
          isDeleted: !like.isDeleted
        })
        if (toggleLike) {
          await tweet.decrement('likeCount')
          const tweetFind = await Tweet.findByPk(tweet.id)
          // await tweetFind.update({
          //   isLiked: !isDeleted
          // })
          const user = await User.findByPk(tweetFind.UserId)
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