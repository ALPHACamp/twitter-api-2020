const adminDummy = require('./dummy/admin-dummy.json')
const adminController = {
  getUsers: (req, res, next) => {
    res.json(adminDummy.getUsers)
  },
  getTweets: (req, res, next) => {
    res.json(adminDummy.getTweets)
  },
  deleteTweet: (req, res, next) => {
    res.json(adminDummy.deleteTweet)
  }
}

module.exports = adminController
