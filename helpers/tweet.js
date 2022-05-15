const { Like, Reply } = require('../models')


module.exports = {
  // get isLiked value(boolean) in all tweets for login user
  isLikedTweet: async userId => {
    const likedList = await Like.findAll({
      where: {
        UserId: userId
      },
      raw: true
    })

    if (!likedList) return []
    
    const isLikedId = likedList.map(like => like.TweetId)
    return isLikedId
  },
  isRepliedTweet: async userId => {
    const replyList = await Reply.findAll({
      where: {
        UserId: userId
      },
      raw: true
    })

    if (!replyList) return []

    const isRepliedId = replyList.map(reply => reply.TweetId)
    return isRepliedId
  }
}