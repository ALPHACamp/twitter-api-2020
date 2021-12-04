const { Tweet, User } = require('../models')

const adminController = {
  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id);
      tweet.destroy();
      return res.status(200).json({ status: 'success', message: '成功刪除貼文' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }
}

module.exports = adminController