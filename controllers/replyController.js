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

const getLikedReplyUsers = (replyId) => {
  return Like.findAll({
    where: { ReplyId: replyId }
  })
}

const replyController = {
  postReply: (req, res) => {
    const userId = helpers.getUser(req).id
    const tweetId = req.params.tweet_id
    const { comment } = req.body

    // 確認 comment 有內容
    if (!comment || comment.trim().length === 0) {
      return res.json({ status: 'error', message: '內容不可為空白' })
    }

    // 確認 comment 長度在 140 字元內
    if (comment.trim().length > 140) {
      return res.json({ status: 'error', message: '內容不可超過 140 個字元' })
    }

    return Tweet.findByPk(tweetId)
      .then(tweet => {
        // 要回覆的推文不存在 => 報錯
        if (!tweet) {
          return res.json({ status: 'error', message: '要回覆的推文不存在' })
        }

        // 要回覆的推文存在 => 建立推文的 reply
        return Reply.create({
          comment,
          TweetId: tweetId,
          UserId: userId
        })
          .then(reply => {
            return Tweet.findByPk(tweetId)
              .then(tweet => {
                // tweet.commentCount + 1
                return tweet.increment('commentCount')
                  .then(tweet => {
                    return res.json({ status: 'success', message: '成功建立回覆' })
                  })
              })
          })
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
            .then(results => {
              // 回傳每則回覆的資料
              res.json([...results])
            })
        }
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  deleteReply: (req, res) => {
    const userId = helpers.getUser(req).id
    const tweetId = req.params.tweet_id
    const replyId = req.params.reply_id

    return Reply.findOne({
      where: { TweetId: tweetId, id: replyId },
      include: [Tweet]
    })
      .then(async (reply) => {
        // 回覆不存在 => 報錯
        if (!reply) {
          return res.json({ status: 'error', message: '回覆不存在，無法刪除' })
        }

        const likedReplyUsers = getLikedReplyUsers(replyId)

        const replyData = reply.toJSON()

        // 刪除 reply
        // 相依 tweet 的 commentCount - 1
        // 刪除 reply 的所有 like 紀錄
        // 所有按讚 user 的 likeCount - 1
        if (userId === replyData.UserId || userId === replyData.Tweet.UserId) {
          await Promise.all([
            reply.destroy(),
            Tweet.decrement('commentCount', { where: { id: tweetId } }),
            Like.destroy({ where: { ReplyId: replyId } }),
            likedReplyUsers.map(like => User.decrement('likeCount', { by: 1, where: { id: like.UserId } }))
          ])
        } else {
          return res.json({ status: 'error', message: '沒有權限刪除此回覆' })
        }
      })
      .then(reply => {
        return res.json({ status: 'success', message: '回覆已刪除' })
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
        // 使用者已按讚，不可再按讚 => 報錯
        if (like) {
          return res.json({ status: 'error', message: '使用者不可重覆按讚', isLikedByLoginUser: true })
        }

        return Reply.findByPk(replyId)
          .then(reply => {
            // like 紀錄存在且 reply 不存在 => 報錯
            if (!reply) {
              return res.json({ status: 'error', message: '回覆不存在，無法按讚' })
            } else {
              // like 紀錄存在且 reply 存在 => 更新資料
              return Like.create({
                UserId: userId,
                ReplyId: replyId
              })
                .then(like => {
                  return Reply.findByPk(replyId)
                    .then(reply => {
                      // reply 的 likeCount + 1
                      return reply.increment('likeCount')
                        .then(reply => {
                          return User.findByPk(userId)
                            .then(user => {
                              // user 的 likeCount + 1
                              return user.increment('likeCount')
                            })
                            .then(reply => res.json({ status: 'success', message: '使用者已給回覆一個讚', isLikedByLoginUser: true }))
                        })
                    })
                })
            }
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
        if (!like) {
          return Reply.findByPk(replyId)
            .then(reply => {
              // 沒有 like 紀錄且 reply 不存在  => 報錯
              if (!reply) {
                return res.json({ status: 'error', message: '回覆不存在，無法移除讚' })
              } else {
                // 沒有 like 紀錄且 reply 存在 => 報錯
                return res.json({ status: 'error', message: '使用者尚未給回覆按讚，無法移除讚', isLikedByLoginUser: false })
              }
            })
        }
        // like 紀錄存在且 reply 存在 => 刪除 like 紀錄
        return Like.destroy({ where: { ReplyId: replyId, UserId: userId } })
          .then(like => {
            return Reply.findByPk(replyId)
              .then(reply => {
                // reply.likeCount - 1
                return reply.decrement('likeCount')
                  .then(reply => {
                    return User.findByPk(userId)
                      .then(user => {
                        // user 的 likeCount - 1
                        return user.decrement('likeCount')
                      })
                      .then(reply => res.json({ status: 'success', message: '使用者已對回覆移除讚', isLikedByLoginUser: false }))
                  })
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
