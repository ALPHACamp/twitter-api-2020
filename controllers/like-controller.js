const { Like } = require('../models')
const helpers = require('../_helpers')

const likeControler = {
  add: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const like = await Like.findOne({
        where: {
          User_id: UserId,
          Tweet_id: TweetId
        }
      })
      if (like) throw new Error('已經喜歡過了')
      await Like.create({
        UserId,
        TweetId
      })
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
    }
  },
  remove: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const like = await Like.findOne({
        where: {
          User_id: UserId,
          Tweet_id: TweetId
        }
      })
      if (!like) throw new Error('已經不喜歡了')
      await Like.destroy({
        where: {
          UserId,
          TweetId
        }
      })
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = likeControler
