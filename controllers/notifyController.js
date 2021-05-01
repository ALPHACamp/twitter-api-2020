const db = require('../models')
const { get } = require('../routes/apis')
const { Notify, Tweet, Subscript, User } = db
const { getUser } = require('../_helpers')

const notifyController = {
  // getNotifies:顯示通知頁面
  getNotifies: async (req, res, next) => {
    try {
      let notifies = await Notify.findAll({
        raw: true,
        nest: true,
        where: {
          userId: getUser(req).id,
        },
        order: [['createdAt', 'DESC']],
        include: [{ model: Tweet, include: [User] }]
      })

      notifies = notifies.map(notify => {
        return {
          id: notify.id,
          user: {
            id: notify.Tweet.User.id,
            account: notify.Tweet.User.account,
            name: notify.Tweet.User.name,
            avatar: notify.Tweet.User.avatar
          },
          tweet: {
            tweetId: notify.Tweet.id,
            description: notify.Tweet.description,
          },
          createdAt: notify.createdAt
        }
      })
      //回傳 userName,userId,avatar,text,description
      return res.json({ notifies })

    } catch (e) { return next(e) }
  },
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