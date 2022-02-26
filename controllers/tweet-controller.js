const tweetServices = require('../services/tweet-services')
const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) =>
      err ? next(err) : res.status(200).json(data))  // 應測試要求要array 且第一筆要是資料一 只好拿掉 status
  },
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, data) =>
      err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) =>
      err ? next(err) : res.status(200).json(data)) // 應測試要求要第一層就能找到description只好拿掉 status
  },
  putTweet: (req, res, next) => {
    tweetServices.putTweet(req, (err, data) =>
      err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
}
module.exports = tweetController