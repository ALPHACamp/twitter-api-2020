const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const helpers = require('../_helpers.js')

// 撈取此使用者是否按這則回應讚 (return true or false)
const getUserLike = (reply, UserId) => {
  return Like.findOne({
    where: { ReplyId: reply.id, UserId }
  })
    .then(like => {
      if (like) return true
      return false
    })
}

const replyController = {
  postReply: (req, res) => {
    const { comment } = req.body

    if (comment.trim().length === 0) {
      return res.json({ status: 'error', message: '內容不可為空白' })
    }
    if (comment.trim().length > 140) {
      return res.json({ status: 'error', message: '內容不可超過 140 個字元' })
    }

    return Reply.create({
      comment: comment,
      TweetId: req.params.tweet_id,
      UserId: helpers.getUser(req).id
    })
      .then(reply => {
        res.status(200).json({ status: 'success', message: '成功建立回覆' })
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  getReplies: (req, res) => {
    return Reply.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      where: { TweetId: req.params.tweet_id },
      include: [User]
    })
      .then(replies => {
        if (replies.length === 0) {
          return res.json({ status: 'success', message: '推文尚未有任何回覆' })
        } else {
          const repliesData = replies.map(async (reply) => {
            const isLiked = await getUserLike(reply, helpers.getUser(req).id)

            // 回傳值過濾 (role >> isAdmin, remove password)
            reply.User.isAdmin = Boolean(Number(reply.User.role))
            delete reply.User.password
            delete reply.User.role

            return {
              status: 'success',
              message: '取得推文的回覆',
              isLiked,
              ...reply
            }
          })
          return Promise.all(repliesData)
        }
      })
      .then(results => {
        console.log([...results])

        // 回傳每則回覆的資料
        res.json([...results])
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  deleteReply: (req, res) => {
    return Reply.findByPk(req.params.reply_id, { include: [Tweet] })
      .then(reply => {
        console.log('=== reply ===', reply.toJSON())
        const userId = helpers.getUser(req).id
        const data = reply.toJSON()

        // 如果使用者 = tweet 作者 => 刪除
        // 如果使用者 = reply 作者 => 刪除
        if (userId === data.UserId || userId === data.Tweet.UserId) {
          return reply.destroy()
            .then(reply => {
              console.log('回覆已刪除')
              return res.json({ status: 'success', message: '回覆已刪除' })
            })
        } else {
          console.log('沒有權限刪除此回覆')
          return res.json({ status: 'error', message: '沒有權限刪除此回覆' })
        }
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  addReplyLike: (req, res) => {
    const userId = helpers.getUser(req).id
    const replyId = req.params.id

    return Like.findOne({ where: { UserId: userId, ReplyId: replyId } })
      .then(like => {
        // 使用者已按過回覆讚 => 報錯
        if (like) {
          return res.json({ status: 'error', message: '使用者不可重覆按讚', isLikedByLoginUser: true })
        }

        return Like.create({
          UserId: userId,
          ReplyId: replyId
        })
          .then(like => {
            return Reply.findByPk(replyId)
              .then(reply => {
                // 回覆的 likeCount + 1
                return reply.update({
                  likeCount: reply.likeCount + 1
                })
                  .then(reply => res.json({ status: 'success', message: '使用者已給回覆一個讚', isLikedByLoginUser: true }))
              })
          })
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  removeReplyLike: (req, res) => {
    const userId = helpers.getUser(req).id
    const replyId = req.params.id

    return Like.findOne({ where: { UserId: userId, ReplyId: replyId } })
      .then(like => {
        // 如果沒有按回覆讚 => 報錯
        if (!like) {
          return res.json({ status: 'error', message: '使用者尚未給回覆按讚', isLikedByLoginUser: false })
        }

        return like.destroy()
          .then(like => {
            return Reply.findByPk(replyId)
              .then(reply => {
                // reply 的 likeCount - 1
                return reply.update({
                  likeCount: reply.likeCount - 1
                })
                  .then(reply => res.json({ status: 'success', message: '使用者已對回覆移除讚', isLikedByLoginUser: false }))
              })
          })
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  }
}

module.exports = replyController
