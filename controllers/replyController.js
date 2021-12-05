const { Reply, User } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  getTweetReply: async(req, res) => {
    try{
      const tweetid = Number(req.params.tweet_id)
      const replies = await Reply.findAll({raw: true, nest: true, where: {tweetid: tweetid}, include: [{model: User}]})

      let results  = replies.map(data => ({
        id: data.id, 
        User: data.User,
        comment: data.comment, 
        createdAt:data.createdAt
      }))

      results.sort((a, z) => z.createdAt - a.createdAt)

      return res.status(200).json(results)

    } catch (error){
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }

}

module.exports = replyController