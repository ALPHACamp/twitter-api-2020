const { Tweet, User } = require('../models')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')
const TWEETS_WORD_LIMIT = 140

const tweetController = {
  // 新增推文(tweet)
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description.trim()) newErrorGenerate('內容不可空白', 400)
      if (description.length > TWEETS_WORD_LIMIT) newErrorGenerate(`字數限制${TWEETS_WORD_LIMIT}字以內`, 400)
      const userId = helpers.getUser(req).id
      const user = await User.findByPk(userId, { raw: true })
      if (!user) newErrorGenerate('使用者不存在', 404)
      const newTweet = await Tweet.create({ description, UserId: userId })
      return res.json({ status: 'success', data: { newTweet } })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
