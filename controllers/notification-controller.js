const {
  User,
  Tweet,
  Reply,
  Followship,
  Notification,
  Subscription
} = require('../models')

const notificationController = {
  saveNotification: async (UserId, type) => {
    const notificationType = {
      follow: 1,
      subscription: 2,
      tweet: 3,
      reply: 4
    }

    if (!(type in notificationType)) return

    const user = await User.findByPk(UserId, {
      include: [
        {
          model: User,
          as: 'Subscribers',
          attributes: ['id']
        }
      ]
    })

    // Follow
    // Create notification for following user
    if (type === 'follow') {
      const followship = await Followship.findOne({
        where: {
          followerId: UserId
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      await Notification.create({
        UserId,
        receiverId: followship.followingId,
        type: notificationType[type]
      })
    }

    // Subscription
    // Create notification for user just subscribed
    if (type === 'subscription') {
      const subscription = await Subscription.findOne({
        where: {
          subscriberId: UserId
        },
        order: [['createdAt', 'DESC']],
        raw: true
      })

      await Notification.create({
        UserId,
        receiverId: subscription.subscribingId,
        type: notificationType[type]
      })
    }

    // Tweet
    // Create notification for every subscriber
    if (type === 'tweet') {
      const tweet = await Tweet.findOne({
        where: {
          UserId
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      for (const receiver of user.Subscribers) {
        await Notification.create({
          UserId,
          receiverId: receiver.dataValues.id,
          TweetId: tweet.id,
          type: notificationType[type]
        })
      }
    }

    // Reply
    // Create notification for tweet's owner
    if (type === 'reply') {
      const reply = await Reply.findOne({
        where: {
          UserId
        },
        include: [Tweet],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      //  Doesn't need notification for self replies
      if (UserId === reply.Tweet.UserId) return

      await Notification.create({
        UserId,
        receiverId: reply.Tweet.UserId,
        TweetId: reply.Tweet.id,
        ReplyId: reply.id,
        type: notificationType[type]
      })
    }
  }
}

module.exports = notificationController
