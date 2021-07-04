const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like
const User = db.User
const helpers = require('../_helpers.js')

// 撈取此使用者是否按這則貼文讚 (return true or false)
const getUserLike = (tweet, UserId) => {
  return Like.findOne({
    where: { TweetId: tweet.id, UserId }
  })
    .then(like => {
      if (like) return true
      return false
    })
}

const tweetController = {
  postTweet: (req, res) => {
    // 初始值去除空白字元
    const description = (req.body.description) ? req.body.description.trim() : req.body.description

    const User = helpers.getUser(req)

    if (!description) return res.json({ status: 'error', message: '內容請勿空白' })
    if (description.length > 140) return res.json({ status: 'error', message: '內容請勿超過 140 個字' })

    return Tweet.create({
      UserId: User.id,
      description
    })
      .then(async (tweet) => {
        // 更新使用者資料: 發布貼文數量
        await User.increment('tweetCount', { by: 1 })
        return res.json({ status: 'success', message: '成功建立一則推文資料' })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
      })
  },

  getTweet: (req, res) => {
    Tweet.findOne({
      where: { id: req.params.tweet_id },
      include: [User]
    })
      .then(async (tweet) => {
        if (!tweet) return res.json({ status: 'error', message: '找不到此筆推文資料' })

        tweet = tweet.toJSON()
        const isLikedByLoginUser = await getUserLike(tweet, helpers.getUser(req).id)

        // 回傳值過濾 (role >> isAdmin, remove password, remove UserId)
        tweet.User.isAdmin = Boolean(Number(tweet.User.role))
        delete tweet.User.role
        delete tweet.User.password
        delete tweet.UserId

        return res.json({
          status: 'success',
          message: '找到指定的貼文',
          ...tweet,
          isLikedByLoginUser
        })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
      })
  },

  getTweets: (req, res) => {
    const tweetsData = []

    return Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User]
    })
      .then(async (tweets) => {
        for (const tweet of tweets) {
          const isLikedByLoginUser = await getUserLike(tweet, helpers.getUser(req).id)

          // 回傳值過濾 (role >> isAdmin, remove password, remove UserId)
          tweet.User.isAdmin = Boolean(Number(tweet.User.role))
          delete tweet.User.role
          delete tweet.User.password
          delete tweet.UserId

          tweetsData.push({
            status: 'success',
            message: '成功找到推文資料',
            ...tweet,
            isLikedByLoginUser
          })
        }
      })
      .then(() => {
        return res.json(tweetsData)
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
      })
  },

  addTweetLike: (req, res) => {
    const loginUserId = helpers.getUser(req).id
    const tweetId = req.params.id

    return Like.findOne({
      where: {
        UserId: loginUserId,
        TweetId: tweetId
      }
    })
      .then(like => {
        // 使用者已給 tweet 按讚，不可再按讚 => 報錯
        if (like) {
          return res.json({ status: 'error', message: '使用者不可重覆按讚', isLikedByLoginUser: true })
        }

        return Tweet.findByPk(tweetId)
          .then(tweet => {
            // 沒有 like 紀錄且 tweet 不存在 => 報錯
            if (!tweet) {
              return res.json({ status: 'error', message: '推文不存在，無法按讚' })
            }

            // 沒有 like 紀錄且 tweet 存在 => 新增 like 紀錄
            return Like.create({
              UserId: loginUserId,
              TweetId: tweetId
            })
              .then(like => {
                // tweet likeCount 直接在資料庫內 + 1
                return tweet.increment('likeCount')
                  .then(tweet => {
                    return User.findByPk(loginUserId)
                      .then(user => {
                        // user likeCount 直接在資料庫內 + 1
                        return user.increment('likeCount')
                          .then(user => res.json({ status: 'success', message: '使用者已給推文一個讚', isLikedByLoginUser: true }))
                      })
                  })
              })
          })
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  removeTweetLike: (req, res) => {
    const loginUserId = helpers.getUser(req).id
    const tweetId = req.params.id

    return Like.findOne({
      where: {
        UserId: loginUserId,
        TweetId: tweetId
      }
    })
      .then(like => {
        if (!like) {
          return Tweet.findByPk(tweetId)
            .then(tweet => {
              // 沒有 like 紀錄且 tweet 不存在 => 報錯
              if (!tweet) {
                return res.json({ status: 'error', message: '推文不存在，無法移除讚' })
              } else {
                // 沒有 like 紀錄且 tweet 存在 => 報錯
                return res.json({ status: 'error', message: '使用者尚未給推文按讚，無法移除讚', isLikedByLoginUser: false })
              }
            })
        }

        // 有 like 紀錄且 tweet 存在 => 更新資料
        return Like.destroy({ where: { TweetId: tweetId, UserId: loginUserId } })
          .then(like => {
            return Tweet.findByPk(tweetId)
              .then(tweet => {
                // 推文的 likeCount - 1
                return tweet.decrement('likeCount')
                  .then(tweet => {
                    return User.findByPk(loginUserId)
                      .then(user => {
                        // user.likeCount - 1
                        return user.decrement('likeCount')
                      })
                      .then(USER => res.json({ status: 'success', message: '使用者已對推文移除讚', isLikedByLoginUser: false }))
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

module.exports = tweetController
