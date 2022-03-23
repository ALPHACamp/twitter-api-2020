const { User, Tweet, Reply } = require('../models')

const replyServices = {
  getReplies: async TweetId => {
    // Check if tweet exists
    const tweet = await Tweet.findByPk(TweetId)
    if (!tweet) throw new Error('This tweet does not exist.')

    const replies = await Reply.findAll({
      where: { TweetId },
      include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    })

    return replies
  },
  postReply: async (comment, TweetId, user) => {
    // Check if tweet exists
    const tweet = await Tweet.findByPk(TweetId)
    if (!tweet) throw new Error('This tweet does not exist.')

    // Check if comment is valid
    if (!comment.trim()) throw new Error('Comment must not be empty')

    // Increment tweet repliedCount
    tweet.increment('repliedCount')

    const reply = await Reply.create({
      UserId: user.id,
      TweetId,
      comment
    })

    return reply
  }
}

module.exports = replyServices
