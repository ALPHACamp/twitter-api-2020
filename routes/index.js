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
    const roomOption = {
      where: {
        [Op.or]: [{ User1Id: 1 }, { User2Id: 1 }],
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
          order: [['createdAt', 'DESC']]
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
        include: [
          [
            sequelize.literal(
              '(select createdAt from Messages where Messages.RoomId = Room.id order by Messages.createdAt DESC LIMIT 1)'
            ),
            'lastMsgTime'
          ]
        ],
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt']
      },
      order: [[sequelize.literal('lastMsgTime'), 'DESC']],
      limit: 5
    }
    const rooms = await Room.findAll(roomOption)
      .then((rooms) => {
        rooms.forEach((room) => {
          const user = room.dataValues.User1.dataValues.id !== 1 ? room.dataValues.User1.dataValues : room.dataValues.User2.dataValues
          room.dataValues.Message = room.dataValues.Messages[0].dataValues.content
          room.dataValues.User = user
          room.dataValues.lastMsgTime = room.dataValues.Messages[0].dataValues.createdAt
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
      message: 'Page not found.'
    })
  })
}
