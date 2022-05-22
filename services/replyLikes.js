const { ReplyLike } = require('../models')

const likes = {
  count: async (ReplyId) => {
    const replyLikesNum = await ReplyLike.count({
      where: {
        ReplyId
      },
      group: ['Reply_id'],
      raw: true
    })
    const data = []
    if (replyLikesNum[0] === undefined) {
      data.push('0')
    } else {
      data.push(replyLikesNum[0].count.toString())
    }

    return data
  }
}

module.exports = likes
