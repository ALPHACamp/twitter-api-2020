const { Like } = require('../models')
const helpers = require('../_helpers')

const likeController = {
  postUnlike: async (req, res) => {
    try {
      const targetLike = await Like.findByPk(Number(req.params.id))
      if (targetLike.toJSON().UserId === helpers.getUser(req).id) {
        await Like.destroy({ where: { id: Number(req.params.id) } })
      } else {
        return res.status(401).json({ status: 'error', message: '無法變更其他使用者的Profile' })
      }
      return res.status(200).json({ status: 'success', message: '成功取消喜歡' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }
}

module.exports = likeController
