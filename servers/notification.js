const db = require('../models')
const { Notification, Subscribeship, Tweet, User } = db
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

      //前端要自己根據資料拼湊出： xxx有新的推文通知
      io.to(notifySockets).emit('tweet notify', { tweet: tweet.toJSON() })

    } catch (err) {
      console.warn(err)
    }
  })








  // console.log(userSocketIdMap) //1 => set[ ‘abc001’, ‘def002’]

}