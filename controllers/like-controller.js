const { Like, User, Tweet } = require('../models')
const likeController = {
  postTweetLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
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
          TweetId
        }
      })
      if (!like) {
        await Like.create({
          UserId: req.user.id,
          TweetId,
          isDeleted: false
        })
        return res.status(200).json({
          status: 'success',
          message: '成功加入喜歡的貼文!'
        })
      } else if (like.isDeleted) {
        await like.update({
          isDeleted: !like.isDeleted
        })
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
  postTweetUnlike: async (req, res, next) => {
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
  },
  getUserLikes: async(req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    const like = await Like.findAll({
      where: { UserId: req.params.id }
    })
    if (!user) {
      return res
        .status(404)
        .json({
          status: 'error',
          message: '使用者不存在'
        })
    }
    if (!like) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: '使用者沒有like過的推文'
        })
    }
    const likes = await Like.findAll({
      where: {
        UserId: req.params.id,
        isDeleted: false
      },
      order: [['createdAt', 'desc']],
      include: [
        {
          model: Tweet,
          attributes: ['description'],
          include: [
            {
              model: User,
              attributes: ['name','account']
            }
          ]
        }
      ]
    })
    if (likes.length ==0) {
      return res
        .status(404)
        .json({
          status: 'error',
          message: '推文不存在'
        })
    }
    return res.status(200).json(likes)
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error
    })
  }
}
}
module.exports = likeController