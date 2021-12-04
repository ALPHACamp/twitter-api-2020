const { json } = require('body-parser')
const db = require('../../models')
const { Tweet, Like } = db
const helpers = require('../../_helpers')

const likeController = {
  like: async (req, res) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      })
      return res.json({
        status: 'success',
        message: 'Successfully like tweet!'
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = likeController
