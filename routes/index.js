let users = require('./api/users')
let tweets = require('./api/tweet')
let admins = require('./api/admin')
let followships = require('./api/followships')
const path = require('path')
const db = require('../models/')
const Room = db.Room
const Message = db.Message
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const TimelineRecord = db.TimelineRecord
const sequelize = require('sequelize')
const { Op, QueryTypes } = require('sequelize')
const socketService = require('../service/socketService')

module.exports = (app) => {
  //  local test socket
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname,'../index.html'))

  // })
  app.get('/test', async (req, res) => {

    let  data = await TimelineRecord.create({
      UserId:2,
      LikeId:10
    })
    data= data.toJSON()
    console.log(data)
    res.json(data)
  })
  app.use('/api/users', users)
  app.use('/api/tweets', tweets)
  app.use('/api/admin', admins)
  app.use('/api/followships', followships)
  app.use('/', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Page not found.'
    })
  })
}
