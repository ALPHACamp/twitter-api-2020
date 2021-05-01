const db = require('../models')
const { Notify, Tweet, Subscript } = db
const { getUser } = require('../_helpers')

const notifyController = {
  // getNotifies:送出所有通知
  // 新增通知 tweet , follow, like,reply
  addTweetNotify: async (req, res, next) => {
    try {
      // 抓出新建立的tweet
      const tweet = await Tweet.findAll({
        raw: true,
        nest: true,
        limit: 1,
        order: [['createdAt', 'DESC']],
      })
      // 核對作者查出訂閱者們
      const subscripts = await Subscript.findAll({
        raw: true,
        nest: true,
        where: { authorId: tweet[0].UserId }
      })
      // 建立notify
      if (subscripts) {
        await subscripts.forEach(subscript => Notify.create({
          tweetId: tweet[0].id,
          userId: subscript.subscriberId
        }))
      }
    } catch (e) {
      return next(e)
    }
  },

}
module.exports = notifyController