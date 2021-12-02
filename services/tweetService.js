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
      //撈出tweet資料，並關聯User資料
      const tweets = await Tweet.findAll({
        include: User,
        order: [['createdAt', 'DESC']]
      })
      
      //將User關聯資料帶入(user.id, name, avatar, account)
      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        id: tweet.User.id,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        account: tweet.User.account
      }))

      return callback(res.json(data))
    } catch (err) {
      console.log(err)
    }
  }
}

// tweetController exports
module.exports = tweetService