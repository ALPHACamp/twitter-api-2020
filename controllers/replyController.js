const db = require('../models')
const Reply = db.Reply

module.exports = {
  getReplies: (req, res) => {
    Reply.findAll({
      where: { TweetId: req.params.tweetId },
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        if (!replies.length) {
          return res.status(400).json({
            status: 'error', message: 'reply doesn\'t exist'
          })
        }
        return res.status(200).json(replies)
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  }
}
