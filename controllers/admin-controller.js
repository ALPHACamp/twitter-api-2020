const adminServices = require('../services/admin-service')

const adminController = {
  getTweets: (req, res, next) =>{
    adminServices.getTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUsers: (req, res, next) =>{
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json(data.users))
  },
  getTweet: (req, res, next) =>{
    adminServices.getTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteTweet: (req, res, next) =>{
    adminServices.deleteTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
}  

module.exports = adminController