const userServices = require('../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json( data ))
  },
  getTweetsOfUser: (req, res, next) => {
    userServices.getTweetsOfUser(req, (err, data) => err ? next(err) : res.json( data ))//特別注意要是陣列
  },
  getRepliesOfTweet: (req, res, next) => {
    userServices.getRepliesOfTweet(req, (err, data) => err ? next(err) : res.json(data))//特別注意要是陣列
  }
}

module.exports = userController
