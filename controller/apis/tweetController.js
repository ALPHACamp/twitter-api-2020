const db = require('../../models')
const Tweet = db.Tweet
const helper = require('../../_helpers')
const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({ raw: true, nest: true })
      return res.status(200).json([...tweets])
    } catch (err) {
      return console.log(err)
    }
  },
  getTweet: async (req, res) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findByPk(id, { raw: true })
      return res.status(200).json({ ...tweet })
    } catch (err) {
      console.log(err)
    }
  },
  postTweet: async (req, res) => {
    try {
      await Tweet.create({
        description: req.body.description,
        UserId: helper.getUser(req).id
      })
      return res.json({ status: 200, message: '' })
    } catch (err) {
      console.error(err)
    }
  },
  putTweet: async (req, res) => {
    try {
      if (!req.body.description) {
        return res.json({
          status: 'error',
          message: "description didn't exist"
        })
      }
      await Tweet.update(
        { description: req.body.description },
        { where: { id: req.params.id } }
      )
      return res.json({ status: 200, message: '' })
    } catch (err) {
      console.log(err)
    }
  },
  deleteTweet: async (req, res) => {
    try {
      await Tweet.destroy({ where: { id: req.params.id } })
      return res.json({ status: 200, message: 'delete successfully' })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweetController
