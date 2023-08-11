const { emitError, findUserInPublic, findAllSubscribed, calculateDate } = require('../helper')
const { Tweet, User, Notice, Followship, Like, Reply } = require('../../models')
const { Op } = require('sequelize')

module.exports = async (socket, receiverSocketId = null) => {
  try {
    // 確認使用者是否登入, receiverSocketId是接收方, 如為null代表此事件是主動發生, 非由pushNotice觸發
    const currentUser = receiverSocketId
      ? findUserInPublic(receiverSocketId, 'socketId')
      : findUserInPublic(socket.id, 'socketId')
    // 找出所有訂閱的人(id, createdAt)
    const subscribeds = await findAllSubscribed(currentUser.id)
    // 整理成id array
    const subscribedUserId = subscribeds.map(s => s.toUserId)

    // 重跑seed之後會有超多資料這邊日期先設7天前
    const currentDate = new Date()
    const sevenDaysAgo = calculateDate(currentDate, 7)

    // 找出七天內創建的tweets
    const subscribeTweets = await Tweet.findAll({
      where: {
        userId: { [Op.in]: subscribedUserId },
        createdAt: { [Op.between]: [sevenDaysAgo, currentDate] }
      },
      attributes: ['id', 'description', 'createdAt'],
      include: [{ model: User, attributes: ['id', 'name', 'avatar'] }]
    })

    // 找出最近追蹤currentUser的users
    const newFollowers = await Followship.findAll({
      where: {
        followingId: currentUser.id,
        createdAt: { [Op.between]: [sevenDaysAgo, currentDate] }
      },
      attributes: ['followerId', 'createdAt'],
      include: [
        {
          model: User,
          as: 'Follower',
          attributes: ['id', 'name', 'avatar']
        }
      ]
    })

    // 先找出currentUser發過的所有tweet Id
    const tweets = await Tweet.findAll({
      where: { userId: currentUser.id },
      attributes: ['id'],
      raw: true
    })
    const tweetsId = tweets.map(t => t.id)

    // 抓出currentUser的tweets的like
    const newLikes = await Like.findAll({
      where: {
        TweetId: { [Op.in]: tweetsId },
        createdAt: { [Op.between]: [sevenDaysAgo, currentDate] }
      },
      attributes: ['createdAt'],
      include: [
        { model: User, attributes: ['id', 'name', 'avatar'] },
        { model: Tweet, attributes: ['id'] }
      ]
    })

    // 抓出reply
    const newReplies = await Reply.findAll({
      where: {
        TweetId: { [Op.in]: tweetsId },
        createdAt: { [Op.between]: [sevenDaysAgo, currentDate] }
      },
      attributes: ['comment', 'createdAt'],
      include: [
        { model: User, attributes: ['id', 'name', 'avatar'] },
        { model: Tweet, attributes: ['id'] }
      ]
    })

    // 整理成新通知
    const notifications = []
    subscribeTweets.forEach(s => {
      // 找出訂閱該使用者的資料
      const subscribe = subscribeds.find(u => u.toUserId === s.User.id)
      // 只會show出訂閱時間後的tweets
      if (s.createdAt > subscribe.createdAt) {
        notifications.push({
          noticeMessage: `${s.User.name}有新的推文通知`,
          description: s.description,
          createdAt: s.createdAt,
          user: s.User,
          tweetId: s.id
        })
      }
    })

    newFollowers.forEach(f => {
      notifications.push({
        noticeMessage: `${f.Follower.name}開始追蹤你`,
        createdAt: f.createdAt,
        user: f.Follower
      })
    })

    newLikes.forEach(l => {
      notifications.push({
        noticeMessage: `${l.User.name}喜歡你的貼文`,
        createdAt: l.createdAt,
        user: l.User,
        tweetId: l.Tweet.id
      })
    })

    newReplies.forEach(r => {
      notifications.push({
        noticeMessage: `${r.User.name}回覆了你的貼文`,
        comment: r.comment,
        createdAt: r.createdAt,
        user: r.User,
        tweetId: r.Tweet.id
      })
    })
    // 按照時間排序，由新到舊
    notifications.sort((a, b) => b.createdAt - a.createdAt)
    // 更新noticeRead時間
    await Notice.update(
      { noticeRead: new Date() },
      { where: { userId: currentUser.id } }
    )
    // socketId = null 代表主動發送getNotice事件
    if (!receiverSocketId) {
      socket.emit('server-get-notice', notifications)
    } else {
      // 有傳ID: push-notice時觸發更新
      socket.to(receiverSocketId).emit('server-get-notice', notifications)
    }
  } catch (err) {
    emitError(socket, err)
  }
}
