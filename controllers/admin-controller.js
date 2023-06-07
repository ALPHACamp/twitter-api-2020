const { Tweet, User } = require('../models')
const router = require('../routes')
// const { imgurFileHandler } = require('../helpers/file-helpers') // 引入處理檔案上傳的 helper

const adminController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User]
    }).then(tweets => {
      res.send('happy')
      // return res.json({tweets})
    }).catch(err=>next(err))
  }
}

module.exports = adminController