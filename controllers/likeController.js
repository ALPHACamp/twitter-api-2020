const { Like } = require('../models')
// const helpers = require('../_helpers')

const likeController = {
  postUnlike: async (req, res) => {
    try {
      // should I check if this owned by the user?
      await Like.destroy({ where: { id: Number(req.params.id) } })
      return res.status(200).json({ status: 'success', message: '成功取消喜歡' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }
}

module.exports = likeController
