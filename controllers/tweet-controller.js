const tweetServices = require('../services/tweet-services')
const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) =>
      err ? next(err) : res.status(200).json(data))  // 應測試要求要array 且第一筆要是資料一 只好拿掉 status
  },

}
module.exports = tweetController