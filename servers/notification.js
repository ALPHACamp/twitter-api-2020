const db = require('../models')
const { Notification, Subscribeship, Tweet, User, Reply, Followship, Like } = db
const { getEmitSockets, CreateNotification } = require('../tools/helper')
module.exports = async (io, socket, loginUser, userSocketIdMap) => {

  // 通知訂閱戶
  socket.on('post tweet', async (TweetId) => {
    try {
      const subscribers = await CreateNotification('TweetId', TweetId, loginUser.id)

      // 要通知訂閱戶的資料本身
      const tweet = await Tweet.findOne({
        attributes: ['id', 'description'],
        where: { id: TweetId },
        include: { model: User, attributes: ['id', 'avatar', 'name'] },
      })
      const notifySockets = getEmitSockets(subscribers, userSocketIdMap)
      if (notifySockets.length) {
        io.to(notifySockets).emit('tweet notify', { tweet: tweet.toJSON() })
      }
    } catch (err) {
      console.warn(err)
    }
  })

  // TODO: 將相似的邏輯變成同一個事件 通知對方 notify 事件類型+紀錄id(Like, LikeId)
  socket.on('post like', async (LikeId) => {
    try {
      //只要我讚推文，我就會通知推文者
      // 要通知對方的資料本身
      let like = await Like.findOne({
        attributes: ['id'],
        where: { id: LikeId },
        include: [{ model: User, attributes: ['id', 'avatar', 'name'] }, //觸發者
        {
          model: Tweet, attributes: ['id'],
          include: { model: User, attributes: [['id', 'targetId']] }, //推文owner
        }
        ]
      })
      like = like.toJSON()
      //發送通知
      const notifySocket = getEmitSockets([like.Tweet.User], userSocketIdMap)

      // 有上線才發
      if (notifySocket.length) {
        io.to(notifySocket).emit('like notify', like)
      }

    } catch (err) {
      console.warn(err)
    }
  })

  socket.on('post reply', async (ReplyId) => {
    try {
      //我的推文，有新的回覆。只要我回覆推文，我就會通知推文者
      // 要通知推文主人的資料本身
      let reply = await Reply.findOne({
        attributes: ['comment'],
        where: { id: ReplyId },
        include: [{ model: User, attributes: ['id', 'avatar', 'name'] },
        {
          model: Tweet, attributes: ['id', 'description'],
          include: { model: User, attributes: [['id', 'targetId']] }
        } //TODO:待前端決定他要DOM出推文的內文還是回覆的內文，擇一，或都要
        ]
      })
      reply = reply.toJSON()

      //發送通知給推文主人(如果他有上線的話)
      const notifySocket = getEmitSockets([reply.Tweet.User], userSocketIdMap)

      // 有上線才發通知
      if (notifySocket.length) {
        io.to(notifySocket).emit('reply notify', reply)
      }
      // Mary有新的回應
    } catch (err) {
      console.warn(err)
    }
  })

  // 追蹤對方時，通知對方是誰追蹤了你
  socket.on('post follow', async (FollowshipId) => {
    try {
      // 追隨中的資料
      let followship = await Followship.findOne({
        attributes: ['id', 'createdAt', ['followingId', 'targetId']],
        where: {
          id: FollowshipId
        },
        include: {
          model: User, as: 'Follower', attributes: ['id', 'name', 'avatar']
        }
      })

      followship = followship.toJSON()

      //發送通知給被追的人 (如果他有上線的話)
      const notifySocket = getEmitSockets([followship], userSocketIdMap)

      if (notifySocket.length) {
        io.to(notifySocket).emit('follow notify', followship)
      }
    } catch (err) {
      console.warn(err)
    }
  })

  // 追蹤對方時，通知對方是誰追蹤了你
  socket.on('post subscribe', async (SubscribeshipId) => {
    try {
      // 要通知的訂閱資料
      let subscribeship = await Subscribeship.findOne({
        attributes: ['id', 'createdAt', ['SubscribingId', 'targetId']],
        where: {
          id: SubscribeshipId
        },
        include: {
          model: User, as: 'Subscriber', attributes: ['id', 'name', 'avatar']
        }
      })

      subscribeship = subscribeship.toJSON()

      //發送通知給被追的人 (如果他有上線的話)
      const notifySocket = getEmitSockets([subscribeship], userSocketIdMap)

      if (notifySocket.length) {
        io.to(notifySocket).emit('subscribe notify', subscribeship)
      }
    } catch (err) {
      console.warn(err)
    }
  })

  socket.on('join notification', async () => {
    try {
      // 送給前端 登入使用者所有的通知
      // TODO: 重構成getAllNotification 放在services
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