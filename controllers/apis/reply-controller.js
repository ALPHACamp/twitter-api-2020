const { Reply, Tweet, User } = require('../../models')
const helpers = require('../../_helpers')

const replyController = {
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      if (!comment) throw new Error('Data is missing comments! !')

      const UserId = helpers.getUser(req)?.id
      const TweetId = Number(req.params.tId)
      const tweet = await Tweet.findByPk(TweetId)
      const user = await User.findByPk(UserId)
      if (!tweet || !user) throw new Error('Tweet or user does not exist!!')

      const data = await Reply.create({
        comment,
        UserId,
        TweetId
      })

      return res.json({
        status: 'success',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  getReply: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.tId)
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('Tweet does not exist!!')

      const data = await Reply.findAll({
        where: { TweetId },
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatarImg']
          }
        ]
      })

      return res.status(200).json(
        data
      )
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
