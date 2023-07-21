const { emitError, findUserInPublic, findAllSubscribed, calculateDate } = require('../helper')
const { Tweet, User, Notice, Followship, Like, Reply } = require('../../models')
const { Op } = require('sequelize')

module.exports = async socket => {
  try {
    // 確認使用者是否登入
    const currentUser = findUserInPublic(socket.id, 'socketId')
    // 找出所有訂閱的人
    const subscribeds = await findAllSubscribed(currentUser.id)
    const currentDate = new Date()
    // 重跑seed之後會有超多資料這邊日期先設1天前
    const sevenDaysAgo = calculateDate(currentDate, 1)

    // 找出七天內創建的tweets
    const subscribeTweets = await Tweet.findAll({
      where: {
        userId: { [Op.in]: subscribeds },
        createdAt: { [Op.between]: [sevenDaysAgo, currentDate] }
      },
      attributes: ['id', 'description', 'createdAt'],
      include: [{ model: User, attributes: ['id', 'name'] }]
    })

    // 找出最近追蹤currentUser的users
    const newFollowers = await Followship.findAll({
      where: {
        followingId: currentUser.id,
        createdAt: { [Op.between]: [sevenDaysAgo, currentDate] }
      },
      attributes: ['followerId', 'createdAt'],
      include: [{
        model: User,
        as: 'Follower',
        attributes: ['name']
      }]
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
        { model: User, attributes: ['id', 'name'] },
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
        { model: User, attributes: ['id', 'name'] },
        { model: Tweet, attributes: ['id'] }
      ]
    })

    // 整理成新通知
    const notifications = []
    subscribeTweets.forEach(s => {
      notifications.push({
        noticeMessage: `${s.User.name}有新的推文通知`,
        description: s.description,
        createdAt: s.createdAt,
        userId: s.User.id,
        tweetId: s.id
      })
    })
    newFollowers.forEach(f => {
      notifications.push({
        noticeMessage: `${f.Follower.name}開始追蹤你`,
        createdAt: f.createdAt,
        userId: f.followerId
      })
    })

    newLikes.forEach(l => {
      notifications.push({
        noticeMessage: `${l.User.name}喜歡你的貼文`,
        createdAt: l.createdAt,
        userId: l.User.id,
        tweetId: l.Tweet.id
      })
    })

    newReplies.forEach(r => {
      notifications.push({
        noticeMessage: `${r.User.name}回覆了你的貼文`,
        comment: r.comment,
        createdAt: r.createdAt,
        userId: r.User.id,
        tweetId: r.Tweet.id
      })
    })
    // 按照時間排序，由新到舊
    notifications.sort((a, b) => b.createdAt - a.createdAt)
    // 更新noticeRead時間
    await Notice.update({ noticeRead: new Date() },
      { where: { userId: currentUser.id } })

    socket.emit('server-get-notice', notifications)
  } catch (err) {
    emitError(socket, err)
  }
}
