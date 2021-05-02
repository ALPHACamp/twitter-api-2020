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
        limit: 20,
        where: {
          receiverId: getUser(req).id,
        },
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'Sender' }]
      })

      notifies = notifies.map(notify => {
        return {
          id: notify.id,
          readStatus: notify.readStatus,
          objectId: notify.objectId,
          objectType: notify.objectType,
          objectText: notify.objectText,
          createdAt: notify.createdAt,
          Sender: {
            id: notify.Sender.id,
            account: notify.Sender.account,
            name: notify.Sender.name,
            avatar: notify.Sender.avatar
          },

        }
      })
      if (!notifies) {
        return res.json({ message: "There aren't notification to this User." })
      } else {
        return (res.json({ notifies }), next())
      }

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
          receiverId: subscript.subscriberId,
          senderId: getUser(req).id,
          objectId: tweet[0].id,
          objectType: 'tweets',
          objectText: tweet[0].description
        }))
      }
    } catch (e) {
      return next(e)
    }
  },
  haveRead: async (req, res, next) => {
    try {
      let notifies = await Notify.findAll({
        where: { receiverId: getUser(req).id }
      })
      notifies.forEach((notify) => {
        notify.update({ readStatus: true })
      })
    } catch (e) { return next(e) }
  }

}
module.exports = notifyController