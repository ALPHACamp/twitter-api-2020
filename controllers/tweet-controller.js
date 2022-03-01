const authHelpers = require('../_helpers')
const {
  Tweet, User, Like,
  Reply, sequelize
} = require('../models')

const tweetController = {
  // 回傳所有推文(包含當前使用者回覆以及喜歡的推文)
  getTweets: async (req, res, next) => {
    try {
      const loginUserId = authHelpers.getUser(req).id
      let findOption = {}

      if (req.query && req.query.page) {
        let offset = 0
        const limit = Number(req.query.limit) || 20
        if (req.query.page) {
          offset = (Number(req.query.page - 1)) * limit
        }

        // 推文要包含作者
        findOption = {
          include: [
            { model: User, as: 'TweetAuthor', attributes: { exclude: ['password'] } }
          ],
          order: [
            ['createdAt', 'DESC']
          ],
          offset,
          limit,
          nest: true
        }


      } else {
        // 推文要包含作者
        findOption = {
          include: [
            { model: User, as: 'TweetAuthor', attributes: { exclude: ['password'] } }
          ],
          order: [
            ['createdAt', 'DESC']
          ],
          nest: true
        }
      }


      const tweets = await Tweet.findAll(findOption)

      // 獲取一個目前使用者所喜歡的推文之清單
      const likeTweets = await Like.findAll({
        attributes: ['TweetId'],
        where: { UserId: loginUserId },
        raw: true
      })

      // 獲取一個目前使用者所回覆過的推文之清單
      const replyTweets = await Reply.findAll({
        attributes: ['TweetId'],
        where: { UserId: loginUserId },
        raw: true
      })

      // 回傳一份所有推文清單(若目前使用者有喜歡或有評論會用isLiked和isReplied來標記)
      const results = tweets.map(tweet => {
        return {
          ...tweet.toJSON(),
          isLiked: likeTweets.some(lt => lt.TweetId === tweet.id),
          isReplied: replyTweets.some(rt => rt.TweetId === tweet.id)
        }
      })

      return res
        .status(200)
        .json(results)

    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  },
  getTweet: async (req, res, next) => {

    try {
      const error = new Error()
      const targetTweetId = req.params.id
      const loginUserId = authHelpers.getUser(req).id

      // 找不到推文
      if (isNaN(targetTweetId) || !(await Tweet.findByPk(targetTweetId))) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }

      // 獲取一個推文(含推文下的所有回覆、推文作者)
      const tweet = await Tweet.findByPk(targetTweetId, {
        include: [
          {
            model: User,
            as: 'TweetAuthor',
            attributes: { exclude: ['password'] }
          },
          {
            model: Reply, include: [
              {
                model: User,
                as: 'ReplyAuthor',
                attributes: { exclude: ['password'] }
              }
            ]
          }
        ]
      })


      // 獲取一個目前使用者所喜歡的推文之清單
      const likeTweets = await Like.findAll({
        attributes: ['TweetId'],
        where: { UserId: loginUserId },
        raw: true
      })

      // 獲取一個目前使用者所回覆過的推文之清單
      const replyTweets = await Reply.findAll({
        attributes: ['TweetId'],
        where: { UserId: loginUserId },
        raw: true
      })

      tweet.dataValues.isLiked = likeTweets.some(lt => lt.TweetId === tweet.id)
      tweet.dataValues.isReplied = replyTweets.some(rt => rt.TweetId === tweet.id)

      return res
        .status(200)
        .json(tweet)
    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }

  },
  postTweets: async (req, res, next) => {
    try {
      const error = new Error()
      const { description } = req.body

      // 推文內容為空
      if (!description) {
        error.code = 400
        error.message = '推文內容不能為空白'
        return next(error)
      }

      // 推文內容超過140字
      if (description.length > 140) {
        error.code = 400
        error.message = '推文字數限制在 140 字以內'
        return next(error)
      }
      const loginUserId = authHelpers.getUser(req).id

      // 正常新增
      const data = await sequelize.transaction(async t => {

        const [result] = await Promise.all([
          // 新增推文
          Tweet.create({
            UserId: loginUserId, description
          }, { transaction: t }),
          // 增加使用者推文數
          User.increment('tweetCount', {
            where: { id: loginUserId }, by: 1,
            transaction: t
          })
        ])

        return result
      })
      
      return res
        .status(200)
        .json({
          status: 'success',
          message: '已新增推文內容',
          data
        })

    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  }
}

exports = module.exports = tweetController