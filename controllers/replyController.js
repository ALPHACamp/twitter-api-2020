const { Reply, User } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  postReply: async(req, res) => {
    try{
      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: Number(req.params.tweet_id),
        comment: req.body.comment,
      })

      const replies = await Reply.findAll({raw: true, nest: true})
      console.log("------", replies)

      res.status(200).json({ status: 'success', message: '成功回覆貼文' })

    } catch (error){
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }

}

module.exports = replyController