const { User, Reply, Tweet } = require('../models')
const { getUser } = require('../_helpers')

const replyController = {
  getTweetReply: (req, res, next) => {
    const getTweetId = req.params.tweet_id
    return Reply.findAll({
      where: { TweetId: getTweetId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar'],
        },
        {
          model: Tweet,
          include: [
            {
              model: User,
              attributes: ['id', 'account', 'name', 'avatar'],
            },
          ],
        },
      ],
      raw: true,
    })
      .then((replies) => {
        const processedReplies = replies.map((reply) => ({
          // reply PK
          replyId: reply.id,
          comment: reply.comment,
          // reply's userId
          replyerData: {
            replyUserId: reply['User.id'],
            account: reply['User.account'],
            name: reply['User.name'],
            avatar: reply['User.avatar'],
          },
          // tweets
          tweetData: {
            tweetId: reply.TweetId,
            tweetOwnerId: reply['Tweet.User.id'],
            tweetOwnerAccount: reply['Tweet.User.account'],
            createdAt: new Date(reply.createdAt).toLocaleString(),
          },
        }))
        res.status(200).json(processedReplies)
      })
      .catch((err) => next(err))
  },
  postTweetReply: (req, res, next) => {
    const tweetId = req.params.tweet_id
    const userId = getUser(req).id
    const { comment } = req.body

    return Tweet.findByPk(tweetId)
      .then((tweet) => {
        if (!tweet) throw new Error('Tweet not exist!')
        return Reply.create({
          comment,
          tweetId,
          userId,
        })
      })
      .then((newReply) => {
        res.status(200).json(newReply)
      })
      .catch((err) => next(err))
  },
}
module.exports = replyController
