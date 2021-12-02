// 載入所需套件
const { Tweet, User } = require('../models')
const helpers = require('../_helpers')

const tweetService = {
  postTweet: async (req, res, callback) => {
    try {
      const { description } = req.body
      //確認發文欄是否有填寫
      if (!description) {
        return callback({ status: 'error', message: '需輸入內文才能發文' })
      } else {
        await Tweet.create({
          description,
          UserId: helpers.getUser(req).id
        })
        return callback({ status: 'success', message: '成功發文' })
      }
    } catch (err) {
      console.log(err)
    }
  },

  getTweets: async (req, res, callback) => {
    try {
      //撈出tweet資料，並取得關聯User的資料
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [{ model: User, attribute: ['id', 'account', 'name', 'avatar',] }],
        order: [['createdAt', 'DESC']]
      })

      return callback(tweets)
    } catch (err) {
      console.log(err)
    }
  }
}

// tweetController exports
module.exports = tweetService