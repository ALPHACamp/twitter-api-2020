const { Like } = require('../models')
const helpers = require('../_helpers')

const likeControler = {
  add: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      await Like.create({
        UserId,
        TweetId
      })
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = likeControler
