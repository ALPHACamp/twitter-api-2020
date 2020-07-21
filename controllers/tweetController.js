const db = require('../models')
const Tweet = db.Tweet
const helpers = require('../_helpers.js')

const tweetController = {
  postTweet: (req, res) => {
    // 初始值去除空白字元
    const description = (req.body.description) ? req.body.description.trim() : req.body.description

    if (!description) return res.json({ status: 'error', message: '內容請勿空白' })
    if (description.length > 140) return res.json({ status: 'error', message: '內容請勿超過 140 個字' })

    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description
    })
      .then(tweet => {
        return res.json({ status: 'success', message: '成功建立一則推文資料' })
      })
      .catch(err => {
        console.log(err) // error for us to see
        return res.json({ status: 'error', message: '建立推文資料失敗' }) // fail message for user to know
      })
  }
}

module.exports = tweetController
