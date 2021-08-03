let users = require('./api/users')
let tweets = require('./api/tweet')
let admins = require('./api/admin')
let followships = require('./api/followships')
const path = require('path')
const db = require('../models/')
const Room = db.Room
const Message = db.Message
const User = db.User
const sequelize = require('sequelize')
const { Op, QueryTypes } = require('sequelize')

module.exports = (app) => {
  //  local test socket
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname,'../index.html'))

  // })
  app.get('/test', async (req, res) => {
    let userId = +req.query.userId
    const roomOption = {
      where: {
        [Op.or]: [{ User1Id: userId }, { User2Id: userId }],
        [Op.and]: [
          sequelize.literal(
            'EXISTS (select createdAt from Messages where Messages.RoomId = Room.id LIMIT 1)'
          )
        ]
      },
      include: [
        {
          model: Message,
          as: 'Messages',
          limit: 1,
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id'],
            },
          ],
          order: [['createdAt', 'desc']]
        },
        {
          model: User,
          as: 'User1',
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: User,
          as: 'User2',
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ],
      attributes: {
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt']
      },
      order: [[sequelize.literal(
        '(select createdAt from Messages where Messages.RoomId = Room.id order by Messages.createdAt DESC LIMIT 1)'
      ), 'DESC']],
      limit: 5
    }
    const rooms = await Room.findAll(roomOption)
      .then((rooms) => {
        rooms.forEach((room) => {
          const user = room.dataValues.User1.dataValues.id !== userId ? room.dataValues.User1.dataValues : room.dataValues.User2.dataValues
          room.dataValues.lastMsg = {}
          room.dataValues.lastMsg.fromRoomMember = room.dataValues.Messages[0].dataValues.User.id !== userId
          room.dataValues.lastMsg.content = room.dataValues.Messages[0].dataValues.content
          room.dataValues.lastMsg.createdAt = room.dataValues.Messages[0].dataValues.createdAt
          room.dataValues.roomMember = user
          delete room.dataValues.Messages
          delete room.dataValues.User1
          delete room.dataValues.User2
          return room.dataValues
        })
        return res.json(rooms)
      })
  })
  app.use('/api/users', users)
  app.use('/api/tweets', tweets)
  app.use('/api/admin', admins)
  app.use('/api/followships', followships)
  app.use('/', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Page not found.',
    })
  })
}
