const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

module.exports = {
  getTweets: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    })
      .then(tweets => {
        const data = tweets.map(r => ({
          id: r.id,
          UserId: 1,
          description: r.description.slice(0, 50),
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          replyCount: r.Replies.length,
          likeCount: r.Likes.length,
          User: {
            account: r.User.account,
            name: r.User.name,
            avatar: r.User.avatar
          }
        }))
        return res.status(200).json(data)
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  },

  postTweet: (req, res) => {
    const { description } = req.body

    if (!description) {
      return res.status(400).json({ status: 'error', message: 'Please enter description' })
    }
    Tweet.create({
      UserId: helpers.getUser(req).id,
      description: description
    })
      .then(() => {
        return res.status(200).json({ status: 'success', message: 'Success' })
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  }
}
