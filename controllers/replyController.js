const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const replyController = {
  getReplies: (req, res) => {
    Promise.all([
      Tweet.findOne({
        where: { id: req.params.tweetId },
        include: [User]
      }),
      Reply.findAll({
        where: { TweetId: req.params.tweetId },
        include: User,
        order: [['createdAt', 'DESC']]
      })
    ]).then(([tweet, replies]) => {
      console.log(replies)  // [Reply { dataValues: { comment:... } }, Reply { dataValues:...}
      // replies[0].dataValues.TweetOwner = tweet.User.account  
      // 加在第一個comment內容裡，結構怪怪的
      replies.push({ TweetOwner: tweet.User.account })
      return res.json(replies)
    })
  }
}


module.exports = replyController