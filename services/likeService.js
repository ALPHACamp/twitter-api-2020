const db = require('../models')
const Like = db.Like
const helper = require('../_helpers')

const likeService = {
  addLike: async (req, res, callback) => {
    try {
      const user = helper.getUser(req)
      await Like.findOrCreate({
        where: { TweetId: req.params.id },
        defaults: {
          UserId: user.id,
          TweetId: req.params.id
        }
      })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500', statusCode: 500 })
    }
  },
  removeLike: async (req, res, callback) => {
    try {
      const user = helper.getUser(req)
      const like = await Like.findOne({
        where: {
          UserId: user.id,
          TweetId: req.params.id
        }
      })
      if (like === null) callback({ status: 'success', message: '' })
      await like.destroy()
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'codeStatus 500', statusCode: 500 })
    }
  }
}

module.exports = likeService