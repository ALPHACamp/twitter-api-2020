const { Reply, User } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  getTweetReply: async(req, res) => {
    console.log('here')
    try{
      const tweetid = Number(req.params.tweet_id)
      const replies = await Reply.findAll({raw: true, nest: true, where: {tweetid: tweetid}, include: [{model: User}]})

      let results  = replies.map(data => ({
        id: data.id, 
        User: {
          id: data.User.id,
          name: data.User.name,
          account: data.User.account,
          avatar: data.User.avatar
        },
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