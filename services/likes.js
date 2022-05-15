const { Like } = require('../models')

const likes = {
  count: async (TweetId) => {
    const likesNum = await Like.count({
      where: {
        TweetId
      },
      group: ['Tweet_id'],
      raw: true
    })
    const data = []
    if (likesNum[0] === undefined) {
      data.push('0')
    } else {
      data.push(likesNum[0].count.toString())
    }

    return data
  }
}

module.exports = likes
