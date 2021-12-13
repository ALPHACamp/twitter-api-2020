let users = require('./api/users')
let tweets = require('./api/tweet')
let admins = require('./api/admin')
let followships = require('./api/followships')
const path = require('path')
const db = require('../models/')
const TimelineRecord = db.TimelineRecord
const Message = db.Message
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const sequelize = require('sequelize')
const { Op, QueryTypes } = require('sequelize')
const socketService = require('../service/socketService')

module.exports = (app) => {
  //  local test socket
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname,'../index.html'))

  // })
  app.get('/test', async (req, res) => {
    let offset = +req.query.offset
    let limit = +req.query.limit
    let userId = 1
    let timestamp = new Date()
    let SeenRecords = []
    const UnseenRecords = await TimelineRecord.findAll({
      offset,
      limit,
      where: {
        UserId: userId,
        createdAt: {
          [Op.gt]: timestamp
        }
      },
      order: [['createdAt', 'desc']]
    })
    if (limit - UnseenRecords.length > 0) {
      SeenRecords = await TimelineRecord.findAll({
        offset: offset + UnseenRecords.length,
        limit: limit - UnseenRecords.length,
        where: {
          UserId: userId
        },
        order: [['createdAt', 'desc']]
      })
    }
    const Unseen = await Promise.all(UnseenRecords.map(async (record) => { return await socketService.parseTimelineData(record) }))
    const Seen = await Promise.all(SeenRecords.map(async (record) => { return await socketService.parseTimelineData(record) }))
    return res.json({ Unseen, Seen })
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
