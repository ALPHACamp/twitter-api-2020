const db = require('../models')
const { Notification, Subscribeship, Tweet, User, Reply, Followship, Like } = db
module.exports = async (io, socket, loginUser, userSocketIdMap) => {

  socket.on('post tweet', async (TweetId) => {
    try {
      // 撈出該用戶的訂閱者(通知對象)
      let subscribers = await Subscribeship.findAll({
        attributes: [['subscriberId', 'targetId'], ['subscribingId', 'triggerId']],
        raw: true,
        where: {
          subscribingId: loginUser.id
        }
      })
      // 整理要紀錄到notification的資料,加上推文id
      subscribers.forEach(data => {
        data.TweetId = TweetId   // [ { targetId: 11, triggerId: 31, TweetId: 1 } ]
      })

      // 紀錄到 Notifications table
      await Notification.bulkCreate(
        subscribers
        , { returning: true })

      // 要通知訂閱戶的資料本身
      const tweet = await Tweet.findOne({
        attributes: ['id', 'description'],
        where: { id: TweetId },
        include: { model: User, attributes: ['id', 'avatar', 'name'] },
      })

      // 發送通知給有在線的訂閱戶 

      // 將通知對象整理成id陣列
      subscribers = subscribers.map(d => (d.targetId))
      let notifySockets = []
      // 判斷是否有在線，如果有則取得該訂閱戶的sockets
      for (let entry of userSocketIdMap) {  // entry = [11, set {'socketId','socketId'}]
        const isOnline = subscribers.includes(entry[0])
        if (isOnline) {
          notifySockets.push(entry[1])
        }
      }
      // 將set轉為陣列 [set {'abc','dec'}, set {'123'}] => ['abc','dec','123']
      notifySockets = Array.from(...notifySockets)

      //發送通知
      io.to(notifySockets).emit('tweet notify', { tweet: tweet.toJSON() })

    } catch (err) {
      console.warn(err)
    }
  })


  socket.on('join notification', async () => {
    try {
      // 送給前端 登入使用者所有的通知
      // TODO: 一定要撈出所有的嗎？有無更有效率的方式
      const notifications = await Notification.findAll({
        raw: true, nest: true,
        attributes: ['id', 'isRead', 'createdAt'], //讓前端可以顯示出來互動時間點，就像臉書
        where: {
          targetId: loginUser.id
        },
        include: [
          { model: Tweet, attributes: ['id', 'description'] },
          { model: Reply, attributes: ['id', 'comment', 'TweetId'] }, //如果未來需要推文內容，在關聯Tweet
          { model: Followship, attributes: ['id'] }, //有人追蹤我
          { model: Subscribeship, attributes: ['id'] }, //因為沒有黑單功能，所以不須傳對方的id，讓你可以取消
          { model: Like, attributes: ['TweetId'] },
          { model: User, as: 'Trigger', attributes: ['id', 'name', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      // 將沒資料的欄位刪掉
      notifications.forEach(data => {
        if (data.Tweet.id === null) delete data.Tweet
        if (data.Reply.id === null) delete data.Reply
        if (data.Like.TweetId === null) delete data.Like
        if (data.Subscribeship.id === null) delete data.Subscribeship
        if (data.Followship.id === null) delete data.Followship
      })
      io.to(loginUser.socketId).emit('all notification', notifications)
    } catch (err) {
      console.warn(err)
    }
  })
}