const { Like, User, Tweet } = require('../models')
const likeController = {
  getUserLikes: async(req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    const like = await Like.findByPk(req.params.id)
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
      include: [Tweet]
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